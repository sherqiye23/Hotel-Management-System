'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { UserInfoContextType } from '../types/rtkSlicesTypes';
import { UserInfoContextStatesType } from '../types/contextTypes';
import axios, { AxiosError } from "axios";

export const RegisterContext = createContext<UserInfoContextStatesType | null>(null)

interface Props {
    children: ReactNode;
}
const UserInfoContext = ({ children }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userInfo, setUserInfo] = useState<UserInfoContextType | null>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/user/get/user', { withCredentials: true });
                setUserInfo(res.data);
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    try {
                        await axios.post('/api/user/post/refresh-token', {}, { withCredentials: true });
                        const response = await axios.get('/api/user/get/user', { withCredentials: true });
                        setUserInfo(response.data);
                    } catch (refreshError) {
                        setUserInfo(null);
                    }
                } else {
                    setUserInfo(null);
                }
            } finally {
                setIsLoading(false)
            }
        };

        fetchUser();
    }, [userInfo]);

    return (
        <RegisterContext.Provider value={{ userInfo, setUserInfo, isLoading, setIsLoading }}>
            {children}
        </RegisterContext.Provider>
    )
}

export default UserInfoContext;

export function useMyContext() {
    const context = useContext(RegisterContext);
    if (!context) {
        throw new Error("useMyContext must be used within a UserEmailContext provider");
    }
    return context;
}