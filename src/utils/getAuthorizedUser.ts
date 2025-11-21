import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/jwtType";

const SECRET = process.env.JWT_SECRET!;

export default async function getAuthorizedUser(req: NextRequest): Promise<MyJwtPayload | NextResponse> {
    try {
        const token = req.cookies.get("accessToken")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, SECRET) as MyJwtPayload;
            return decoded;
        } catch (err) {
            return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
        }
    } catch (err) {
        return NextResponse.json({ message: "Unauthorized", error: err }, { status: 401 });
    }
}

