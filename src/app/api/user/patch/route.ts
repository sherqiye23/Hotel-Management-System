import { updateUserSchema, userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const validatedDataId = await userIdSchema.validate(
            reqBody,
            { abortEarly: false }
        );
        const validatedData = await updateUserSchema.validate(
            reqBody,
            { abortEarly: false }
        );
        const { id } = validatedDataId;
        const { firstname, lastname } = validatedData;

        const userFind = await User.findById(id);
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            firstname: firstname.trim(),
            lastname: lastname.trim()
        }, { new: true })

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}