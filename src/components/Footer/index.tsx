"use client";
import Link from "next/link";
// React Icons ашиглагдахгүй тул хасав.

const Footer = () => {
  return (
    // Суурь загвар: Илүү цэвэрхэн, минималист background
    // pt-4 pb-4 гэж багасгав.
    <footer className="relative z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-4 pb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Агуулгын үндсэн хэсэг: Зөвхөн брэнд ба копирайт */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          
          {/* 1. Брэндийн нэр/Лого */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Tumen <span className="text-primary-600 dark:text-primary-400">Sugalaa</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
            
            </p>
          </div>
          
          {/* 2. Copyright хэсэг */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
             99707070 
            </p>
            {/* Хэрэглээгүй мэйл хаягийг хасаж, дизайныг үлдээв. */}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
               © 2025 Tumen Sugalaa. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>
          
        </div>
        
      </div>

      {/* Background Decorations - Хасаж болно, эсвэл илүү зөөлөн үлдээж болно. Би зөөлөн хэвээр үлдээв. */}
      <div className="absolute top-0 right-0 z-[-1] opacity-5 dark:opacity-2">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="49.5" fill="#959CB1" />
        </svg>
      </div>

    </footer>
  );
};

export default Footer;