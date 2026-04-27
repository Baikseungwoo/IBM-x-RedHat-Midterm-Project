import React from 'react';

const BookmarkSection = ({ bookmarks }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
                <h2 className="text-xl font-black">북마크 목록</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {bookmarks.map((item) => (
                    <div key={item.content_id} className="min-w-[220px] bg-white rounded-3xl shadow-sm border border-gray-100 p-3 relative group">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                            <img src={item.first_image} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-bold text-sm truncate px-1">{item.title}</p>
                        <button className="absolute bottom-4 right-4 text-blue-500">🔖</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookmarkSection;