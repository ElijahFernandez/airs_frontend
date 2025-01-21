'use client';

import Navbar from "@/components/navbar";
import JobSlider from "@/components/JobSlider";
import GradientOverlay from "@/components/ui/GradientOverlay";

export default function Jobs() {
    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="text-center text-2xl md:text-3xl font-semibold mt-12">
                Welcome to the Automated Interview Rating System!
            </div>
            <div className="text-center text-m md:text-l mb-8">
                Before we begin, please choose a job position you're interested in from the list below. <br />If your desired job isn't listed, you can select the 'Custom Job' option to enter it manually.
            </div>
            <div className="px-8 md:px-16 lg:px-32 flex-grow">
                <JobSlider />
            </div>
            <div className="pt-36">
                <div className="dark:bg-black-100 flex items-center justify-center">
                    <GradientOverlay />
                </div>
            </div>
            <p className="text-xs text-center text-gray-600 mx-auto absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
                For the "Custom Job", make sure the job title you enter is properly formatted, including correct punctuation and capitalization. Double-check for any spelling errors to ensure it’s clear and professional.
            </p>

        </div>
    );
}
