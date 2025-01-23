import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useState } from "react";
import ChangeCustomJob from "@/components/ui/modals/ChangeCustomJob"; // Import the modal component
import JobCard from "@/components/ui/modals/JobCard"; // Import the new JobCard modal

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import { FreeMode, Pagination } from "swiper/modules";

import { ServiceData } from "../constants";

// Define the prop type for sessionId
interface JobSliderProps {
  sessionId: string | null; // Accept sessionId as a prop
}

const JobSlider: React.FC<JobSliderProps> = ({ sessionId }) => {
  const [showModal, setShowModal] = useState(false); // Controls the modal visibility
  const [newTitle, setNewTitle] = useState<string>(""); // Holds the new title for editing
  const [currentItem, setCurrentItem] = useState<string>(""); // The item that is being edited
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(""); // The image of the item being edited

  const handleClick = (title: string, imageUrl: string, index: number) => {
    if (index === ServiceData.length - 1) {
      // Show ChangeCustomJob modal for the last card
      setCurrentItem(title);
      setCurrentImageUrl(imageUrl);
      setNewTitle(title);
      setShowModal(true); // Show the ChangeCustomJob modal
    } else {
      // Show JobCard modal for other cards
      setCurrentItem(title);
      setCurrentImageUrl(imageUrl);
      setShowModal(true); // Show the JobCard modal
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
              onClick={() => handleClick(item.title, item.imageUrl.src, index)} // Pass both title and imageUrl
              className="cursor-pointer"
            >
              <div className="bg-gradient-to-tl from-blue-950 from-5% via-indigo-700 via-30% to-blue-950 to-80% rounded-md shadow-md flex flex-col justify-between items-center h-[200px] p-4 relative">
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
                  <h1 className="text-white text-center text-xs sm:text-xs font-small">
                    {item.title}
                  </h1>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal for ChangeCustomJob (Last Card) */}
      {showModal && currentItem && currentImageUrl && currentItem === ServiceData[ServiceData.length - 1].title ? (
        <ChangeCustomJob
          showModal={showModal}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleSubmit={handleSubmit}
          setShowModal={setShowModal}
          currentItem={currentItem} // Pass the current title
          imageUrl={currentImageUrl} // Pass the current image URL
          // sessionId={sessionId} // Pass the sessionId to the modal
        />
      ) : null}

      {/* Modal for JobCard (Other Cards) */}
      {showModal && currentItem && currentImageUrl && currentItem !== ServiceData[ServiceData.length - 1].title ? (
        <JobCard
          showModal={showModal}
          setShowModal={setShowModal}
          currentItem={currentItem} // Pass the current title
          imageUrl={currentImageUrl} // Pass the current image URL
          sessionId={sessionId} // Pass the sessionId to the modal
        />
      ) : null}
    </div>
  );
};

export default JobSlider;
