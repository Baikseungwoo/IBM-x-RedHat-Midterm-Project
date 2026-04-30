import React from "react";

const EventCard = ({ event, onClick, onLike, onBookmark }) => {
  const NO_IMAGE_URL = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";

  const BookmarkIcon = ({ active }) => (
    <svg 
      className={`w-6 h-6 transition-all duration-300 ${active ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-gray-400"}`} 
      fill={active ? "currentColor" : "none"} 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );

  const getStatus = () => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    end.setHours(23, 59, 59, 999);

    if (now < start) return { text: "진행 예정", color: "bg-blue-500" };
    if (now <= end) return { text: "진행 중", color: "bg-green-500" };
    return { text: "진행 종료", color: "bg-gray-400" };
  };

  const status = getStatus();

  return (
    <div 
      onClick={onClick}
      className="flex flex-col bg-white rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 group h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={event.first_image || NO_IMAGE_URL}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = NO_IMAGE_URL; }}
        />
        <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-black text-white shadow-md ${status.color}`}>
          {status.text}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 relative">
        <h3 className="text-lg font-black text-gray-900 truncate mb-1 pr-16">{event.title}</h3>
        
        <div className="flex items-center gap-1 text-blue-500 font-bold text-[12px] mb-1">
          <span>📅</span>
          <span>{event.start_date} ~ {event.end_date}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 font-medium text-sm mb-4">
          <span>📍</span>
          <span className="truncate pr-16">{event.region || "지역 정보 없음"}</span>
        </div>

        <div className="absolute bottom-5 right-5 flex items-center gap-3">
          <button 
            onClick={(e) => onLike(e, event.content_id)} 
            className="flex items-center gap-1 outline-none group/like"
          >
            <span className={`text-2xl transition-transform group-hover/like:scale-120 ${event.is_liked ? "opacity-100" : "opacity-20 grayscale"}`}>
              ❤️
            </span>
            <span className="text-xs font-black text-gray-600">{event.like_count || 0}</span>
          </button>

          <button onClick={(e) => onBookmark(e, event.content_id)} className="outline-none">
            <BookmarkIcon active={event.is_bookmarked} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;