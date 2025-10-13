"use client";
import { useState, useEffect } from "react";
import { Gabriela } from "next/font/google";

const gabriela = Gabriela({ 
  subsets: ["latin"],
  weight: "400",
});

interface Ticket {
  id: number;
  number: string;
  phone_number: string;
  name: string;
  is_bonus: boolean;
  is_used: boolean;
  created_at: string;
}

interface TicketsData {
  total: number;
  tickets: Ticket[];
}

const TicketsTable = () => {
  const [ticketsData, setTicketsData] = useState<TicketsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
      const onGhPages = !!process.env.NEXT_PUBLIC_BASE_PATH; // true only for GitHub Pages builds
      const endpoint = onGhPages ? `${backendUrl}/lottery/recent` : '/api/lottery/recent';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTicketsData(data);
    } catch (err: any) {
      setError(err.message || 'Алдаа гарлаа');
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number as XX XX XX XX
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  };

  // Pagination
  const totalPages = ticketsData ? Math.ceil(ticketsData.tickets.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = ticketsData?.tickets.slice(startIndex, endIndex) || [];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <p className={`text-red-600 dark:text-red-400 ${gabriela.className}`}>
            ❌ {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="bg-white dark:bg-gray-dark rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/90 to-primary px-4 sm:px-6 py-4">
          <h2 className={`text-xl sm:text-2xl font-bold text-white ${gabriela.className}`}>
            🎫 Сүүлийн 20 сугалаа
          </h2>
          {/* <p className={`text-white/90 text-sm mt-1 ${gabriela.className}`}>
            Нийт: {ticketsData?.total || 0} сугалаа
          </p> */}
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${gabriela.className}`}>
                  #
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${gabriela.className}`}>
                  Сугалааны дугаар
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${gabriela.className}`}>
                  Утасны дугаар
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${gabriela.className}`}>
                  Машин
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${gabriela.className}`}>
                  Огноо
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentTickets.map((ticket, index) => (
                <tr 
                  key={ticket.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    ticket.is_bonus ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''
                  }`}
                >
                  <td className={`px-4 py-3 text-sm text-gray-600 dark:text-gray-400 ${gabriela.className}`}>
                    {startIndex + index + 1}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-300 ${gabriela.className}`}>
                    {ticket.number}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-300 ${gabriela.className}`}>
                    {ticket.phone_number}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-gray-900 dark:text-white ${gabriela.className}`}>
                    {ticket.name}
                  </td>
                  <td className={`px-4 py-3 text-xs text-gray-600 dark:text-gray-400 ${gabriela.className}`}>
                    {formatDate(ticket.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Visible only on mobile */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {currentTickets.map((ticket, index) => (
            <div 
              key={ticket.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                ticket.is_bonus ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold text-gray-500 dark:text-gray-400 ${gabriela.className}`}>
                  #{startIndex + index + 1}
                </span>
                {/* {ticket.is_bonus && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    🎁 Бонус
                  </span>
                )} */}
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${gabriela.className}`}>
                    Сугалааны дугаар
                  </p>
                  <p className={`text-lg font-bold text-gray-900 dark:text-white ${gabriela.className}`}>
                    {ticket.number}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs text-gray-500 dark:text-gray-400 ${gabriela.className}`}>
                      Утас
                    </p>
                    <p className={`text-sm font-medium text-gray-900 dark:text-gray-300 ${gabriela.className}`}>
                      {ticket.phone_number}
                    </p>
                  </div>
                  
                  <div>
                    <p className={`text-xs text-gray-500 dark:text-gray-400 ${gabriela.className}`}>
                      Машин
                    </p>
                    <p className={`text-sm font-medium text-gray-900 dark:text-white ${gabriela.className}`}>
                      {ticket.name}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${gabriela.className}`}>
                    Огноо
                  </p>
                  <p className={`text-xs text-gray-600 dark:text-gray-400 ${gabriela.className}`}>
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-700">
            <div className={`text-xs sm:text-sm text-gray-700 dark:text-gray-300 ${gabriela.className}`}>
              Хуудас <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600'
                    : 'bg-primary text-white hover:bg-primary/90'
                } ${gabriela.className}`}
              >
                <span className="hidden sm:inline">← Өмнөх</span>
                <span className="sm:hidden">←</span>
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600'
                    : 'bg-primary text-white hover:bg-primary/90'
                } ${gabriela.className}`}
              >
                <span className="hidden sm:inline">Дараах →</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsTable;

