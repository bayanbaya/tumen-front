"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Trophy, Calendar, Tag } from "lucide-react";

// Fake data - өөр өөр өдрүүдийн сугалаанууд
const generateFakeData = () => {
  const data = [];
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
    const tickets = [];
    
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

interface Ticket {
  number: string;
  name: string;
  created_at: string;
}

interface GroupedTicket {
  phone_number: string;
  tickets: Ticket[];
}

export default function TicketsTable() {
  const [allData, setAllData] = useState<GroupedTicket[]>([]);
  const [displayed, setDisplayed] = useState<GroupedTicket[]>([]);
  const [filtered, setFiltered] = useState<GroupedTicket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const data = generateFakeData();
      // Group by phone and date
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

      const sorted = Object.values(grouped).sort((a, b) => 
        new Date(b.tickets[0].created_at).getTime() - new Date(a.tickets[0].created_at).getTime()
      );

      setAllData(sorted);
      setDisplayed(sorted.slice(0, 10));
      setFiltered(sorted.slice(0, 10));
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    if (!term) {
      setFiltered(displayed);
      return;
    }

    const searchResults = allData.filter(
      (group) =>
        group.phone_number.includes(term) ||
        group.tickets.some(
          (t) =>
            t.number.toLowerCase().includes(term) ||
            t.name.toLowerCase().includes(term)
        )
    );
    setFiltered(searchResults);
  }, [search, displayed, allData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (search) return; // Don't load more when searching
    
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loadingMore && hasMore) {
      loadMore();
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = displayed.length;
      const nextBatch = allData.slice(currentLength, currentLength + 20);
      
      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setDisplayed(prev => [...prev, ...nextBatch]);
      }
      setLoadingMore(false);
    }, 500);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Өнөөдөр";
    if (diffDays === 1) return "Өчигдөр";
    if (diffDays < 7) return `${diffDays} хоногийн өмнө`;
    
    const months = ["1-р", "2-р", "3-р", "4-р", "5-р", "6-р", "7-р", "8-р", "9-р", "10-р", "11-р", "12-р"];
    return `${months[d.getMonth()]} сарын ${d.getDate()}`;
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
          </div>
          <p className="text-white/60 text-center mt-3 text-sm">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text mb-2">
          Сүүлийн сугалаанууд
        </h2>
        <p className="text-white/50 text-sm">Шинээр бүртгэгдсэн сугалаанууд</p>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl overflow-hidden border border-white/10">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Утас, дугаар, машин хайх..."
              className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[70vh] overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-white/40 text-sm">Илэрц олдсонгүй</p>
            </div>
          ) : (
            <>
              {filtered.map((group, idx) => (
                <div
                  key={`${group.phone_number}-${idx}`}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  {/* Mobile First Layout */}
                  <div className="p-4 space-y-3">
                    {/* Header: Phone + Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                          <span className="text-white/80 font-black text-sm">{idx + 1}</span>
                        </div>
                        <div>
                          <div className="text-white font-mono font-bold text-lg">{group.phone_number}</div>
                          <div className="flex items-center gap-2 text-white/50 text-xs mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(group.tickets[0].created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                        <Tag className="w-4 h-4 text-blue-300" />
                        <span className="text-blue-300 font-bold text-sm">{group.tickets.length}</span>
                      </div>
                    </div>

                    {/* Tickets Grid */}
                    <div className="space-y-1.5">
                      {group.tickets.map((ticket, tidx) => (
                        <div
                          key={tidx}
                          className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5"
                        >
                          <span className="text-purple-400 font-mono font-bold text-sm flex-shrink-0">{ticket.number}</span>
                          <span className="text-white/40 text-xs">•</span>
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <Trophy className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                            <span className="text-white/80 text-sm truncate">{ticket.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}

              {/* No More Data */}
              {!hasMore && !search && (
                <div className="p-4 text-center text-white/40 text-sm">
                  Бүх сугалааг харууллаа
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white/5 border-t border-white/5">
          <div className="text-center text-xs text-white/60">
            {search ? (
              <>Илэрц: <span className="font-bold text-white">{filtered.reduce((sum, g) => sum + g.tickets.length, 0)}</span> сугалаа</>
            ) : (
              <>Харуулж байгаа: <span className="font-bold text-white">{displayed.length}</span> / {allData.length} бүлэг</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}