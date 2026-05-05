import React, { useState, useEffect } from 'react';
import api from '../../api';
import Modal from '../../components/modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginRequiredModal from '../../components/LoginRequiredModal';
import RecommendErrorModal from '../../components/RecommendErrorModal';
import CourseSaveSuccessModal from '../../components/CourseSaveSuccessModal';

const RecommendPage = () => {
  const regionData = [
    { id: "서울", name: "서울" },
    { id: "경기도", name: "경기도" },
    { id: "강원도", name: "강원도" },
    { id: "충청북도", name: "충청북도" },
    { id: "충청남도", name: "충청남도" },
    { id: "전라북도", name: "전라북도" },
    { id: "전라남도", name: "전라남도" },
    { id: "경상북도", name: "경상북도" },
    { id: "경상남도", name: "경상남도" },
    { id: "제주도", name: "제주도" },
  ];

  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authLoading } = useAuth();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recommendResult, setRecommendResult] = useState(null);

  const [errorModal, setErrorModal] = useState({
    open: false,
    message: '',
  });

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      localStorage.removeItem('last_recommend_result');
      localStorage.removeItem('last_recommend_inputs');
      setRecommendResult(null);
      setSelectedRegion('');
      setSelectedDate('');
      setKeyword('');
      return;
    }

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
  }, [authLoading, isLoggedIn]);

  const getAIRecommendation = async () => {
    if (!requireLogin()) return;

    if (!selectedRegion || !selectedDate || !keyword) {
      setErrorModal({
        open: true,
        message: "지역, 날짜, 키워드를 모두 입력해주세요.",
      });
      return;
    }

    setIsLoading(true);
    setRecommendResult(null);

    try {
      const response = await api.post('/api/courses/recommend', {
        region: selectedRegion,
        date: selectedDate,
        keyword,
      });

      if (response.data.success) {
        setRecommendResult(response.data);

        localStorage.setItem('last_recommend_result', JSON.stringify(response.data));
        localStorage.setItem('last_recommend_inputs', JSON.stringify({
          region: selectedRegion,
          date: selectedDate,
          keyword,
        }));
      } else {
        setErrorModal({
          open: true,
          message: "추천 결과를 가져오지 못했습니다.",
        });
      }
    } catch (error) {
      console.error("AI 추천 API 에러:", error);

      const detail = error.response?.data?.detail;

      const message =
        detail === "Not enough events to recommend (need at least 3)."
          ? "선택한 지역과 날짜에 추천할 행사가 3개 미만입니다. 다른 지역, 날짜, 키워드로 다시 시도해주세요."
          : detail || "서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      setErrorModal({
        open: true,
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          sequence: index + 1,
        })),
      };

      const response = await api.post('/api/courses', saveData);

      if (response.data.success) {
        localStorage.removeItem('last_recommend_result');
        localStorage.removeItem('last_recommend_inputs');
        setRecommendResult(null);
        setSaveSuccessOpen(true);
      }
    } catch (error) {
      console.error("코스 저장 API 에러:", error);
      setErrorModal({
        open: true,
        message: "로그인 세션이 만료되었거나 저장 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-14 md:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[7%] top-16 h-56 w-56 rounded-full bg-yellow-200/45 blur-3xl" />
          <div className="absolute right-[10%] top-36 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
          <div className="absolute bottom-20 left-[35%] h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-black text-sky-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI Festival Route Planner
            </div>

            <h1 className="text-[34px] font-black tracking-tight text-gray-900 md:text-[44px]">
              AI 맞춤 행사 루틴 추천
            </h1>

            <p className="mt-4 text-base font-semibold leading-7 text-gray-500 md:text-lg">
              지역, 날짜, 취향을 입력하면 어울리는 행사 코스를 찾아드려요.
            </p>
          </div>

          <div className="mb-10 grid w-full gap-5 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
                Step 01
              </p>
              <p className="mt-2 text-lg font-black text-gray-900">지역 선택</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
                여행하고 싶은 지역을 먼저 골라주세요.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-pink-400">
                Step 02
              </p>
              <p className="mt-2 text-lg font-black text-gray-900">날짜 입력</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
                해당 날짜에 진행되는 행사를 기준으로 추천해요.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-500">
                Step 03
              </p>
              <p className="mt-2 text-lg font-black text-gray-900">취향 키워드</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
                힐링, 전시, 맛집, 가족 여행처럼 원하는 분위기를 적어주세요.
              </p>
            </div>
          </div>

          <div className="relative mb-10 w-full overflow-hidden rounded-[42px] border border-white/70 bg-white/65 p-6 shadow-2xl shadow-sky-200/40 backdrop-blur-2xl md:p-8 xl:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-yellow-200/45 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl" />

            <div className="relative grid gap-5 xl:grid-cols-3">
              <div>
                <p className="mb-3 ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                  01. Region
                </p>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-sky-100 bg-white/85 px-5 text-sm font-black text-gray-700 shadow-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">지역 선택</option>
                  {regionData.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
                  02. Date
                </p>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-sky-100 bg-white/85 px-5 text-sm font-black text-gray-700 shadow-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <p className="mb-3 ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                  03. Keyword
                </p>

                <input
                  type="text"
                  placeholder="ex) 힐링, 익사이팅, 맛집 투어"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-sky-100 bg-white/85 px-5 text-sm font-black text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={getAIRecommendation}
                disabled={isLoading}
                className={`min-w-[220px] rounded-full px-10 py-4 text-lg font-black tracking-tight shadow-2xl transition-all active:scale-95 ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
                    : 'bg-[#0369A1] text-white shadow-sky-300/40 hover:-translate-y-1 hover:bg-gray-900'
                }`}
              >
                {isLoading ? "AI 분석 중..." : "AI 추천 받기"}
              </button>

              {recommendResult && (
                <button
                  type="button"
                  onClick={handleSaveCourse}
                  disabled={isSaving}
                  className={`min-w-[180px] rounded-full border border-gray-900 px-8 py-4 text-lg font-black tracking-tight shadow-xl transition-all active:scale-95 ${
                    isSaving
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white/90 text-gray-900 hover:-translate-y-1 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  {isSaving ? "저장 중..." : "코스 저장하기"}
                </button>
              )}
            </div>
          </div>

          <div className="w-full">
            <Modal courseData={recommendResult} />
          </div>
        </div>
      </div>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={() => {
          setLoginModalOpen(false);
          navigate('/login', {
            state: { from: location.pathname + location.search },
          });
        }}
      />

      <RecommendErrorModal
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: '' })}
      />

      <CourseSaveSuccessModal
        open={saveSuccessOpen}
        onClose={() => setSaveSuccessOpen(false)}
        onGoMyPage={() => {
          setSaveSuccessOpen(false);
          navigate('/mypage');
        }}
      />
    </>
  );
};

export default RecommendPage;
