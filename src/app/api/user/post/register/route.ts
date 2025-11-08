import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { registerSchema } from "@/src/app/schemas/userSchemas";
import { handleError } from "@/src/utils/errorHandler";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const validatedData = await registerSchema.validate(
            reqBody,
            { abortEarly: false }
        );
        const { firstname, lastname, email, password } = validatedData;

        // check if username or email already exists
        const user = await User.findOne({ email }).lean();;
        if (user) {
            return NextResponse.json(
                { message: 'E-mail already exists', success: false },
                { status: 400 },
            )
        }

        // hash password if the user follows all the rules
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(String(password), salt);

        // create new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save()
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        return NextResponse.json({
            message: 'SignUp successfully!',
            success: true,
            user: userWithoutPassword
        }, { status: 201 });

    } catch (error: unknown) {
        return handleError(error)
    }
}