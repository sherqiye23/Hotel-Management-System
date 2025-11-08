'use client';
import React from "react";
import styles from "../LoginRegister.module.css";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useForgotPasswordSendOtpMutation } from "@/src/lib/features/user/userSlice";
import { forgotPasswordSendOtpSchema } from "@/src/app/schemas/userSchemas";

type Props = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setResendTime: React.Dispatch<React.SetStateAction<number>>;
    setOtpActivityTime: React.Dispatch<React.SetStateAction<number>>;
};

function InputEmailUI({ setPage, setEmail, setResendTime, setOtpActivityTime }: Props) {
    const [forgotPasswordSendOtp] = useForgotPasswordSendOtpMutation()

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSendOtpSchema}
            onSubmit={async (values) => {
                try {
                    const response = await forgotPasswordSendOtp(values).unwrap();
                    toast.success(response.message)
                    setEmail(values.email)
                    setPage("verifyOtp")
                    setResendTime(30)
                    setOtpActivityTime(5 * 60)
                } catch (error) {
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
            }}
        >
            <Form>
                <div className={styles.ringContainer}>
                    <div className={styles.ring}>
                        <i style={{ "--clr": "#00ff0a" } as React.CSSProperties}></i>
                        <i style={{ "--clr": "#ff0057" } as React.CSSProperties}></i>
                        <i style={{ "--clr": "#fffd44" } as React.CSSProperties}></i>

                        <div className={styles.login}>
                            <h2>Send OTP</h2>
                            <div className={styles.inputBx}>
                                <Field placeholder='Email' name='email' type='email' />
                                <ErrorMessage component="div" className={styles.errorMessage} name='email' />
                            </div>
                            {/* button */}
                            <div className={styles.inputBx}>
                                <input type="submit" value="Send" />
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default InputEmailUI;