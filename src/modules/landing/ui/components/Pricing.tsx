'use client'
import React from 'react'
import { motion } from 'framer-motion'

const Pricing = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
            },
        },
    }

    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            period: '/Forever',
            features: ['AI Chat Support', 'Basic Analytics', 'Email Support'],
            buttonText: 'Get Started',
        },
        {
            name: 'Pro',
            price: '$29',
            period: '/month',
            features: [
                'Advanced AI Features',
                'Detailed Reports',
                'Priority Support',
                'Custom Integrations',
            ],
            buttonText: 'Upgrade Now',
            popular: true,
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            features: [
                'All Pro Features',
                'Dedicated Manager',
                '24/7 Support',
                'Unlimited Usage',
            ],
            buttonText: 'Contact Sales',
        },
    ]

    return (
        <div
            id="pricing"
            className="flex h-full w-full flex-col items-center justify-center gap-12 bg-black px-4 py-16 md:gap-20 md:px-16 md:py-20"
        >
            <motion.div
                className="flex w-full max-w-[850px] flex-col items-center justify-start gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
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
                                Pricing Plans
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="self-stretch text-center font-sans text-3xl leading-tight font-normal text-white md:text-5xl md:leading-[67.20px] lg:text-[56px]"
                        variants={itemVariants}
                    >
                        Choose the perfect plan for you
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className="flex w-full max-w-[1200px] flex-col items-center justify-start gap-6 md:gap-8 lg:flex-row"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
            >
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        className={`flex w-full min-w-0 flex-1 flex-col items-start justify-start gap-8 rounded-[15px] bg-black bg-gradient-to-b from-[rgba(196,227,255,0.12)] to-[rgba(196,227,255,0.02)] p-6 md:gap-12 md:p-8 ${plan.popular ? 'border-2 border-blue-500' : ''}`}
                        variants={cardVariants}
                    >
                        {plan.popular && (
                            <div className="self-stretch text-center font-sans text-sm leading-5 font-medium text-blue-400">
                                Most Popular
                            </div>
                        )}
                        <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                            <div className="font-sans text-2xl leading-tight font-normal text-white md:text-3xl">
                                {plan.name}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <div className="font-['Roboto'] text-5xl leading-tight font-normal text-white md:text-6xl lg:text-[80px]">
                                    {plan.price}
                                </div>
                                <div className="font-sans text-lg leading-7 font-normal text-white opacity-80">
                                    {plan.period}
                                </div>
                            </div>
                        </div>
                        <ul className="flex flex-col items-start justify-start gap-2 self-stretch">
                            {plan.features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="font-sans text-sm leading-6 font-normal text-white opacity-80 md:text-base"
                                >
                                    • {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="self-stretch rounded-lg bg-white px-6 py-3 font-sans text-base font-medium text-black transition-colors hover:bg-gray-200">
                            {plan.buttonText}
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default Pricing
