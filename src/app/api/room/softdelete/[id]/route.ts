import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { handleError } from "@/src/utils/errorHandler";
import { roomIdSchema } from "@/src/app/schemas/roomSchemas";
import Room from "@/src/models/roomModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await roomIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const softdeletedRoom = await Room.findById(id)
        if (!softdeletedRoom) {
            return NextResponse.json({ message: "Room is not found" }, { status: 404 });
        }
        if (softdeletedRoom.isSoftDeleted) {
            return NextResponse.json({ message: "Room already soft deleted" }, { status: 400 });
        }

        softdeletedRoom.isSoftDeleted = true;
        await softdeletedRoom.save();
        return NextResponse.json({ message: `Room soft deleted` }, { status: 200 });

    } catch (error: unknown) {
        return handleError(error)
    }
}