//making of the landing page

import ScrollToTop from '@/components/global/ScrollToTop'
import SmoothScroll from '../components/SmoothScroll'
import Hero from '../components/Hero'
import Statistics from '../components/Statistics'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
// import Pricing from '../components/Pricing'
const LandingPage = () => {
    return (
        <>
            <SmoothScroll />
            <div className="bg-[#090a0a]">
                <Hero />
                <Statistics />
                {/* <Pricing /> */}
                <CTA />
                <Footer />
                <ScrollToTop />
            </div>
        </>
    )
}

export default LandingPage
