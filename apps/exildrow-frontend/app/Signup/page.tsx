"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSignup() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const name = nameRef.current?.value;

        setError("");

        if (!email || !password || !name) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);

            await axios.post("http://192.168.2.103:8000/Signup", {
                username: email,
                password,
                name
            });

            router.push("/Signin");

        } catch (err: any) {
            console.error(err);

            if (err.response) {
                if (err.response.status === 409) {
                    setError("User already exists");
                } else if (err.response.status === 400) {
                    setError("Invalid input format");
                } else {
                    setError(err.response.data?.msg || "Something went wrong");
                }
            } else {
                setError("Network error");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            
            <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
                
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Create Account
                </h2>

                {error && (
                    <p className="text-red-400 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    
                    <div>
                        <label className="text-sm text-gray-300">Email</label>
                        <input
                            ref={emailRef}
                            type="email"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300">Password</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300">Name</label>
                        <input
                            ref={nameRef}
                            type="text"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleSignup}
                        disabled={loading}
                        className={`w-full mt-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                            loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </div>

                <p className="text-sm text-gray-400 text-center mt-6">
                    Already have an account?{" "}
                    <span
                        className="text-blue-400 cursor-pointer hover:underline"
                        onClick={() => router.push("/Signin")}
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}