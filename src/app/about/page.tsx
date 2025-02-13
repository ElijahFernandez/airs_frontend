import Man from '../../../public/man-laptop.jpg';
import Image from "next/image";

export default function AboutPage() {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Top Section: What is Interview Rater? */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">What is AIRS?</h1>
            <p className="text-gray-600 font-bold">
              AIRS (Automated Interview Rating System) is an AI-powered tool designed 
              to help students prepare for their upcoming job interviews by providing 
              instant feedback on their responses. With a focus on entry-level positions, 
              our app helps users refine their answers, build confidence, and increase 
              their chances of securing their first job.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={Man}
              alt="Interview Illustration"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
  
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Answer Questions</strong> – Practice responding to a variety of interview 
              questions with our interactive chatbot, designed to simulate real interview scenarios.</li>
              <li><strong>Receive AI Feedback</strong> – After each conversation, get instant ratings 
              and constructive feedback to help refine your responses and improve your confidence.</li>
              <li><strong>Get Your Data</strong> – Receive a summary of your performance, including insights 
              and feedback, sent directly to your email for easy tracking and review.</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Use AIMS?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>📊 <strong>Objective Feedback</strong> – No bias, just clear, actionable suggestions.</li>
              <li>🕒 <strong>Time-Efficient</strong> – Get instant analysis instead of waiting for human feedback.</li>
              <li>🚀 <strong>Boost Confidence</strong> – Practice as much as you need to perfect your responses.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  