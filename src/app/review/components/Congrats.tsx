import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
const Congrats = () => {
  const { theme } = useTheme();

  return (
    <div className="pb-36 pt-36 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center m-5">
        <Image
          src={theme === "dark" ? "/logos/checklogo.png" : "/logos/checklogob.png"}
          alt="AIRS Logo"
          width={150}
          height={100}
        />
      </div>

      <div className="dark:bg-black-100 flex items-center justify-center"></div>
      <h1 className="text-center text-[24px] md:text-3xl lg:text-4xl">
        Congratulations! You completed the interview.
        <br />
        <br />
      </h1>
      <h4 className="text-center text-[16px] md:text-xl lg:text-2xl">
        Let&apos;s review your performance.
      </h4>
    </div>
  );
};

export default Congrats;
