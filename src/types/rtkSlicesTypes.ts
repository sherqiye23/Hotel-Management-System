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