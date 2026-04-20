import React from 'react';

const MainPage = () => {
  return (
    // bg-gradient-to-br을 사용하여 왼쪽 상단에서 오른쪽 하단으로 바다 색감이 흐르도록 설정
    <div className="w-full min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] overflow-x-hidden">
      
      {/* --- 상단 히어로 섹션 --- */}
      <section className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-stretch justify-between relative">
        
        {/* [왼쪽 영역] 텍스트 및 인기박스 */}
        <div className="w-full lg:w-[30%] px-10 pt-20 pb-10 z-10">
          <div className="space-y-6 mb-12">
            <h1 className="text-[40px] font-extrabold text-[#0369A1] leading-[1.2] tracking-tight">
              어디로 가야 할지<br />
              고민될 때, GIUT
            </h1>
            <p className="text-[#075985] text-xl font-medium leading-relaxed opacity-80">
              지도의 지역을 클릭하여<br />
              축제 리스트를 바로 확인하세요!
            </p>
          </div>

          {/* 인기 여행지 TOP 3 (바다 배경에 어울리게 약간 투명한 느낌 추가) */}
          <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 w-full max-w-[360px] shadow-xl shadow-blue-900/10 border border-white/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl text-[#0369A1]">인기 여행지 TOP 3</h3>
              <button className="text-sm text-blue-400 hover:text-blue-600 font-bold">더보기 &gt;</button>
            </div>
            
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex h-24 bg-white rounded-2xl overflow-hidden shadow-sm hover:scale-[1.03] transition-all border border-blue-50">
                  <div className="w-2/5 bg-blue-100/50"></div>
                  <div className="w-3/5 p-4 flex items-center justify-center">
                    <span className="text-blue-300 font-bold tracking-widest text-sm uppercase">Loading</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* [오른쪽 영역] 지도 이미지 (바다 위 둥둥 뜨는 효과) */}
        <div className="w-full lg:w-[70%] flex items-end justify-end pt-6 relative">
          <div className="w-full h-full flex justify-end items-end pr-4 pb-4">
            {/* 지도에 그림자(drop-shadow)를 주어 바다 위에 떠 있는 입체감을 부여 */}
            <img 
              src="/map.png" 
              alt="Korea Map" 
              className="w-full h-auto object-contain max-w-[1100px] drop-shadow-[0_35px_35px_rgba(3,105,161,0.25)]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1000x800?text=Map+Image";
              }}
            />
          </div>
        </div>
      </section>

      {/* --- 하단 추천 섹션 --- */}
      <section className="w-full px-10 pb-20 relative z-10 -mt-16">
        <div className="max-w-[1600px] mx-auto bg-white/80 backdrop-blur-xl rounded-[48px] p-12 border border-white/50 shadow-2xl">
          <div className="flex items-center justify-between mb-10 px-4">
            <h4 className="text-[22px] font-extrabold text-[#0369A1]">서울특별시 추천 행사</h4>
            <div className="flex space-x-3">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-400 shadow-md hover:bg-blue-50 transition-all border border-blue-100">&lt;</button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-400 shadow-md hover:bg-blue-50 transition-all border border-blue-100">&gt;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-4 group">
                <div className="aspect-[4/3] bg-blue-50 rounded-[24px] shadow-sm group-hover:scale-[1.04] transition-all duration-300 border border-blue-100"></div>
                <div className="h-10 bg-white/90 rounded-xl w-full border border-blue-50 flex items-center px-4">
                  <div className="h-2 w-2/3 bg-blue-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;