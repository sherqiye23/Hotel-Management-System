import * as Yup from 'yup';

// id
export const feedbackIdSchema = Yup.object({
    id: Yup.string()
        .required('ID is required'),
});

// post and patch
export const postFeedbacksDescSchema = Yup.object({
    description: Yup.string()
        .trim()
        .required('Description is required')
        .max(100, 'Must be 100 characters or less'),
});
export const postFeedbacksMailSchema = Yup.object({
    fromMail: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required'),
});

