"use client";
import { useState, useEffect } from "react";
import { Search, Trophy, Calendar, Tag } from "lucide-react";

// --- Fake data generator ---
const generateFakeData = () => {
  const data: GroupedTicket[] = [];
  const phones = ["99119911", "88228822", "77337733", "99889988", "95559555", "98887777", "91234567"];

  // 7 хоногийн өмнө - 4 сугалаа
  data.push({
    phone_number: "99119911",
    tickets: [
      { number: "F-1001", name: "Toyota Prado", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { number: "F-1002", name: "Lexus LX600", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { number: "F-1003", name: "Mercedes G-Class", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { number: "F-1004", name: "Range Rover", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  });

  // Өнөөдөр - 2 сугалаа
  data.push({
    phone_number: "99119911",
    tickets: [
      { number: "F-2001", name: "BMW X7", created_at: new Date().toISOString() },
      { number: "F-2002", name: "Toyota Prado", created_at: new Date().toISOString() },
    ],
  });

  // Бусад сугалаанууд
  for (let i = 0; i < 50; i++) {
    const phone = phones[Math.floor(Math.random() * phones.length)];
    const ticketCount = Math.floor(Math.random() * 5) + 1;
    const daysAgo = Math.floor(Math.random() * 30);
    const tickets: Ticket[] = [];
    for (let j = 0; j < ticketCount; j++) {
      tickets.push({
        number: `F-${3000 + i * 10 + j}`,
        name: ["Toyota Prado", "Lexus LX600", "Mercedes G-Class", "Range Rover", "BMW X7"][Math.floor(Math.random() * 5)],
        created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    data.push({ phone_number: phone, tickets });
  }
  return data;
};

// --- Types ---
interface Ticket {
  number: string;
  name: string;
  created_at: string;
}
interface GroupedTicket {
  phone_number: string;
  tickets: Ticket[];
}

// --- Component ---
export default function TicketsTable() {
  const [allData, setAllData] = useState<GroupedTicket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      const data = generateFakeData();

      // Group by phone+date
      const grouped: { [key: string]: GroupedTicket } = {};
      data.forEach(item => {
        const date = new Date(item.tickets[0].created_at).toDateString();
        const key = `${item.phone_number}-${date}`;
        if (grouped[key]) {
          grouped[key].tickets.push(...item.tickets);
        } else {
          grouped[key] = { ...item };
        }
      });

      const sorted = Object.values(grouped).sort(
        (a, b) => new Date(b.tickets[0].created_at).getTime() - new Date(a.tickets[0].created_at).getTime()
      );

      setAllData(sorted);
      setLoading(false);
    }, 800);
  }, []);

  // filter
  const filtered = allData.filter(
    (group) =>
      group.phone_number.includes(search) ||
      group.tickets.some(
        (t) =>
          t.number.toLowerCase().includes(search.toLowerCase()) ||
          t.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  // pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Өнөөдөр";
    if (diffDays === 1) return "Өчигдөр";
    if (diffDays < 7) return `${diffDays} хоногийн өмнө`;
    return `${d.getMonth() + 1}-р сарын ${d.getDate()}`;
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] w-full px-4 py-8 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-4xl mx-auto rounded-2xl p-6 border border-orange-200 bg-white shadow-sm text-center">
          <p className="text-orange-500 text-sm">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-10 bg-gradient-to-b from-white via-orange-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-orange-600">
            Шууд сугалаанууд
          </h2>
          <div className="mt-4 mx-auto  bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 shadow-md">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-start justify-center text-left">
              {/* Икон ашиглан анхааруулгыг илүү тодотгосон */}
              <span className="text-xl mr-2 mt-0.5" role="img" aria-label="warning">
                ⚠️
              </span>
              <span>
                АНХААРУУЛГА: Манай систем шинэчлэгдсэнтэй холбоотойгоор мессежээр сугалааны код илгээгдэхгүй.
                <br className="hidden sm:block" />
                Та доорх талбараас сугалаагаа шалгана уу.
              </span>
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border border-orange-200 rounded-xl bg-white shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Утас, дугаар, машин хайх..."
              className={`w-full pl-10 pr-8 py-3 border border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100
                ${search ? "font-bold text-black" : "text-slate-700"}`}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-orange-200 rounded-2xl shadow">
          {currentItems.length === 0 ? (
            <div className="py-12 text-center text-orange-400">Илэрц олдсонгүй</div>
          ) : (
            currentItems.map((group, idx) => (
              <div
                key={`${group.phone_number}-${idx}`}
                className="border-b border-orange-100 last:border-0 p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-orange-700 font-mono font-bold text-lg">
                      {group.phone_number}
                    </div>
                    <div className="flex items-center gap-2 text-orange-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(group.tickets[0].created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
                    <Tag className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-bold text-sm">
                      {group.tickets.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {group.tickets.map((ticket, tidx) => (
                    <div
                      key={tidx}
                      className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <span className="text-orange-700 font-mono font-bold text-sm">
                        {ticket.number}
                      </span>
                      <span className="text-orange-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-orange-900 text-sm">{ticket.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
