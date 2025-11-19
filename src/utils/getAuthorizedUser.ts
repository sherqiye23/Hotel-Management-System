import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/jwtType";

const SECRET = process.env.JWT_SECRET!;

export default async function getAuthorizedUser(req: NextRequest): Promise<MyJwtPayload | NextResponse> {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, SECRET) as MyJwtPayload;

            return decoded;

        } catch (err) {
            return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
        }
    } catch (err) {
        return NextResponse.json({ message: "Unauthorized", error: err }, { status: 401 });
    }
}
