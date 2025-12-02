"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import TicketsTable from "../TicketsTable";

// Image Zoom Modal Component
const ImageZoomModal = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[50vh] p-4">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const [zoomModal, setZoomModal] = useState({ isOpen: false, imageSrc: "", imageAlt: "" });

  const handleImageClick = (imageSrc, imageAlt) => {
    setZoomModal({ isOpen: true, imageSrc, imageAlt });
  };

  const closeZoomModal = () => {
    setZoomModal({ isOpen: false, imageSrc: "", imageAlt: "" });
  };

  return (
    <>
      <ImageZoomModal
        isOpen={zoomModal.isOpen}
        onClose={closeZoomModal}
        imageSrc={zoomModal.imageSrc}
        imageAlt={zoomModal.imageAlt}
      />
      <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">

        {/* Tickets Table at the top */}
        <TicketsTable />

        {/* <div className="container">
          <div className="text-center mb-16">

            <h1 className="text-4xl font-bold text-black dark:text-white mb-4" style={{ fontFamily: 'var(--font-vollkorn), serif' }}>
              Сугалаанд оролцох заавар
            </h1>


          </div>
        </div>

        <div className="container">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <div className="w-full flex justify-center">
              <img
                src="images/video/7.jpg"
                alt="Pricing Option 1"
                className="w-full h-[500px] object-cover rounded-sm shadow-lg cursor-pointer hover:scale-120 transition-transform duration-300"
                onClick={() => handleImageClick("images/video/5.jpg", "Pricing Option 1")}
              />
            </div>
            <div className="w-full flex justify-center">
              <img
                src="images/video/14.jpg"
                alt="Pricing Option 2"
                className="w-full h-[500px] object-cover rounded-sm shadow-lg cursor-pointer hover:scale-120 transition-transform duration-300"
                onClick={() => handleImageClick("images/video/14.jpg", "Pricing Option 2")}
              />
            </div>
            <div className="w-full flex justify-center">
              <img
                src="images/video/15.jpg"
                alt="Pricing Option 3"
                className="w-full h-[500px] object-cover rounded-sm shadow-lg cursor-pointer hover:scale-120 transition-transform duration-300"
                onClick={() => handleImageClick("images/video/15.jpg", "Pricing Option 3")}
              />
            </div>
          </div>
        </div> */}

      </section>
    </>
  );
};

export default Pricing;
