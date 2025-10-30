'use client'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from "./LoginRegister.module.css";
import Link from 'next/link';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRegisterUserMutation } from '@/src/lib/features/user/userSlice';

type registerFieldsType = {
    type: string,
    name: string,
    placeholder: string
};

const registerFields: registerFieldsType[] = [
    {
        type: 'text',
        name: 'firstname',
        placeholder: 'First Name'
    },
    {
        type: 'text',
        name: 'lastname',
        placeholder: 'Last Name'
    },
    {
        type: 'email',
        name: 'email',
        placeholder: 'Email'
    },
    {
        type: 'password',
        name: 'password',
        placeholder: 'Password'
    },
]

const RegisterPageUI: React.FC = () => {
    const router = useRouter();
    const [registerUser] = useRegisterUserMutation()
    return (
        <Formik
            initialValues={{ firstname: '', lastname: '', email: '', password: '' }}
            validationSchema={Yup.object({
                firstname: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                lastname: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                email: Yup.string().email('Invalid email address').required('Required'),
                password: Yup.string().required("Password is required")
                    .trim()
                    .matches(/^\S*$/)
                    .matches(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
                        "Min 1 uppercase, 1 lowercase, 1 number & 1 special char"
                    )
                    .min(8, "Min 8 chars"),
            })}
            onSubmit={async (values) => {
                try {
                    const response = await registerUser(values).unwrap();
                    toast.success(response.message)
                    router.push('/login')
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
                            <h2>SignUp</h2>
                            {
                                registerFields.map((field: registerFieldsType) => (
                                    <div className={styles.inputBx}>
                                        <Field placeholder={field.placeholder} name={field.name} type={field.type} />
                                        <ErrorMessage component="div" className={styles.errorMessage} name={field.name} />
                                    </div>
                                ))
                            }
                            {/* button */}
                            <div className={styles.inputBx}>
                                <input type="submit" value="SignUp" />
                            </div>
                            <div className={styles.links}>
                                <Link href="/login">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default RegisterPageUI;