import { postRoomSchema } from "@/src/app/schemas/roomSchemas";
import Room from "@/src/models/roomModel";
import { handleError } from "@/src/utils/errorHandler";
import { uploadImageToCloudinary } from "@/src/utils/uploadImageToCloudinary";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const data = {
            name: formData.get("name")?.toString(),
            description: formData.get("description")?.toString(),
            images: (formData.getAll("images") as (File | string)[]).filter(item => item instanceof File) as File[],
            pricePerNight: formData.get("pricePerNight") ? Number(formData.get("pricePerNight")) : undefined,
        };

        const validatedData = await postRoomSchema.validate(data, { abortEarly: false });
        const { name, description, images, pricePerNight } = validatedData;

        // admin check
        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        // room check
        const room = await Room.findOne({ name }).lean();;
        if (room) {
            return NextResponse.json(
                { message: 'Room already exists', success: false },
                { status: 400 },
            )
        }
        const slug = name.toLowerCase().replace(/\s+/g, "-")

        let uploadedImageUrls: string[] = [];
        if (images && images.length > 0) {
            for (const img of images) {
                if (img instanceof File) {
                    const shortImageUrl = await uploadImageToCloudinary(img);
                    uploadedImageUrls.push(shortImageUrl);
                } else {
                    return NextResponse.json({
                        message: "Invalid image format",
                        success: false,
                    }, { status: 400 });
                }
            }
        }

        const newRoom = new Room({
            name,
            slug,
            description,
            images: uploadedImageUrls,
            pricePerNight
        });

        const savedRoom = await newRoom.save()

        return NextResponse.json({
            message: 'Room successfully created!',
            success: true,
            savedRoom
        }, { status: 201 })

    } catch (error: unknown) {
        return handleError(error)
    }
}