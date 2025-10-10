"use client";
import Link from "next/link";
import { Lobster, Gabriela } from "next/font/google";
import { useState, useEffect } from "react";

const lobster = Lobster({ 
  subsets: ["latin"],
  weight: "400",
  // variable: "--font-lobster"
});

const gabriela = Gabriela({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gabriela"
});

// Typing animation component
const TypingText = ({ text, speed = 100, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Modal component
const LotteryModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 8 digits
    if (/^\d*$/.test(value) && value.length <= 8) {
      setPhoneNumber(value);
      setIsValid(value.length === 8);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length === 8) {
      setIsLoading(true);
      setError(null);
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/search/${phoneNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Хайлт амжилтгүй боллоо');
        }
        
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.error);
        }
        
        setTicketData(data);
        setIsSubmitted(true);
      } catch (err) {
        setError(err.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
        console.error('API Error:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setIsValid(true);
    setIsSubmitted(false);
    setSelectedAmount(null);
    setTicketData(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl my-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold text-gray-900 ${lobster.className}`}>
              Сугалаа шалгах
            </h3>
            <p className={`mt-2 text-sm text-gray-600 ${gabriela.className}`}>
              Утасны дугаараа оруулна уу
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-left text-sm font-medium text-gray-700 ${gabriela.className}`}>
                  Утасны дугаар (8 орон)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="_ _ _ _ _ _ _ _"
                  className={`mt-2 w-full rounded-lg border-2 px-4 py-3 text-center text-lg font-bold tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isValid 
                      ? "border-gray-300 focus:border-red-500 bg-white text-gray-900" 
                      : "border-red-500 bg-red-50 text-gray-900"
                  }`}
                  maxLength={8}
                  disabled={isLoading}
                />
                {!isValid && (
                  <p className={`mt-1 text-sm text-red-600 ${gabriela.className}`}>
                    Утасны дугаар 8 оронтой байх ёстой
                  </p>
                )}
                {error && (
                  <p className={`mt-1 text-sm text-red-600 ${gabriela.className}`}>
                    {error}
                  </p>
                )}
                <p className={`mt-1 text-xs text-gray-500 ${gabriela.className}`}>
                  {phoneNumber.length}/8 орон
                </p>
              </div>


              <button
                type="submit"
                disabled={phoneNumber.length !== 8 || isLoading}
                className={`w-full rounded-full px-6 py-3 font-bold transition-all duration-300 ${
                  phoneNumber.length === 8 && !isLoading
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } ${gabriela.className}`}
              >
                {isLoading ? "Шалгаж байна..." : "Шалгах"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className={`text-sm text-gray-600 ${gabriela.className}`}>
                  Утасны дугаар:
                </p>
                <p className={`text-lg font-bold text-gray-900 ${gabriela.className}`}>
                  {ticketData?.phone_number || phoneNumber}
                </p>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4">
                <p className={`text-sm text-blue-600 ${gabriela.className}`}>
                  Нийт сугалаа:
                </p>
                <p className={`text-2xl font-bold text-blue-700 ${gabriela.className}`}>
                  {ticketData?.total_tickets || 0} ширхэг
                </p>
              </div>

              {ticketData && ticketData.tickets && ticketData.tickets.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <h4 className={`text-lg font-bold text-gray-900 ${gabriela.className}`}>
                    Таны сугалаанууд:
                  </h4>
                  {ticketData.tickets.map((ticket, index) => (
                    <div 
                      key={ticket.id} 
                      className={`rounded-lg p-4 border-2 ${
                        ticket.is_bonus 
                          ? 'bg-yellow-50 border-yellow-300' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`text-xs text-gray-500 ${gabriela.className}`}>
                            Дугаар #{index + 1}
                          </p>
                          <p className={`text-2xl font-bold ${
                            ticket.is_bonus ? 'text-yellow-600' : 'text-gray-900'
                          } ${lobster.className}`}>
                            {ticket.number}
                          </p>
                        </div>
                        <div className="text-right">
                          {ticket.is_bonus && (
                            <span className="inline-block px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-200 rounded-full mb-1">
                              🎁 Бонус
                            </span>
                          )}
                          <div>
                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                              ticket.is_used 
                                ? 'text-red-700 bg-red-100' 
                                : 'text-green-700 bg-green-100'
                            }`}>
                              {ticket.is_used ? '✓ Ашигласан' : '○ Ашиглаагүй'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <p className={`text-sm text-gray-700 ${gabriela.className}`}>
                          <span className="font-medium">Машин:</span> {ticket.name}
                        </p>
                        <p className={`text-xs text-gray-500 mt-1 ${gabriela.className}`}>
                          Огноо: {new Date(ticket.created_at).toLocaleDateString('mn-MN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className={`text-center text-gray-600 ${gabriela.className}`}>
                    Сугалаа олдсонгүй
                  </p>
                </div>
              )}

              <button
                onClick={handleClose}
                className={`w-full rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-white font-bold transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 ${gabriela.className}`}
              >
                Хаах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Lottery Purchase Modal
const LotteryPurchaseModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 8) {
      setPhoneNumber(value);
      setIsValid(value.length === 8);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 8 && selectedAmount) {
      setIsSubmitted(true);
    } else {
      setIsValid(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setIsValid(true);
    setIsSubmitted(false);
    setSelectedAmount(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-4xl rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold text-gray-900 ${lobster.className}`}>
              Сугалаа авах
            </h3>
            <p className={`mt-2 text-sm text-gray-600 ${gabriela.className}`}>
              Утасны дугаар болон дүн сонгоно уу
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-left text-sm font-medium text-gray-700 ${gabriela.className}`}>
                  Утасны дугаар (8 орон)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="_ _ _ _ _ _ _ _"
                  className={`mt-2 w-full rounded-lg border-2 px-4 py-3 text-center text-lg font-bold tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isValid 
                      ? "border-gray-300 focus:border-blue-500 bg-white text-gray-900" 
                      : "border-red-500 bg-red-50 text-gray-900"
                  }`}
                  maxLength={8}
                />
                {!isValid && (
                  <p className={`mt-1 text-sm text-red-600 ${gabriela.className}`}>
                    Утасны дугаар 8 оронтой байх ёстой
                  </p>
                )}
                <p className={`mt-1 text-xs text-gray-500 ${gabriela.className}`}>
                  {phoneNumber.length}/8 орон
                </p>
              </div>

              <div>
                <label className={`block text-left text-sm font-medium text-gray-700 ${gabriela.className}`}>
                  Сугалааны дүн сонгох
                </label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { amount: 20200, image: "/images/blog/blog-details-02.jpg", title: "20,000₮" },
                    { amount: 40400, image: "/images/blog/blog-details-02.jpg", title: "40,000₮" },
                    { amount: 60600, image: "/images/blog/blog-details-02.jpg", title: "60,000₮" },
                    { amount: 101000, image: "/images/blog/blog-details-02.jpg", title: "100,000₮" }
                  ].map(({ amount, image, title }) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedAmount(amount)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                        selectedAmount === amount
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="relative h-20 w-full">
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-white font-bold text-lg ${gabriela.className}`}>
                            {title}
                          </span>
                        </div>
                        {selectedAmount === amount && (
                          <div className="absolute top-2 right-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length !== 8 || !selectedAmount}
                className={`w-full rounded-full px-6 py-3 font-bold transition-all duration-300 ${
                  phoneNumber.length === 8 && selectedAmount
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } ${gabriela.className}`}
              >
                Сугалаа авах
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-900 ${lobster.className}`}>
                Сугалаа амжилттай авлаа!
              </h4> */}
              <p className={`text-gray-600 ${gabriela.className}`}>
                Таны утасны дугаар: {phoneNumber}
              </p>
              <p className={`text-gray-600 ${gabriela.className}`}>
                Сонгосон дүн: {selectedAmount?.toLocaleString()}₮
              </p>

              {/* Payment Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className={`text-lg font-bold text-gray-900 mb-4 ${gabriela.className}`}>
                  Төлбөр төлөх
                </h5>
                
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <img 
                      src={`data:image/png;base64,${PAYMENT_SUCCESS_DATA.qr_image}`}
                      alt="QR Code" 
                      className="w-32 h-32"
                    />
                  </div>
                </div>
                <div></div>
                {/* Bank Payment Options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {PAYMENT_SUCCESS_DATA.urls.map((bank, index) => (
                    <button
                      key={index}
                      className="flex items-center p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                      onClick={() => window.open(bank.link, '_blank')}
                    >
                      <img src={bank.logo} alt={bank.name} className="w-8 h-8 rounded mr-3" />
                      <div className="text-left">
                        <div className={`text-sm font-medium text-gray-900 ${gabriela.className}`}>
                          {bank.name}
                        </div>
                        <div className={`text-xs text-gray-500 ${gabriela.className}`}>
                          {bank.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                
              </div>
              
              <button
                onClick={handleClose}
                className={`w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:scale-105 ${gabriela.className}`}
              >
                Хаах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Payment success data structure
const PAYMENT_SUCCESS_DATA = {
  "invoice_id": "dc1138f8-7d19-4a10-a399-c40d7e808c48",
  "qr_text": "0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD",
  "qr_image": "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",
  "qPay_shortUrl": "https://s.qpay.mn/1QdFZD4at8",
  "urls": [
    {
      "name": "qPay wallet",
      "description": "qPay хэтэвч",
      "logo": "https://s3.qpay.mn/p/e9bbdc69-3544-4c2f-aff0-4c292bc094f6/launcher-icon-ios.jpg",
      "link": "qpaywallet://q?qPay_QRcode=0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD"
    },
    {
      "name": "Khan bank",
      "description": "Хаан банк",
      "logo": "https://qpay.mn/q/logo/khanbank.png",
      "link": "khanbank://q?qPay_QRcode=0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD"
    },
    {
      "name": "State bank 3.0",
      "description": "Төрийн банк 3.0",
      "logo": "https://qpay.mn/q/logo/state_3.png",
      "link": "statebankmongolia://q?qPay_QRcode=0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD"
    },
    {
      "name": "Xac bank",
      "description": "Хас банк",
      "logo": "https://qpay.mn/q/logo/xacbank.png",
      "link": "xacbank://q?qPay_QRcode=0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD"
    },
    {
      "name": "Trade and Development bank",
      "description": "TDB online",
      "logo": "https://qpay.mn/q/logo/tdbbank.png",
      "link": "tdbbank://q?qPay_QRcode=0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD"
    },
    {
      "name": "Social Pay",
      "description": "Голомт банк",
      "logo": "https://qpay.mn/q/logo/socialpay.png",
      "link": "socialpay-payment://q?qPay_QRcode=0002010102121531279404962794049600250913247396127540014A00000084300010108AGMOMNUB0220iDyo61I1wlFgMtD3seUH52047399530349654031005802MN5919MEIRMENINTYERNESHNL6011ULAANBAATAR62240720iDyo61I1wlFgMtD3seUH7106QPP_QR7815210379972314735790222800201630437CD"
    }
  ]
};

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <>
      <LotteryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <LotteryPurchaseModal 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)} 
      />
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        {/* Professional background image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('images/video/4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(2px)"
          }}
        ></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        
        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[1000px] text-center">
                <h1 className={`mb-8 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight ${lobster.className}`}>
                Монгол улсын хамгийн анхны Автомашины тусгай зөвшөөрөлтэй сугалаа.
                </h1>
                <p className={`mb-16 text-xl leading-relaxed text-white/90 drop-shadow-md sm:text-2xl md:text-3xl ${gabriela.className}`}>
                <TypingText 
                  text="Хүслийн хүлгээ, Түмэн сугалаанаас." 
                  speed={80}
                  className="inline-block"
                />
                </p>
                <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={`rounded-full bg-gradient-to-r from-red-500 to-red-600 px-20 py-6 text-xl font-bold text-white shadow-2xl duration-300 ease-in-out hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25 hover:scale-105 transform transition-all ${gabriela.className}`}
                    >
                      🔥 Сугалаа шалгах
                    </button>
                    <button
                     onClick={() => setIsPurchaseModalOpen(true)}
                      className={`rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-16 py-6 text-xl font-bold text-white duration-300 ease-in-out hover:bg-white/20 hover:border-white/50 hover:scale-105 transform transition-all ${gabriela.className}`}
                    >
                      Сугалаа авах
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
