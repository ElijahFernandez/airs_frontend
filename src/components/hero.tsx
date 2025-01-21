import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import MagicButton from "./ui/MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import GradientOverlay from "./ui/GradientOverlay";

const Hero = () => {
  return (
    <div className="pb-36 pt-36">
      <div className="dark:bg-black-100 flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        {/* <div
          // chnage the bg to bg-black-100, so it matches the bg color and will blend in
          className="absolute pointer-events-none inset-0 flex-col items-center justify-center dark:bg-black-100
         bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />  */}
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">

          <Image
            src="/logos/airs-w-bgr.png"
            alt="AIRS Logo"
            width={200}
            height={150}
          />

          <TextGenerateEffect
            words="Guidance that transforms confidence into success"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Start today and take the first step toward interview success!
          </p>

          <a href="/interview/jobs">
            <MagicButton
              title="Get Started"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
