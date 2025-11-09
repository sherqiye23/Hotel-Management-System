"use client";
import { useMyContext } from "@/src/context/UserInfoContext";
import { usePostFeedbackMutation } from "@/src/lib/features/feedback/feedbackSlice";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";
import { postFeedbacksDescSchema } from "@/src/app/schemas/feedbackSchemas";
import { handleFormError } from "@/src/utils/handleFormError";

export default function FeedbackSection() {
    const router = useRouter()
    const [postFeedback] = usePostFeedbackMutation()
    const { userInfo } = useMyContext()

    return (
        <footer className="bg-gray-100 text-gray-800 py-16 mt-20">
            <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-3 text-center text-gray-900">
                    We’d love your feedback 💬
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-lg">
                    Tell us what you think about your experience. Your feedback helps us improve and make every stay better.
                </p>

                <Formik
                    initialValues={{ fromMail: '', description: '' }}
                    validationSchema={postFeedbacksDescSchema}
                    onSubmit={async (values, { resetForm }) => {
                        try {
                            if (!userInfo?.email) {
                                router.push("/login");
                                return;
                            }

                            const response = await postFeedback({
                                fromMail: userInfo.email,
                                description: values.description.trim(),
                            }).unwrap();

                            toast.success(response.message);
                            resetForm();
                        } catch (error) {
                            handleFormError(error);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="w-full max-w-md flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden">
                                <div className="flex flex-col grow">
                                    <Field
                                        name="description"
                                        type="text"
                                        placeholder="Share your thoughts..."
                                        className="grow px-4 py-1 sm:py-3 text-gray-700 outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`bg-indigo-500 hover:bg-indigo-600 text-white px-2 sm:px-5 py-1 sm:py-3 flex items-center gap-2 rounded-r-full transition-all duration-200 cursor-pointer ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    <FaPaperPlane className="text-sm sm:text-lg" />
                                    Send
                                </button>
                            </div>
                            <ErrorMessage
                                name="description"
                                component="div"
                                className="text-[rgb(255,35,35)] font-semibold px-4 pb-1"
                            />
                        </Form>
                    )}
                </Formik>

                <div className="mt-12 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} East Hotel. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
