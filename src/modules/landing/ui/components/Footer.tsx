"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-start overflow-hidden bg-black">
      <div className="flex w-full flex-col items-center justify-center gap-12 py-16">
        <div className="flex w-full max-w-[1216px] flex-col items-start justify-start gap-8 px-4 md:px-8 lg:flex-row lg:gap-8">
          {/* Brand Section */}
          <div className="flex w-full flex-col items-start justify-start gap-8 lg:w-96">
            <div className="flex items-center justify-start gap-1.5">
              <div className="font-sans text-xl leading-[30px] font-semibold text-gray-100">
                AI Agent Support
              </div>
  
            </div>
            <div className="font-sans text-base leading-6 font-normal text-gray-300">
              Revolutionizing e-commerce support with intelligent AI. Your
              automated customer service agent, available 24/7.
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
            {/* Products Column */}
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="font-sans text-base leading-6 font-medium text-gray-400">
                  Features
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-start gap-2">
                    <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                      AI Customer Support
                    </div>
                    <Badge className="border-green-600 bg-green-800 text-xs text-green-200">
                      AI-Powered
                    </Badge>
                  </div>

                  <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                    Instant Responses
                  </div>
                  <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                    Order Tracking
                  </div>
                </div>
              </div>
            </div>

            {/* Support Column */}
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="font-sans text-base leading-6 font-medium text-gray-400">
                  Support
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    href="https://github.com/Jain-Pranjal/ai-support-agent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300"
                  >
                    Github
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/pranjalll/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300"
                  >
                    Linkedin
                  </Link>
                  <Link
                    href="https://x.com/PranjalJain03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="mailto:pranjalworkon@gmail.com"
                    className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300"
                  >
                    Mail Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Company Column */}
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="font-sans text-base leading-6 font-medium text-gray-400">
                  Company
                </div>
                <div className="flex flex-col gap-4">
                  <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                    <Link href="https://pranjaljain.dev" target="_blank" rel="noopener noreferrer">
                      About Us
                    </Link>
                  </div>
                  <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                    Our Mission
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="font-sans text-base leading-6 font-medium text-gray-400">
                  Legal
                </div>
                <div className="flex flex-col gap-4">
                  <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                    Privacy
                  </div>
                  <div className="cursor-pointer font-sans text-base leading-6 font-medium text-gray-100 transition-colors hover:text-gray-300">
                    Terms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Footer
