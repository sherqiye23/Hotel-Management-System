import { RegisterRequest } from "./rtkSlicesTypes";

export type UserInfoContextStatesType = {
    userInfo?: UserInfoContextType | null;
    setUserInfo: (info: UserInfoContextType | null) => void;
    isLoading?: boolean;
    setIsLoading?: (info: boolean) => void;
};
export interface UserInfoContextType extends RegisterRequest {
    _id: string;
};

export interface Context {
    params: Promise<{ id: string }>;
}

export interface ContextSlug {
    params: Promise<{ slug: string; }>;
}