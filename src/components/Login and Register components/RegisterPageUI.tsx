'use client'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from "./LoginRegister.module.css";
import Link from 'next/link';

const RegisterPageUI: React.FC = () => {
    type registerFieldsType = {
        type: string,
        name: string,
        placeholder: string
    };

    const registerFields: registerFieldsType[] = [
        {
            type: 'text',
            name: 'firstName',
            placeholder: 'First Name'
        },
        {
            type: 'text',
            name: 'lastName',
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
    return (
        <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
            validationSchema={Yup.object({
                firstName: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                lastName: Yup.string()
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