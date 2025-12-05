"use client";
import { useState, useEffect } from "react";
import { Search, Trophy, Calendar, Tag } from "lucide-react";

interface Ticket {
  number: string;
  name: string;
  created_at: string;
}

interface GroupedTicket {
  phone_number: string;
  tickets: Ticket[];
}

// --- Fake 20 tickets generator ---
const generateFakeData = (): GroupedTicket[] => {
  const data: GroupedTicket[] = [];
  const phones = ["99119911","88228822","77337733","99889988","95559555"];
  const cars = ["Toyota Prado","Lexus LX600","Mercedes G-Class","Range Rover","BMW X7"];

  for(let i=0; i<20; i++){
    const phone = phones[i % phones.length];
    const tickets: Ticket[] = [{
      number: `F-${1000 + i}`,
      name: cars[i % cars.length],
      created_at: new Date(Date.now() - (i % 7) * 24*60*60*1000).toISOString()
    }];
    data.push({ phone_number: phone, tickets });
  }
  return data;
};

export default function TicketsTable() {
  const [allData, setAllData] = useState<GroupedTicket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setAllData(generateFakeData());
      setLoading(false);
    }, 500);
  }, []);

  const filtered = allData.filter(
    g => g.phone_number.includes(search) || g.tickets.some(
      t => t.number.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000*60*60*24));
    if(diffDays===0) return "Өнөөдөр";
    if(diffDays===1) return "Өчигдөр";
    if(diffDays<7) return `${diffDays} хоногийн өмнө`;
    return `${d.getMonth()+1}-р сарын ${d.getDate()}`;
  };

  if(loading) return (
    <div className="min-h-[40vh] w-full px-4 py-8 bg-gradient-to-b from-white to-orange-50 flex justify-center items-center">
      <div className="max-w-4xl mx-auto rounded-2xl p-6 border border-orange-200 bg-white shadow-sm text-center">
        <p className="text-orange-500 text-sm">Уншиж байна...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 py-10 bg-gradient-to-b from-white via-orange-50 to-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-orange-600">
            Шууд сугалаанууд
          </h2>
          <div className="mt-4 mx-auto bg-yellow-50 border border-yellow-300 rounded-lg p-3 shadow-md">
            <p className="text-sm font-medium text-yellow-800 flex items-start justify-center text-left">
              <span className="text-xl mr-2 mt-0.5" role="img" aria-label="warning">⚠️</span>
              АНХААРУУЛГА: Манай систем шинэчлэгдсэнтэй холбоотойгоор мессежээр сугалааны код илгээгдэхгүй. Та доорх талбараас сугалаагаа шалгана уу.
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
              onChange={(e)=>{setSearch(e.target.value); setCurrentPage(1);}} 
              placeholder="Утас, дугаар, машин хайх..." 
              className={`w-full pl-10 pr-8 py-3 border border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${search ? "font-bold text-black" : "text-slate-700"}`} 
            />
            {search && (
              <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 text-sm">✕</button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-orange-200 rounded-2xl shadow">
          {currentItems.length===0 ? (
            <div className="py-12 text-center text-orange-400">Илэрц олдсонгүй</div>
          ) : (
            currentItems.map((group, idx)=>(
              <div key={`${group.phone_number}-${idx}`} className="border-b border-orange-100 last:border-0 p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-orange-700 font-mono font-bold text-lg">{group.phone_number}</div>
                    <div className="flex items-center gap-2 text-orange-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(group.tickets[0].created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
                    <Tag className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-bold text-sm">{group.tickets.length}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {group.tickets.map((ticket, tidx)=>(
                    <div key={tidx} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="text-orange-700 font-mono font-bold text-sm">{ticket.number}</span>
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
        {totalPages>1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({length: totalPages}, (_, i)=>(
              <button 
                key={i} 
                onClick={()=>setCurrentPage(i+1)} 
                className={`px-3 py-1 rounded-md border ${currentPage===i+1 ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50"}`}
              >
                {i+1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
