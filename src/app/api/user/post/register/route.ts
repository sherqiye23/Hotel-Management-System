import User from "@/src/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { firstname, lastname, email, password } = reqBody;

        // check firstname
        if (!firstname.trim()) {
            return NextResponse.json({
                message: 'First Name is required.',
                success: false
            }, { status: 400 });
        }
        if (firstname.trim().length > 15) {
            return NextResponse.json({
                message: 'First Name maximum 15 characters',
                success: false
            }, { status: 400 });
        }

        // check lastname
        if (!lastname.trim()) {
            return NextResponse.json({
                message: 'Last Name is required.',
                success: false
            }, { status: 400 });
        }
        if (lastname.trim().length > 15) {
            return NextResponse.json({
                message: 'Last Name maximum 15 characters',
                success: false
            }, { status: 400 });
        }

        // check email
        if (!email.trim()) {
            return NextResponse.json({
                message: 'Email address is required.',
                success: false
            }, { status: 400 });
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                message: 'Please enter a valid email.',
                success: false
            }, { status: 400 });
        }

        // check password
        function validatePassword(password: string): string | null {
            if (password.trim().length < 8 && password.trim().length > 0) return 'Password must be at least 8 characters long';
            if (password.trim().length > 16) return 'Password must be at most 16 characters long';
            if (!/[A-Z]/.test(password)) return 'Password must include uppercase character';
            if (!/[a-z]/.test(password)) return 'Password must include lowercase character';
            if (!/\d/.test(password)) return 'Password must include number character';
            if (!/[\W_]/.test(password)) return 'Password must include special character';
            return null;
        }
        const error = validatePassword(password);
        if (error) return NextResponse.json({ message: error, success: false }, { status: 400 });

        // check if username or email already exists
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { message: 'E-mail already exists' },
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
        return NextResponse.json({
            message: 'SignUp successfully!',
            success: true,
            savedUser
        })

    } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => {
                if (el instanceof mongoose.Error.ValidatorError) {
                    return el.message;
                }
                return 'Validation error';
            });
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}