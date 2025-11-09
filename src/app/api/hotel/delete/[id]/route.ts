import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/src/utils/errorHandler";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { hotelIdSchema } from "@/src/app/schemas/hotelSchemas";
import Hotel from "@/src/models/hotelModel";

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
        const validatedData = await hotelIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const deletedHotel = await Hotel.findById(id)
        if (!deletedHotel) {
            return NextResponse.json({ message: "Hotel is not found" }, { status: 404 });
        }
        await Hotel.findByIdAndDelete(id);
        return NextResponse.json({ message: `Hotel deleted` }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}