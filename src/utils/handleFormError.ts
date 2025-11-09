import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-hot-toast";

export function handleFormError(error: unknown) {
    if ((error as FetchBaseQueryError)?.data) {
        const err = error as FetchBaseQueryError;
        const message =
            (err.data as any)?.message ||
            (err.data as any)?.error ||
            "Something went wrong";
        toast.error(message);
    } else if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error("Something went wrong");
    }
}
