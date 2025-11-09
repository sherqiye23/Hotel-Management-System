import Hotel from "@/src/models/hotelModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const hotels = await Hotel.find({ isSoftDeleted: true }).sort({ createdAt: -1 });
        return NextResponse.json(hotels, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}

