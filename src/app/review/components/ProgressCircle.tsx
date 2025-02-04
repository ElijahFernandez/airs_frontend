import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressCircleProps {
  label: string;
  value: number;
  color?: string;
  description?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  label,
  value,
  color,
  description
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(value);
    }, 300); // Small delay before animating

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="w-28 text-center">
      <CircularProgressbar
        value={animatedValue}
        text={`${animatedValue}%`}
        styles={{
          path: {
            transition: "stroke-dashoffset 1.5s ease-in-out",
            stroke: color, // Use the color prop for the path color
          },
          text: {
            transition: "opacity 1s ease-in-out",
            fill: color, // Use the color prop for the text color
          },
        }}
      />
      <p
        className="mt-1 text-sm text-center pt-2 cursor-pointer"
        style={{ color }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {" "}
        {label}
      </p>
      {/* Tooltip box */}
      {isHovered && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg transition-opacity "
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
