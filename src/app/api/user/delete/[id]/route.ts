import { userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { NextRequest, NextResponse } from "next/server";

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
        const validatedData = await userIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const deletedUser = await User.findById(id);
        if (!deletedUser) {
            return NextResponse.json({ message: "User is not found" }, { status: 404 });
        }
        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: `User deleted` }, { status: 200 });

    } catch (error: unknown) {
        return handleError(error)
    }
}