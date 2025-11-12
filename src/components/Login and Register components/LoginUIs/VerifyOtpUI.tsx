'use client';
import React, { useEffect } from "react";
import styles from "../LoginRegister.module.css";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { forgotPasswordVerifyOtpSchema } from "@/src/app/schemas/userSchemas";

export interface OTPInfo {
    otpCode: string | null,
}

type Props = {
    email: string;
    otpActivityTime: number;
    resendTime: number;
    setResendTime: React.Dispatch<React.SetStateAction<number>>;
    setOtpActivityTime: React.Dispatch<React.SetStateAction<number>>;
    onSubmitFunction: (values: OTPInfo) => Promise<void>;
    resendOtpFunction: () => Promise<void>;
};

function VerifyOtpUI({ email, resendTime, otpActivityTime, setResendTime, setOtpActivityTime, onSubmitFunction, resendOtpFunction }: Props) {
    const finalEmail = email ? email : 'serqiye.quluzade';

    useEffect(() => {
        if (resendTime <= 0) return;

        const timer = setTimeout(() => {
            setResendTime((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendTime]);

    useEffect(() => {
        if (otpActivityTime <= 0) return;

        const timer = setTimeout(() => {
            setOtpActivityTime((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [otpActivityTime]);
    return (
        <Formik
            initialValues={{ otpCode: '' }}
            validationSchema={forgotPasswordVerifyOtpSchema}
            onSubmit={onSubmitFunction}
        >
            <Form>
                <div className={styles.ringContainer}>
                    <div className={styles.ring}>
                        <i style={{ "--clr": "#00ff0a" } as React.CSSProperties}></i>
                        <i style={{ "--clr": "#ff0057" } as React.CSSProperties}></i>
                        <i style={{ "--clr": "#fffd44" } as React.CSSProperties}></i>

                        <div className={styles.login}>
                            <h2 className='font-bold text-lg text-center'>We just sent a code</h2>
                            <p className='text-center'>Enter the security code we sent to </p>
                            <p className='text-center'>
                                <span>{finalEmail.split('@')[0][0]}</span>
                                {
                                    [...Array((finalEmail.split('@')[0].length - 2))].map((_, i) => (
                                        <span key={i}>*</span>
                                    ))
                                }
                                <span>{finalEmail.split('@')[0][
                                    finalEmail.split('@')[0].length - 1
                                ]}@{finalEmail.split('@')[1]}</span>
                            </p>
                            <div className='flex items-center justify-center'>
                                <p className='text-lg font-semibold'>
                                    0{Math.floor(otpActivityTime / 60)}
                                    :
                                    {(otpActivityTime % 60) < 10 ? `0${otpActivityTime % 60}` : otpActivityTime % 60}
                                </p>
                            </div>
                            <div className={styles.inputBx}>
                                <Field placeholder='OTP' name='otpCode' type='text' />
                                <ErrorMessage component="div" className={styles.errorMessage} name='otpCode' />
                            </div>
                            {/* button */}
                            <div className={styles.inputBx}>
                                <input type="submit" value="Verify" />
                            </div>
                            <p className='text-center'>Didn&apos;t receive code?</p>
                            <div className='flex items-center justify-center'>
                                <button type='button' disabled={resendTime ? true : false} onClick={() => resendOtpFunction()}
                                    className={`text-blue-500 ${resendTime ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Resend</button>
                                <p> - 00:
                                    {
                                        resendTime < 10 ? `0${resendTime}` : resendTime
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default VerifyOtpUI;