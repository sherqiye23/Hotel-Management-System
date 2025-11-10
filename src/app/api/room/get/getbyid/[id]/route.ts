import { roomIdSchema } from "@/src/app/schemas/roomSchemas";
import Room from "@/src/models/roomModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await roomIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const room = await Room.findById(id);
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }
        return NextResponse.json(room, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
