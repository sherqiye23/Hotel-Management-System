import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/jwtType";

const SECRET = process.env.JWT_SECRET!;

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Token is not found" }, { status: 404 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as MyJwtPayload;

    if (!decoded.isAdmin) {
      return NextResponse.json({ message: "You are not admin" }, { status: 403 });
    }

    return decoded;
  } catch (err) {
    return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
  }
}
