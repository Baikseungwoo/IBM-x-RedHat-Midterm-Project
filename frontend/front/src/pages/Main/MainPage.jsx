import React from 'react';

const MainPage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] overflow-x-hidden">
      
      <section className="w-full pt-10 pb-6 px-10">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-sm font-bold text-[#0369A1] mb-4 ml-2 opacity-80 text-center md:text-left">현재 인기 행사들</h2>
          <div className="flex justify-center md:justify-between items-center gap-6 overflow-x-auto pb-4 no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[200px] flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-1 border border-white/30 shadow-lg group cursor-pointer hover:bg-white/60 transition-all">
                <div className="aspect-[16/9] bg-white/80 rounded-xl mb-1 shadow-inner overflow-hidden">
                  <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform"></div>
                </div>
                <div className="h-8 w-full px-2 flex items-center">
                  <div className="h-2 w-3/4 bg-[#0369A1]/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start justify-between relative px-10 py-10">
        
        <div className="w-full lg:w-[35%] z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-[36px] font-extrabold text-[#0369A1] leading-[1.2] tracking-tight">
              어디로 가야 할지<br />
              고민될 때, GIUT
            </h1>
            <p className="text-[#075985] text-lg font-medium opacity-80">
              지도의 지역을 클릭하여<br />
              축제 리스트를 확인하세요!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-[40px] p-10 w-full shadow-2xl border border-white/60">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-[24px] text-[#0369A1]">인기 여행지 TOP 3</h3>
              <button className="text-sm text-blue-500 hover:text-blue-700 font-bold border-b-2 border-blue-200">더보기 &gt;</button>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex h-48 bg-white rounded-[24px] overflow-hidden shadow-md hover:scale-[1.04] transition-all border border-blue-50 group cursor-pointer">
                  <div className="w-2/5 bg-blue-100 group-hover:bg-blue-200 transition-colors"></div>
                  <div className="w-3/5 p-6 flex items-center justify-center">
                    <span className="text-blue-400 font-black tracking-widest text-lg opacity-40 uppercase italic">Rank {item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[60%] flex items-center justify-center lg:justify-end pt-10">
          <div className="relative w-full max-w-[900px] flex justify-center items-center">
          <img 
              src="/map.png" 
              alt="Korea Map" 
              className="w-full h-auto object-contain drop-shadow-[0_25px_25px_rgba(3,105,161,0.2)] hover:drop-shadow-[0_35px_35px_rgba(3,105,161,0.3)] transition-all duration-500"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x700?text=Map+Image";
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;