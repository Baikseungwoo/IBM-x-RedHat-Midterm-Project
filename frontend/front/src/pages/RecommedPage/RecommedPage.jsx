import React, { useState, useEffect } from 'react';
import api from '../../api'; 
import Modal from '../../components/modal'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginRequiredModal from '../../components/LoginRequiredModal';


const RecommendPage = () => {
  const regionData = [
    { id: "서울", name: "서울" }, { id: "경기도", name: "경기도" },
    { id: "강원도", name: "강원도" }, { id: "충청북도", name: "충청북도" },
    { id: "충청남도", name: "충청남도" }, { id: "전라북도", name: "전라북도" },
    { id: "전라남도", name: "전라남도" }, { id: "경상북도", name: "경상북도" },
    { id: "경상남도", name: "경상남도" }, { id: "제주도", name: "제주도" }
  ];

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [recommendResult, setRecommendResult] = useState(null);


  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };

  // --- [추가] 로드 시 로컬스토리지에서 데이터 불러오기 ---
  useEffect(() => {
    const savedCourse = localStorage.getItem('last_recommend_result');
    const savedInputs = localStorage.getItem('last_recommend_inputs');

    if (savedCourse) {
      setRecommendResult(JSON.parse(savedCourse));
    }
    if (savedInputs) {
      const { region, date, keyword } = JSON.parse(savedInputs);
      setSelectedRegion(region || '');
      setSelectedDate(date || '');
      setKeyword(keyword || '');
    }
  }, []);

  // --- [API 1] AI 추천 코스 요청 ---
  const getAIRecommendation = async () => {
    if (!requireLogin()) return;

    if (!selectedRegion || !selectedDate || !keyword) {
      alert("지역, 날짜, 키워드를 모두 입력해주세요!");
      return;
    }

    setIsLoading(true);
    setRecommendResult(null); 

    try {
      const response = await api.post('/api/courses/recommend', {
        region: selectedRegion,
        date: selectedDate,
        keyword: keyword
      });

      if (response.data.success) {
        setRecommendResult(response.data);
        
        // --- [추가] 성공 시 로컬스토리지에 저장 ---
        localStorage.setItem('last_recommend_result', JSON.stringify(response.data));
        localStorage.setItem('last_recommend_inputs', JSON.stringify({
          region: selectedRegion,
          date: selectedDate,
          keyword: keyword
        }));
      } else {
        alert("추천 결과를 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("AI 추천 API 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- [API 2] AI 추천 코스 저장 (저장 성공 후에는 스토리지 비우기 선택 사항) ---
  const handleSaveCourse = async () => {
    if (!requireLogin()) return;

    if (!recommendResult) return;

    setIsSaving(true);
    try {
      const saveData = {
        region: recommendResult.region,
        course_title: recommendResult.course_title,
        description: recommendResult.description,
        date: recommendResult.date,
        keyword: recommendResult.keyword,
        course: recommendResult.course.map((item, index) => ({
          content_id: item.content_id,
          sequence: index + 1
        }))
      };

      const response = await api.post('/api/courses', saveData);
      
      if (response.data.success) {
        alert("나의 코스에 성공적으로 저장되었습니다! 마이페이지에서 확인하세요.");
        // 저장 완료 후 스토리지를 비우고 싶다면 아래 주석 해제
        // localStorage.removeItem('last_recommend_result');
      }
    } catch (error) {
      console.error("코스 저장 API 에러:", error);
      alert("로그인 세션이 만료되었거나 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white py-16 px-10">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-black text-gray-900 mb-3 tracking-tight">AI 맞춤 행사 루틴 추천</h1>
            <p className="text-gray-500 font-medium">당신의 취향을 분석하여 최적의 동선을 설계합니다.</p>
          </div>

          {/* 입력 섹션 */}
          <div className="w-full bg-gray-50 p-10 rounded-[50px] shadow-sm mb-12 border border-gray-100 flex flex-col xl:flex-row gap-6 items-stretch justify-center">
            <div className="flex-1">
              <p className="text-[10px] font-black text-blue-500 mb-4 uppercase tracking-[0.2em] ml-2">01. Region</p>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-5 rounded-3xl border-2 border-white focus:border-blue-400 focus:bg-white outline-none text-gray-700 font-bold shadow-sm appearance-none bg-white"
              >
                <option value="">지역 선택</option>
                {regionData.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div className="flex-1 border-x-0 xl:border-x border-gray-200 xl:px-6">
              <p className="text-[10px] font-black text-blue-500 mb-4 uppercase tracking-[0.2em] ml-2">02. Date</p>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-5 rounded-3xl border-2 border-white focus:border-blue-400 focus:bg-white outline-none text-gray-700 font-bold shadow-sm bg-white"
              />
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-black text-blue-500 mb-4 uppercase tracking-[0.2em] ml-2">03. Keyword</p>
              <input 
                type="text"
                placeholder="ex) 힐링, 익사이팅, 맛집 투어"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-5 rounded-3xl border-2 border-white focus:border-blue-400 focus:bg-white outline-none text-gray-700 font-bold shadow-sm bg-white"
              />
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-6 mb-20">
            <button 
              onClick={getAIRecommendation}
              disabled={isLoading}
              className={`px-20 py-5 rounded-full font-black tracking-tighter transition-all shadow-2xl text-xl
                ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0369A1] text-white hover:bg-black hover:scale-105 active:scale-95'}`}
            >
              {isLoading ? "AI 분석 중..." : "AI 추천 받기"}
            </button>

            {recommendResult && (
              <button 
                onClick={handleSaveCourse}
                disabled={isSaving}
                className={`px-12 py-5 rounded-full font-black tracking-tighter transition-all shadow-2xl text-xl border-4 border-gray-900
                  ${isSaving ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white active:scale-95'}`}
              >
                {isSaving ? "저장 중..." : "코스 저장하기"}
              </button>
            )}
          </div>

          {/* 결과창 (Modal 컴포넌트) */}
          <Modal courseData={recommendResult} />

        </div>
      </div>
      <LoginRequiredModal
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onLogin={() => {
        setLoginModalOpen(false);
        navigate('/login');
      }}
    />
    </>
  );
};

export default RecommendPage;