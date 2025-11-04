import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    isAdmin: boolean;
    firstname: string,
    lastname: string
}