import { cookies } from "next/headers";
import mongoose from 'mongoose';
import { NextResponse } from "next/server";
import { handleError } from "@/src/utils/errorHandler";

export async function POST() {
    try {
        const cookieStore = await cookies();

        if (cookieStore.get('accessToken') || cookieStore.get('refreshToken')) {
            const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

            response.cookies.set('accessToken', '', {
                httpOnly: true,
                secure: true,
                path: '/',
                expires: new Date(0),
            });
            response.cookies.set('refreshToken', '', {
                httpOnly: true,
                secure: true,
                path: '/',
                expires: new Date(0),
            });

            return response;
        }

        return NextResponse.json({ message: 'No tokens found' }, { status: 404 });
    } catch (error: unknown) {
        return handleError(error)
    }
}