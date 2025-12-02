"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white pt-10 dark:bg-gray-dark">
      <div className="container">
        <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
        <div className="py-6">
          <p className="text-center text-base text-body-color dark:text-white">
            <Link
              href="https://www.facebook.com/TumenSugalaa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              2025 © tumen Sugalaa бүх эрх хуулиар хамгаалагдсан.
            </Link>
          </p>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute right-0 top-14 z-[-1]">
        <svg width="55" height="99" viewBox="0 0 55 99" fill="none">
          <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
        </svg>
      </div>

      <div className="absolute bottom-24 left-0 z-[-1]">
        <svg width="79" height="94" viewBox="0 0 79 94" fill="none">
          <rect
            opacity="0.3"
            x="-41"
            y="26.9"
            width="66.6"
            height="66.6"
            transform="rotate(-22.9 -41 26.9)"
            fill="#D2D8E1"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
