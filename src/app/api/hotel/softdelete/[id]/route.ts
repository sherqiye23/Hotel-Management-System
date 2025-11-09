import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { handleError } from "@/src/utils/errorHandler";
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

        const softdeletedHotel = await Hotel.findById(id)
        if (!softdeletedHotel) {
            return NextResponse.json({ message: "Hotel is not found" }, { status: 404 });
        }
        if (softdeletedHotel.isSoftDeleted) {
            return NextResponse.json({ message: "Hotel already soft deleted" }, { status: 400 });
        }

        softdeletedHotel.isSoftDeleted = true;
        await softdeletedHotel.save();
        return NextResponse.json({ message: `Hotel soft deleted` }, { status: 200 });

    } catch (error: unknown) {
        return handleError(error)
    }
}