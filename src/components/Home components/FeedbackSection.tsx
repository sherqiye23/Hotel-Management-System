"use client";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function FeedbackSection() {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        console.log("Feedback sent:", message);
        setMessage("");
    };

    return (
        <footer className="bg-gray-100 text-gray-800 py-16 mt-20">
            <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-3 text-center text-gray-900">
                    We’d love your feedback 💬
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-lg">
                    Tell us what you think about your experience. Your feedback helps us improve and make every stay better.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden"
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="grow px-4 py-3 text-gray-700 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 flex items-center gap-2 rounded-r-full transition-all duration-200 cursor-pointer"
                    >
                        <FaPaperPlane className="text-lg" />
                        Send
                    </button>
                </form>

                <div className="mt-12 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} East Hotel. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
