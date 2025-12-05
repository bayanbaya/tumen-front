"use client";

import { Ticket } from "@/types/ticket";
import Image from "next/image";

const SingleTicket = ({ ticket }: { ticket: Ticket }) => {
  const { title, image } = ticket;

  return (
    <div className="m-4 group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300">
      
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt="image"
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
          {title}
        </h4>

        <div className="text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
          <span>Дэлгэрэнгүй</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SingleTicket;
