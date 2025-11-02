'use client';
import React, { useState } from "react";
import styles from "../LoginRegister.module.css";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/src/lib/features/user/userSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LuEye, LuEyeClosed } from "react-icons/lu";

type Props = {
    email: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
};

interface ResetInfo {
    newpassword: string,
    confirmpassword: string,
}

function ResetPasswordUI({ email, setPage }: Props) {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetPassword] = useResetPasswordMutation()

    return (
        <Formik
            initialValues={{ newpassword: '', confirmpassword: '' }}
            validationSchema={Yup.object({
                newpassword: Yup.string().required("Password is required")
                    .trim()
                    .matches(/^\S*$/)
                    .matches(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
                        "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                    )
                    .min(8, "Password is too short - it must be at least 8 characters long"),
                confirmpassword: Yup.string().trim().required('Confirm password is required'),
            })}
            onSubmit={async (values: ResetInfo) => {
                if (values.newpassword.trim() !== values.confirmpassword.trim()) {
                    return toast.error('New password and confirm password do not match')
                }
                try {
                    const response = await resetPassword({
                        email,
                        newPassword: values.newpassword,
                        confirmPassword: values.confirmpassword,
                    }).unwrap();
                    toast.success(response.message)
                    setPage('')
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
                            <h2>Reset Password</h2>
                            <div className="w-full">
                                <div className={styles.inputBx}>
                                    <Field
                                        type={showNewPassword ? "text" : "password"}
                                        name="newpassword"
                                        placeholder="New Password" />
                                    <div
                                        className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <LuEye /> : <LuEyeClosed />}
                                    </div>
                                </div>
                                <ErrorMessage name="newpassword" component="div" className={styles.errorMessage} />
                            </div>

                            <div className='my-2 w-full'>
                                <div className={styles.inputBx}>
                                    <Field
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmpassword"
                                        placeholder="Confirm Password" />
                                    <div
                                        className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <LuEye /> : <LuEyeClosed />}
                                    </div>
                                </div>
                                <ErrorMessage name="confirmpassword" component="div" className={styles.errorMessage} />
                            </div>
                            {/* button */}
                            <div className={styles.inputBx}>
                                <input type="submit" value="Reset Password" />
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default ResetPasswordUI;