import { hotelIdSchema } from "@/src/app/schemas/hotelSchemas";
import Hotel from "@/src/models/hotelModel";
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
        const validatedData = await hotelIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
        }
        return NextResponse.json(hotel, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
