import { userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await userIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const userFind = await User.findById(id);
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }
        const role = userFind.isAdmin ? false : true;

        const updatedRole = await User.findByIdAndUpdate(id, {
            isAdmin: role,
        }, { new: true })

        return NextResponse.json(updatedRole, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}