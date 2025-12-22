import { ReactNode } from 'react'
import Image from 'next/image'

interface AuthLayoutProps {
    children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Left side - Branding/Logo */}
            <div className="bg-primary flex flex-col p-6 md:w-1/2 md:p-10">
                <div className="flex h-full flex-col items-center justify-center pt-8 md:pt-0">
                    <Image
                        src="/Logo.png"
                        alt="AI Agent Support Logo"
                        width={420}
                        height={40}
                        className="mb-4 h-auto w-48 sm:w-56 md:mb-8 md:w-64 lg:w-72 xl:w-80"
                        priority
                        draggable={false}
                    />
                    <div className="mt-2 text-center">
                        <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base md:mt-4">
                            Get the best AI-powered support agent for your
                            customers. Sign in to get answer to your queries by AI and
                            manage your account.
                        </p>
                    </div>
                </div>
                <div className="mt-auto hidden w-full text-center text-sm text-white/60 md:block">
                    &copy; {new Date().getFullYear()} AI Agent Support. All
                    rights reserved.
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    )
}
