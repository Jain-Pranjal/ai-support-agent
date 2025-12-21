"use client"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
const CallToActionSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-start gap-12 overflow-hidden bg-black px-4 py-16 md:gap-20 md:px-16 md:py-28">
        <motion.div
          className="flex w-full max-w-[1280px] flex-col items-center justify-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="flex w-full max-w-[768px] flex-col items-center justify-start gap-6 md:gap-8"
            variants={itemVariants}
          >
            <motion.div
              className="flex flex-col items-center justify-start gap-6 self-stretch"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center justify-start gap-3 rounded-2xl border border-gray-600 bg-black px-4 py-1.5"
                variants={itemVariants}
              >
                <div className="flex items-center justify-start gap-2">
                  <div className="font-sans text-sm leading-5 font-medium text-gray-200">
                    Let&apos;s get started
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="self-stretch text-center font-sans text-3xl leading-tight font-normal text-white md:text-5xl md:leading-[67.20px] lg:text-[56px]"
                variants={itemVariants}
              >
                Ready to transform your customer support?
              </motion.div>
              <motion.div
                className="self-stretch text-center font-sans text-base leading-6 font-normal text-white opacity-80 md:text-lg md:leading-[27px]"
                variants={itemVariants}
              >
                Elevate your e-commerce business with intelligent AI support.
                Answer customer queries instantly about returns, shipping,
                products, and policies - all powered by advanced AI technology.
              </motion.div>
            </motion.div>
            <motion.div
              className="flex items-start justify-start gap-4"
              variants={itemVariants}
            >
              <Link href="/sign-in">
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white bg-white px-6 py-3">
                  <div className="text-base leading-6 font-normal text-black">
                    Start AI Support
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default CallToActionSection
