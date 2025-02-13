'use client'
import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState('')
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false)
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
    const [forgotPasswordEmailStatus, setForgotPasswordEmailStatus] = useState(false)
    const [showError, setShowError] = useState(false)
    const [loader, setLoader] = useState(false)
    const message = "Email for resetting the password has been sent to your email!"
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            const result = await signIn('google', {
                callbackUrl: 'https://www.scrollconnect.com/',
                redirect: false,
            });


            if (result?.error) {
                console.log(result?.error)
                setError(result.error);
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (error) {
            setError('An error occurred during Google sign-in');
        }
    };

    useEffect(() => {
        if (error) {
            setShowError(true);
            // Auto-dismiss error after 5 seconds
            const timer = setTimeout(() => {
                setShowError(false);
                setError(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const sendOTPEmail = async (email, otp) => {

        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                subject: `Your otp for verification is ${otp}`,
                message: `Hello user, your otp is ${otp}`,
            }),
        });

        await response.json();
        if (response.ok) {
            return { status: "success" }
            // console.log('Email sent successfully:', data.message);

        } else {
            return { status: "failure" }
            // console.error('Error sending email:', data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)

        // Fetch the user from the database based on the email
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError) {
            setLoader(false)
            setError(`Email not found! Please register first or login with Google.`);
            setShowError(true);
            return;
        }

        // Check if the user is unverified
        if (user.verification_status === 'unverified') {
            setLoader(false)
            setError('Email is not verified. Please check your email for a verification link.');
            setShowError(true);
            Swal.fire({
                icon: 'warning',
                title: 'Email is not verified',
                text: 'You need to verify email to login.',
                showCancelButton: true,
                confirmButtonText: 'Verify',
                cancelButtonText: 'Cancel',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
                    const otp = generateOTP();
                    const otpExpiry = new Date(new Date().getTime() + 10 * 60000);

                    const { error: userInsertError } = await supabase
                        .from('users')
                        .update({ otp: otp, otp_expiry: otpExpiry })
                        .eq('email', email);

                    if (userInsertError) {
                        setError(userInsertError.message);
                        return;
                    }

                    const otpData = { email: email, otp: otp.toString() };

                    try {
                        // const response = await fetch('https://sigce-connect.thesamjam.xyz/otp.php', {
                        //     method: 'POST',
                        //     headers: { 'Content-Type': 'application/json' },
                        //     body: JSON.stringify(otpData),
                        // });

                        // const result = await response.json();

                        const result = await sendOTPEmail(email, otp.toString())

                        if (result.status === 'success') {
                            setSuccess('OTP sent successfully!');
                            const encryptedEmail = encodeURIComponent(btoa(email));

                            setTimeout(() => {
                                router.push(`/signup/auth/${encryptedEmail}`);
                            }, 2000);
                        } else {
                            setLoader(false)
                            setError('Failed to send OTP. Please try again.');
                            setShowError(true);
                        }

                    } catch (error) {
                        setLoader(false)
                        // console.error('Error sending OTP:', error);
                        setError('An error occurred while sending OTP.');
                        setShowError(true);
                    }
                }
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result.error) {
            setLoader(false)
            setError('Wrong email or password');
            setShowError(true);
        } else {
            const session = await getSession();
            setLoader(false)
            if (session) {
                switch (session.user.role) {
                    case 'master_admin':
                        router.push('/admin');
                        break;
                    case 'club_admin':
                        router.push('/club-admin');
                        break;
                    case 'normal_user':
                        // After successful login
                        const returnUrl = localStorage.getItem('returnUrl');

                        // Clear the stored URL
                        localStorage.removeItem('returnUrl');

                        // Redirect to the stored URL if it exists, otherwise go home
                        if (returnUrl) {
                            router.push(returnUrl);
                        } else {
                            router.push('/');
                        }
                        break;
                    default:
                        router.push('/');
                        break;
                }
            }
        }
    }

    const handleBack = () => {
        router.back();
    };

    const handleForgotPassword = () => {
        setForgotPasswordModal(!forgotPasswordModal)
    }

    const sendForgotPasswordEmail = async () => {
        try {
            // Check if user exists
            const { data: user, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('email', forgotPasswordEmail)
                .single();

            if (fetchError) {
                setError(`Error checking email availability: ${fetchError.message}`);
                return;
            }

            if (!user) {
                setError('No user found with this email');
                return;
            }

            const user_id = user.user_id;
            const user_email = user.email
            const generateUniqueId = () => Math.floor(100000 + Math.random() * 900000).toString();
            const unique_value = generateUniqueId();

            // Check for existing record - Fixed the query syntax
            const { data: existingRecord, error: checkError } = await supabase
                .from('user_forgot_password')
                .select('*')
                .eq('user_id', user_id)
                .maybeSingle(); // Use maybeSingle() instead of single()

            if (checkError) {
                console.error('Error checking existing record:', checkError);
                setError('Error processing request');
                return;
            }

            // Update or insert the record
            let upsertError;
            if (existingRecord) {
                const { error } = await supabase
                    .from('user_forgot_password')
                    .update({ unique_value, email: user_email })
                    .eq('user_id', user_id);
                upsertError = error;
            } else {
                const { error } = await supabase
                    .from('user_forgot_password')
                    .insert([{ user_id, unique_value, email: user_email }]);
                upsertError = error;
            }

            if (upsertError) {
                console.error('Error updating/inserting record:', upsertError);
                setError('Error processing request');
                return;
            }

            // Construct and send reset link
            const resetLink = `http://localhost:3000/forgotPassword?email=${encodeURIComponent(forgotPasswordEmail)}&unique_value=${encodeURIComponent(unique_value)}`;

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: forgotPasswordEmail,
                    subject: 'Password Reset Request',
                    message: `Hello, please click the following link to reset your password: ${resetLink}`,
                }),
            });

            await response.json();
            return { status: response.ok ? "success" : "failure" };

        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred');
            return { status: "failure" };
        }
    };

    const handleMagicLink = async (event) => {
        event.preventDefault();
        const res = await sendForgotPasswordEmail();
        console.log(res, 'this is response');

        if (res.status === "success") {

            setForgotPasswordEmailStatus(true);
        }
    };

    //create loader
    const createLoader = () => {
        return (
            <div className="flex justify-center items-center z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#298dff]"></div>
            </div>
        )
    }

    return (
        <>
            {loader && createLoader()}

            <div className='w-full min-h-screen flex justify-center md:items-center bg-gray-50'>

                <div className="flex flex-col ">


                    {error && showError && (
                        <div className="fixed top-4 right-4 z-50 animate-slide-in">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-md">
                                <div className="flex items-center">
                                    {/* Error Icon */}
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    {/* Error Message */}
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                    {/* Close Button */}
                                    <div className="ml-auto pl-3">
                                        <button
                                            className="inline-flex text-red-500 hover:text-red-600 focus:outline-none"
                                            onClick={() => {
                                                setShowError(false);
                                                setError(null);
                                            }}
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='md:w-[30%] w-full h-fit flex flex-col justify-start  md:border rounded-2xl md:p-14 bg-white'>
                    <div className='w-full flex items-center gap-4  mb-14 p-4 md:border-none md:p-0 border-b'>
                        <button onClick={handleBack} className='text-black hover:text-gray-700 border rounded-full w-10 h-10 flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className='md:text-2xl text-xl font-semibold'>Sign In</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full p-4 md:p-0">
                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex w-full items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    // fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    // fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    // fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    // fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative flex items-center justify-center py-6">
                            <div className="border-t w-full border-gray-300"></div>
                            <div className="absolute bg-white px-4 text-sm text-gray-500">or</div>
                        </div>

                        <div className='flex flex-col gap-2 mt-0'>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2 mt-5'>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className='flex w-full flex-col gap-2 items-end'>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    required
                                />
                                <p className="text-xs text-gray-600 flex  items-center gap-1.5">
                                    Don't remember you password?
                                    <input type="button" onClick={handleForgotPassword} className='text-blue-500' value="Forgot Password" />
                                </p>
                            </div>

                        </div>
                        <div className='w-full space-y-4'>
                            <button
                                type="submit"
                                className="inline-flex w-full mt-5 justify-center py-3 px-10 border border-transparent rounded-md shadow-sm text-base font-semibold bg-[#298dff] text-white hover:bg-[#2486F6]"
                            >
                                Sign In
                            </button>


                        </div>
                        <div className="mt-6 text-center w-full">
                            <p className="text-sm text-gray-600 w-full flex justify-center items-center gap-1.5">
                                Don't have an account?
                                <Link href="/signup" className='text-blue-500'>
                                    Register here
                                </Link>
                            </p>


                        </div>
                    </form>

                    {success && <p style={{ color: 'green' }}>{success}</p>}
                </div>
            </div>

            {forgotPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-[400px] mx-4 md:mx-0 transform transition-all">
                        {/* Header */}
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
                                <button
                                    onClick={() => setForgotPasswordModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Status Message */}
                        {forgotPasswordEmailStatus && (
                            <div className="px-6 py-3 bg-blue-50 border-y border-blue-100">
                                <p className="text-sm text-blue-700 text-center">{message}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleMagicLink} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={forgotPasswordEmailStatus}
                                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {forgotPasswordEmailStatus ? 'Email Sent' : 'Send Reset Link'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setForgotPasswordModal(false)}
                                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default LoginForm