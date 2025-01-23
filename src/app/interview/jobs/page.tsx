'use client';

import Navbar from "@/components/navbar";
import JobSlider from "@/components/JobSlider";
import GradientOverlay from "@/components/ui/GradientOverlay";
import Footer from "@/components/footer";

export default function Jobs() {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden">
            {/* GradientOverlay positioned to cover entire page */}
            <GradientOverlay />

            {/* Main Content */}
            <Navbar />
            <div className="text-center text-2xl md:text-3xl font-semibold mt-12 z-10 relative">
                Welcome to the Automated Interview Rating System!
            </div>
            <div className="text-center text-m md:text-l mb-8">
                Before we begin, please choose a job position you&apos;re interested in from the list below. <br />If your desired job isn&apos;t listed, you can select the &apos;Custom Job&apos; option to enter it manually.
            </div>
            <div className="px-8 md:px-16 lg:px-32 flex-grow z-10 relative">
                <JobSlider />
            </div>

            <div className="px-8 md:px-16 lg:px-32 mt-20 mb-12 z-10 relative">
                <p className="text-xs text-center text-gray-600">
                    For the "Custom Job", make sure the job title you enter is properly formatted, including correct punctuation and capitalization. Double-check for any spelling errors to ensure it’s clear and professional.
                </p>
            </div>
            <p className="text-xs text-center text-gray-600 mx-auto absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
                For the &quot;Custom Job&quot;, make sure the job title you enter is properly formatted, including correct punctuation and capitalization. Double-check for any spelling errors to ensure it’s clear and professional.
            </p>

            <Footer />
        </div>
    );
}
