'use client';
import React from "react";
import styles from "./LoginRegister.module.css";
import Link from 'next/link'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginPageUI: React.FC = () => {
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
    return (
        <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={Yup.object({
                email: Yup.string().email('Invalid email address').required('Required'),
                password: Yup.string().required('Required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);
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