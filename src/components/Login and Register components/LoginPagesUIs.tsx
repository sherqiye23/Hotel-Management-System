'use client'
import { useState } from 'react';
import InputEmailUI from './LoginUIs/InputEmailUI';
import VerifyOtpUI, { OTPInfo } from './LoginUIs/VerifyOtpUI';
import ResetPasswordUI from './LoginUIs/ResetPasswordUI';
import LoginPageUI from './LoginUIs/LoginPageUI';
import toast from 'react-hot-toast';
import { useForgotPasswordSendOtpMutation, useForgotPasswordVerifyOtpMutation } from '@/src/lib/features/user/userSlice';
import { handleFormError } from '@/src/utils/handleFormError';

const LoginPageUIs = () => {
    const [page, setPage] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [resendTime, setResendTime] = useState<number>(30)
    const [otpActivityTime, setOtpActivityTime] = useState<number>(5 * 60)
    const [forgotPasswordVerifyOtp] = useForgotPasswordVerifyOtpMutation()
    const [forgotPasswordSendOtp] = useForgotPasswordSendOtpMutation()

    const onSubmit = async (values: OTPInfo) => {
        try {
            const responseOtp = await forgotPasswordVerifyOtp({
                email,
                otpCode: values.otpCode
            }).unwrap();
            toast.success(responseOtp.message)
            setPage('resetPassword')
        } catch (error) {
            handleFormError(error);
        }
    };

    const resendOtpFunction = async () => {
        setResendTime(30)
        setOtpActivityTime(5 * 60)
        try {
            const responseOtp = await forgotPasswordSendOtp({ email }).unwrap();
            toast.success(responseOtp.message)
        } catch (error) {
            handleFormError(error);
        }
    }

    return (
        page == 'inputEmail' ? (<InputEmailUI setPage={setPage} setEmail={setEmail} setResendTime={setResendTime} setOtpActivityTime={setOtpActivityTime} />)
            : page == 'verifyOtp' ? (<VerifyOtpUI email={email} resendTime={resendTime} otpActivityTime={otpActivityTime} setResendTime={setResendTime} setOtpActivityTime={setOtpActivityTime} resendOtpFunction={resendOtpFunction} onSubmitFunction={onSubmit} />)
                : page == 'resetPassword' ? (<ResetPasswordUI email={email} setPage={setPage} />)
                    : (<LoginPageUI setPage={setPage} />)
    )
}

export default LoginPageUIs