import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useState } from "react";
import ChangeCustomJob from "@/components/ui/modals/ChangeCustomJob";
import JobCard from "@/components/ui/modals/JobCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import { FreeMode, Pagination } from "swiper/modules";

import { ServiceData } from "../constants";

interface JobSliderProps {
  sessionId: string | null;
}

const JobSlider: React.FC<JobSliderProps> = ({ sessionId }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const handleClick = (title: string, imageUrl: string, index: number) => {
    if (index === ServiceData.length - 1) {
      setCurrentItem(title);
      setCurrentImageUrl(imageUrl);
      setNewTitle(title);
      setShowModal(true);
    } else {
      setCurrentItem(title);
      setCurrentImageUrl(imageUrl);
      setShowModal(true);
    }
  };

  const handleSubmit = () => {
    alert(`Updated title: ${newTitle}`);
    setShowModal(false);
  };

  return (
    <div className="relative h-[350px] max-h-screen overflow-hidden">
      <Swiper
        direction="vertical" // Vertical swipe
        slidesPerView={2} // Show 2 cards at a time
        spaceBetween={0} // No space between cards
        freeMode={true}
        modules={[FreeMode, Pagination]}
        className="h-full"
        breakpoints={{
          340: {
            slidesPerView: 2, // Show 2 cards even on small screens
            spaceBetween: 0, // No space on small screens
          },
          700: {
            slidesPerView: 2, // Show 2 cards on larger screens as well
            spaceBetween: 0, // No space between cards
          },
        }}
      >
        {ServiceData.map((item, index) => (
          <SwiperSlide key={item.title}>
            <div
              onClick={() => handleClick(item.title, item.imageUrl.src, index)}
              className="cursor-pointer"
            >
              <div className="bg-gradient-to-tl from-blue-950 from-5% via-indigo-700 via-30% to-blue-950 to-80% rounded-md shadow-md flex flex-row items-center h-[150px] p-4 relative">
                {/* Left side: Image */}
                <div className="w-1/3 h-full flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-contain" // Adjust size of the image
                    width={0}
                    height={0}
                  />
                </div>

                {/* Right side: Title and Description */}
                <div className="w-2/3 pl-4 flex flex-col justify-center">
                  <h1 className="text-white text-xl font-semibold">{item.title}</h1>
                  <p className="text-white text-sm mt-2">{item.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showModal && currentItem && currentImageUrl && currentItem === ServiceData[ServiceData.length - 1].title ? (
        <ChangeCustomJob
          showModal={showModal}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleSubmit={handleSubmit}
          setShowModal={setShowModal}
          currentItem={currentItem}
          imageUrl={currentImageUrl}
          sessionId={sessionId}
        />
      ) : null}

      {showModal && currentItem && currentImageUrl && currentItem !== ServiceData[ServiceData.length - 1].title ? (
        <JobCard
          showModal={showModal}
          setShowModal={setShowModal}
          currentItem={currentItem}
          imageUrl={currentImageUrl}
          sessionId={sessionId}
        />
      ) : null}
    </div>
  );
};

export default JobSlider;
