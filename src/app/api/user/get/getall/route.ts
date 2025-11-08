import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}