import * as Yup from 'yup';

// post
export const registerSchema = Yup.object({
    firstname: Yup.string()
        .trim()
        .max(15, 'Firstname must be 15 characters or less')
        .required('Firstname is required'),
    lastname: Yup.string()
        .trim()
        .max(15, 'Lastname must be 15 characters or less')
        .required('Lastname is required'),
    email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .trim()
        .required("Password is required")
        .matches(/^\S*$/)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            "Password - min 1 uppercase, 1 lowercase, 1 number & 1 special char"
        )
        .min(8, "Password - min 8 characters")
        .max(16, 'Password - max 16 characters')
});

export const loginSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .trim()
        .required('Password is required'),
    rememberMe: Yup.boolean()
})

export const forgotPasswordSendOtpSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required'),
})

export const forgotPasswordVerifyOtpSchema = Yup.object({
    otpCode: Yup.string()
        .trim()
        .required("OTP is required"),
});

export const resetPasswordSchema = Yup.object({
    newpassword: Yup.string()
        .required("Password is required")
        .trim()
        .matches(/^\S*$/)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            "Password - min 1 uppercase, 1 lowercase, 1 number & 1 special char"
        )
        .min(8, "Password - min 8 characters")
        .max(16, 'Password - max 16 characters'),
    confirmpassword: Yup.string()
        .trim()
        .required('Confirm password is required')
        .oneOf([Yup.ref('newpassword')], 'Passwords must match')
})

// patch
export const userIdSchema = Yup.object({
    id: Yup.string()
        .required('ID is required'),
});

export const updateUserSchema = Yup.object({
    firstname: Yup.string()
        .trim()
        .max(15, 'Firstname must be 15 characters or less')
        .required('Firstname is required'),
    lastname: Yup.string()
        .trim()
        .max(15, 'Lastname must be 15 characters or less')
        .required('Lastname is required'),
});