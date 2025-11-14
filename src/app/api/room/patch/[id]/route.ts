import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Room from "@/src/models/roomModel";
import { handleError } from "@/src/utils/errorHandler";
import { patchRoomSchema, roomIdSchema } from "@/src/app/schemas/roomSchemas";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { uploadImageToCloudinary } from "@/src/utils/uploadImageToCloudinary";
import { deleteImageFromCloudinary } from "@/src/utils/deleteImageFromCloudinary";

interface Context {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: Context) {
    try {
        const reqBodyRoomId = await context.params;
        const validatedDataRoomId = await roomIdSchema.validate(reqBodyRoomId, { abortEarly: false });
        const { id: roomId } = validatedDataRoomId;

        // admin check
        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        // room check
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return NextResponse.json(
                { message: "Invalid room ID", success: false },
                { status: 400 }
            );
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return NextResponse.json(
                { message: "Room not found", success: false },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const data = {
            name: formData.get("name")?.toString() ?? room.name,
            description: formData.get("description")?.toString() ?? room.description,
            images: formData.getAll("images") as (File | string)[],
            pricePerNight: formData.get("pricePerNight") ? Number(formData.get("pricePerNight")) : room.pricePerNight,
        };
        const validatedData = await patchRoomSchema.validate(data, { abortEarly: false });
        const { name, description, images, pricePerNight } = validatedData;

        const oldImages = room.images;
        let finalImages = [...oldImages];

        // images update
        for (let i = 0; i < images.length; i++) {
            const img = images[i];

            if (!(img instanceof File)) continue;

            if (img instanceof File) {
                // old images delete
                const oldImg = finalImages[i];
                if (oldImg) {
                    await deleteImageFromCloudinary(oldImg);
                }
                // new images download
                const shortUrl = await uploadImageToCloudinary(img);
                finalImages[i] = shortUrl;
            }
        }

        // room update
        room.name = name;
        room.description = description;
        room.pricePerNight = pricePerNight;
        room.images = finalImages;

        if (name !== room.name) {
            room.slug = name.toLowerCase().replace(/\s+/g, "-");
        }

        const updatedRoom = await room.save();

        return NextResponse.json(
            {
                message: "Room updated successfully",
                success: true,
                updatedRoom
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}
