import React, { useState } from "react";
import Button from "./Button";
import Link from "next/link";

// Define the prop types
interface MultiStepComponentProps {
  sessionId: string | null;
}

const MultiStepComponent: React.FC<MultiStepComponentProps> = ({ sessionId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>(Array(2).fill(false)); // For Step 2
  const totalSteps = 3;

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const handleFullscreenChange = () => {
  //   if (!document.fullscreenElement) {
  //     setCurrentStep(1);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("fullscreenchange", handleFullscreenChange);
  //   return () => {
  //     document.removeEventListener("fullscreenchange", handleFullscreenChange);
  //   };
  // }, []);

  const handleCheckboxChange = (index: number) => {
    const updatedStates = [...checkboxStates];
    updatedStates[index] = !updatedStates[index];
    setCheckboxStates(updatedStates);
  };

  const allCheckboxesChecked = checkboxStates.every((isChecked) => isChecked);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Step 1: Ensure Internet Stability
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Before we begin, check that you have a stable internet connection.
            </p>
            <Button
              onClick={() => {
                goToNextStep();
              }}
            >
              Proceed to Step 2
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Step 2: Data Privacy Agreement
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Please review and agree to the following:
            </p>
            <form className="text-left space-y-4">
              {[
                "I acknowledge that my responses will be recorded and analyzed.",
                // "I understand my data will be handled securely.",
                // "I consent to the collection and storage of my data.",
                // "I may request access to or deletion of my data.",
                "I agree to the terms and conditions.",
              ].map((statement, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-300"
                    checked={checkboxStates[index]}
                    onChange={() => handleCheckboxChange(index)}
                    required
                  />
                  <label className="text-gray-700 dark:text-gray-300">
                    {index === 1 ? (
                      <>
                        I agree to the{" "}
                        <Link href="/policy/return" className="text-blue-500 underline hover:text-blue-700">
                          terms and conditions
                        </Link>.
                      </>
                    ) : (
                      statement
                    )}
                  </label>
                </div>
              ))}
              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={goToPreviousStep}>
                  Back
                </Button>
                <Button
                  onClick={goToNextStep}
                  disabled={!allCheckboxesChecked}
                  className={!allCheckboxesChecked ? "opacity-50 pointer-events-none" : ""}
                >
                  Proceed to Step 3
                </Button>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Step 3: Start the Interview</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            On the next page, use the slider to pick a job that fits your skills and interests. 
            </p>
            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={goToPreviousStep}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Redirect to /interview/jobs with sessionId as a query parameter
                  window.location.href = `/interview/jobs?session=${sessionId}`;
                }}
              >
                Proceed
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto my-12 p-9 border rounded-lg shadow bg-midnlight dark:border-white/20">
      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 dark:bg-midnlight-700 rounded mb-6">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div>{renderStepContent()}</div>
    </div>
  );
};

export default MultiStepComponent;
