"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BackgroundSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4; // We have 4 pairs of images (desktop and mobile)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const images = [
    {
      desktop: "https://static-cms-prod.vinfastauto.com/vf3-20250225.webp",
      mobile:
        "https://static-cms-prod.vinfastauto.com/vf3-20250225-mobile.webp",
    },
    {
      desktop:
        "https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Website_3060x1406px.png",
      mobile:
        "https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Mobile_540x960px.png",
    },
    {
      desktop:
        "https://static-cms-prod.vinfastauto.com/xmd_20240715_1721017659.jpg",
      mobile:
        "https://static-cms-prod.vinfastauto.com/26Aug_Vinfast-Mobile_540x960px.png",
    },
    {
      desktop: "https://static-cms-prod.vinfastauto.com/Banner-Home.jpg",
      mobile:
        "https://static-cms-prod.vinfastauto.com/VinFast_VF%208_Mobile_Lux-540x960.jpg",
    },
  ];
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full">
            <img
              src={image.desktop}
              alt={`Background ${index + 1}`}
              width={100}
              height={100}
              className="object-cover w-full h-full md:block hidden transition-opacity duration-500 ease-in-out"
            />
            <img
              src={image.mobile}
              width={100}
              height={100}
              alt={`Background ${index + 1} mobile`}
              className="object-cover w-full h-full md:hidden transition-opacity duration-500 ease-in-out"
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundSlider;
