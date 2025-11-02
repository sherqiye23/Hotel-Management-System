'use client';
import React from "react";
import styles from "../LoginRegister.module.css";
import Link from 'next/link'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { useLoginUserMutation } from "@/src/lib/features/user/userSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import axios from "axios";
import { useMyContext } from "@/src/context/UserInfoContext";

type loginFieldsType = {
    type: string,
    name: string,
    placeholder: string
};

const loginFields: loginFieldsType[] = [
    {
        type: 'email',
        name: 'email',
        placeholder: 'Email'
    },
    {
        type: 'password',
        name: 'password',
        placeholder: 'Password'
    }
]

type Props = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
};

function LoginPageUI({ setPage }: Props) {
    const router = useRouter();
    const [loginUser] = useLoginUserMutation()
    const { setUserInfo } = useMyContext()
    return (
        <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={Yup.object({
                email: Yup.string().email('Invalid email address').required('Required'),
                password: Yup.string().required('Required'),
            })}
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
                            {
                                loginFields.map((field: loginFieldsType) => (
                                    <div className={styles.inputBx}>
                                        <Field placeholder={field.placeholder} name={field.name} type={field.type} />
                                        <ErrorMessage component="div" className={styles.errorMessage} name={field.name} />
                                    </div>
                                ))
                            }
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