import { NextResponse } from "next/server";

export function handleError(error: unknown) {
    if (error instanceof Error && "errors" in error) {
        return NextResponse.json(
            { message: (error as any).errors.join(", "), success: false },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { message: (error as Error).message || "Server Error", success: false },
        { status: 500 }
    );
}