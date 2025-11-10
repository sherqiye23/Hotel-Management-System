import Room from "@/src/models/roomModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const rooms = await Room.find({ isSoftDeleted: true }).sort({ createdAt: -1 });
        return NextResponse.json(rooms, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}

