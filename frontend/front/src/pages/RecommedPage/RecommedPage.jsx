import React, { useState } from 'react';

const RecommendPage = () => {
  const regionData = [
    { id: "1", name: "서울" }, { id: "31", name: "경기도" },
    { id: "32", name: "강원도" }, { id: "33", name: "충청북도" },
    { id: "34", name: "충청남도" }, { id: "37", name: "전라북도" },
    { id: "38", name: "전라남도" }, { id: "35", name: "경상북도" },
    { id: "36", name: "경상남도" }, { id: "39", name: "제주도" }
  ];

  const [selectedRegionIds, setSelectedRegionIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [keyword, setKeyword] = useState(''); // 키워드 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  const toggleRegion = (id) => {
    setSelectedRegionIds(prev => 
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const getAIRecommendation = async () => {
    if (selectedRegionIds.length === 0) {
      alert("관심 지역을 선택해주세요!"); return;
    }
    if (!selectedDate) {
      alert("여행 일정을 선택해주세요!"); return;
    }

    setIsLoading(true);
    
    // 백엔드로 쏠 데이터 (이제 키워드까지 포함)
    const requestData = {
      region_codes: selectedRegionIds,
      travel_date: selectedDate,
      user_keyword: keyword, // GPT가 판단할 핵심 키워드
      requested_at: new Date().toISOString()
    };

    console.log("GPT로 보낼 요청 데이터:", requestData);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      alert(`AI가 '${keyword || '전체'}' 테마로 코스를 분석 중입니다!`);
    } catch (error) {
      console.error("API 요청 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white py-16 px-10">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-black text-gray-900 mb-3 tracking-tight">당신을 위한 맞춤 행사 루틴 추천</h1>
          <p className="text-gray-500 font-medium">관심 지역과 테마를 입력하면 AI가 최적의 코스를 설계합니다.</p>
        </div>

        {/* 3단 설정 영역: 지역 / 날짜 / 키워드 */}
        <div className="w-full flex flex-col xl:flex-row gap-6 items-stretch justify-center mb-12">
          
          {/* 01. 지역 선택 (왼쪽) */}
          <div className="flex-[1.5] bg-gray-100/80 p-8 rounded-[40px] shadow-inner">
            <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest italic underline decoration-blue-500 decoration-2 underline-offset-4">01. Region</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
              {regionData.map(region => (
                <label key={region.id} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all"
                      checked={selectedRegionIds.includes(region.id)}
                      onChange={() => toggleRegion(region.id)}
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="ml-2 text-sm font-bold text-gray-600 group-hover:text-blue-600">{region.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 02. 날짜 선택 (중앙) */}
          <div className="flex-1 bg-gray-100/80 p-8 rounded-[40px] shadow-inner flex flex-col">
            <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest italic underline decoration-blue-500 decoration-2 underline-offset-4">02. Date</p>
            <div className="flex-1 flex flex-col justify-center">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-white focus:border-blue-500 outline-none text-gray-700 font-bold shadow-sm"
              />
            </div>
          </div>

          {/* 03. 테마 키워드 입력 (오른쪽 - GPT 판단용) */}
          <div className="flex-1 bg-gray-100/80 p-8 rounded-[40px] shadow-inner flex flex-col">
            <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest italic underline decoration-blue-500 decoration-2 underline-offset-4">03. Theme Keyword</p>
            <div className="flex-1 flex flex-col justify-center">
              <input 
                type="text"
                placeholder="ex) 힐링, 맛집 투어, 가족과 함께"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-white focus:border-blue-500 outline-none text-gray-700 font-bold shadow-sm placeholder:text-gray-300 placeholder:font-normal"
              />
              <p className="mt-3 text-[11px] text-gray-400 leading-tight">
                * 원하는 테마를 자유롭게 입력해 주세요.<br />GPT가 키워드에 맞춰 코스를 추천합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-4 mb-20">
          <button 
            onClick={getAIRecommendation}
            disabled={isLoading}
            className={`px-16 py-4 rounded-full font-black tracking-tighter transition-all shadow-xl text-lg
              ${isLoading ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
          >
            {isLoading ? "GPT 분석 중..." : "AI 추천 받기"}
          </button>
          
          <button className="px-10 py-4 bg-gray-800 text-white rounded-full font-black tracking-tighter hover:bg-black transition-all shadow-xl active:scale-95 text-lg">
            결과 저장하기
          </button>
        </div>

        {/* 대기 영역 */}
        <div className="w-full p-20 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-200 text-center">
             <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mb-4 uppercase">Waiting for response</div>
             <p className="text-gray-400 font-bold text-xl">AI 맞춤 코스 분석기</p>
             <p className="text-gray-300 text-sm mt-1">지역, 날짜, 키워드를 기반으로 GPT가 당신만의 여행 코스를 설계합니다.</p>
        </div>

      </div>
    </div>
  );
};

export default RecommendPage;