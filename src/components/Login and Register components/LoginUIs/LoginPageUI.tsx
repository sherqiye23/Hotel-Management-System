'use client';
import React, { useState } from "react";
import styles from "../LoginRegister.module.css";
import Link from 'next/link'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { useLoginUserMutation } from "@/src/lib/features/user/userSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import axios from "axios";
import { useMyContext } from "@/src/context/UserInfoContext";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { loginSchema } from "@/src/app/schemas/userSchemas";

type Props = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
};

function LoginPageUI({ setPage }: Props) {
    const router = useRouter();
    const [loginUser] = useLoginUserMutation()
    const { setUserInfo } = useMyContext()
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={loginSchema}
            onSubmit={async (values) => {
                try {
                    await loginUser(values).unwrap();
                    const responseUser = await axios.get('/api/user/get/user', { withCredentials: true });
                    setUserInfo(responseUser.data);
                    router.push('/');
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
                            <h2>Login</h2>
                            <div className={styles.inputBx}>
                                <Field placeholder='Email' name='email' type='email' />
                                <ErrorMessage component="div" className={styles.errorMessage} name='email' />
                            </div>
                            <div className='w-full'>
                                <div className={styles.inputBx}>
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password" />
                                    <div
                                        className="text-base absolute z-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <LuEye /> : <LuEyeClosed />}
                                    </div>
                                </div>
                                <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                            </div>
                            <label className={styles.checkbox}>
                                <Field type="checkbox" name="rememberMe" />
                                Remember Me
                            </label>
                            {/* button */}
                            <div className={styles.inputBx}>
                                <input type="submit" value="Login" />
                            </div>
                            <div className={styles.links}>
                                <a className="cursor-pointer" onClick={() => setPage("inputEmail")}>Forget Password</a>
                                <Link href="/register">SignUp</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default LoginPageUI;