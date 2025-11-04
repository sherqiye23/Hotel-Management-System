import { IFeedback } from "./modelTypes";

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}
export interface LoginResponse {
    accessToken?: string;
    message?: string;
}
export interface RegisterRequest {
    firstname: string,
    lastname: string,
    email: string;
    password: string;
}
export interface RegisterResponse {
    message: string;
}
export interface UserInfoContextType extends RegisterRequest {
    _id: string;
};

// Feedback
export interface FeedbackPostResponseType {
    message: string,
    savedFeedback: IFeedback
}

export interface FeedbackPostRequestType {
    fromMail: string,
    description: string
}