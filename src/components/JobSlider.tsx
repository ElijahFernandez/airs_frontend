// components/JobSlider.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useState } from "react";
import ChangeCustomJob from "@/components/ui/modals/ChangeCustomJob"; // Import the modal component

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import { FreeMode, Pagination } from "swiper/modules";

import { ServiceData } from "../constants";

const JobSlider = () => {
  const [showModal, setShowModal] = useState(false); // Controls the modal visibility
  const [newTitle, setNewTitle] = useState<string>(''); // Holds the new title for editing
  const [currentItem, setCurrentItem] = useState<string>(''); // The item that is being edited

  const handleClick = (title: string, index: number) => {
    // Only show the modal for the last card
    if (index === ServiceData.length - 1) {
      setCurrentItem(title);
      setNewTitle(title);
      setShowModal(true); // Show the modal for editing
    } else {
      alert(title); // Show the alert for other cards
    }
  };

  const handleSubmit = () => {
    alert(`Updated title: ${newTitle}`); // Show alert with the updated title
    setShowModal(false); // Close the modal
  };

  return (
    <div className="relative">
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          700: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
        }}
        freeMode={true}
        modules={[FreeMode, Pagination]}
        className="pb-0"
      >
        {ServiceData.map((item, index) => (
          <SwiperSlide key={item.title}>
            <div
              onClick={() => handleClick(item.title, index)} // Handle the click event and pass index
              className="cursor-pointer" // Make the card clickable
            >
              <div className="bg-[#1e3a5f] rounded-md shadow-md flex flex-col justify-between items-center h-[200px] p-4 relative">
                {/* Centered Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-w-[60%] max-h-[60%] object-contain"
                    width={0}
                    height={0}
                  />
                </div>
                {/* Title bar at the bottom */}
                <div className="absolute bottom-0 w-full py-2">
                  <h1 className="text-white text-center text-xs sm:text-sm font-medium">
                    {item.title}
                  </h1>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal for editing the title */}
      <ChangeCustomJob
        showModal={showModal}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        handleSubmit={handleSubmit}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default JobSlider;
