'use client';
import React from "react";
import styles from "./LoginRegister.module.css";
import Link from 'next/link'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation"
import { ErrorResponseData } from "@/src/types/axiosErrorType";
import toast from "react-hot-toast";

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
const LoginPageUI: React.FC = () => {
    const router = useRouter();
    return (
        <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={Yup.object({
                email: Yup.string().email('Invalid email address').required('Required'),
                password: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const response = await axios.post('/api/user/post/login', values);
                    toast.success(response.data.message)
                    // router.push('/')
                    // if (response.data) {
                    //     const responseUser = await axios.get('/api/users/get/user', { withCredentials: true });
                    //     setUserInfo(responseUser.data)
                    //     // toast.success('Success login!')
                    //     router.push('/')
                    // } else {
                    //     // toast.error(response.data.error.message)
                    // }
                } catch (error) {
                    const err = error as AxiosError;
                    console.log('Failed: ', err);
                    const data = err.response?.data as ErrorResponseData;
                    const message = data?.message || data?.error || err.message;
                    console.log(message)
                    toast.error(message || 'Something went wrong');
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
                                <a href="#">Forget Password</a>
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