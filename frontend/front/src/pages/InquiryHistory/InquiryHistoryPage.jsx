import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import LoginRequiredModal from '../../components/LoginRequiredModal';
import { useAuth } from '../../contexts/AuthContext';

const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status) => {
  if (status === 'answered') return '답변 완료';
  if (status === 'closed') return '종료';
  return '답변 대기';
};

const getStatusClassName = (status) => {
  if (status === 'answered') {
    return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100';
  }

  if (status === 'closed') {
    return 'bg-gray-100 text-gray-500 ring-1 ring-gray-200';
  }

  return 'bg-amber-50 text-amber-600 ring-1 ring-amber-100';
};

const InquiryHistoryPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authLoading } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      setLoading(false);
      setLoginModalOpen(true);
      return;
    }

    const fetchInquiries = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await api.get('/api/inquiries/me');

        if (response.data?.success !== true) {
          throw new Error('Inquiry history request failed');
        }

        setInquiries(response.data.inquiries || []);
      } catch (error) {
        if (error.response?.status === 401) {
          setLoginModalOpen(true);
        } else {
          setErrorMessage('문의내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [authLoading, isLoggedIn]);

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-[32px] border border-white/70 bg-white/70 p-7 shadow-xl shadow-sky-100/50 backdrop-blur-2xl md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
                  Inquiry History
                </p>
                <h1 className="mt-2 text-3xl font-black text-gray-900">
                  문의내역
                </h1>
                <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">
                  내가 등록한 문의와 관리자 답변을 확인할 수 있습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/support')}
                className="h-12 rounded-2xl bg-[#0369A1] px-5 text-sm font-black text-white shadow-lg shadow-sky-200/60 transition hover:bg-sky-500 active:scale-95"
              >
                새 문의 작성
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-[28px] bg-white/55 shadow-lg shadow-sky-100/40"
                />
              ))}
            </div>
          ) : errorMessage ? (
            <div className="mt-6 rounded-[28px] border border-rose-100 bg-white/70 px-6 py-16 text-center shadow-lg shadow-sky-100/40 backdrop-blur">
              <p className="text-lg font-black text-rose-500">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-black text-white transition hover:bg-[#0369A1] active:scale-95"
              >
                다시 불러오기
              </button>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-white/80 bg-white/60 px-6 py-16 text-center shadow-lg shadow-sky-100/40 backdrop-blur">
              <p className="text-lg font-black text-gray-700">
                아직 등록한 문의가 없습니다.
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-400">
                궁금한 점이 있다면 문의하기 페이지에서 관리자에게 전달해보세요.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {inquiries.map((inquiry) => (
                <article
                  key={inquiry.inquiry_id}
                  className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-sky-100/40 backdrop-blur-2xl"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClassName(inquiry.status)}`}
                        >
                          {getStatusLabel(inquiry.status)}
                        </span>
                        <span className="text-xs font-bold text-gray-400">
                          {formatDate(inquiry.created_at)}
                        </span>
                      </div>

                      <h2 className="mt-4 break-words text-xl font-black text-gray-900">
                        {inquiry.title}
                      </h2>
                    </div>

                    <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-600">
                      #{inquiry.inquiry_id}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/80 p-5">
                    <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-gray-600">
                      {inquiry.content}
                    </p>
                  </div>

                  {inquiry.admin_reply ? (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-black text-emerald-700">
                          관리자 답변
                        </p>
                        <span className="text-xs font-bold text-emerald-600/70">
                          {formatDate(inquiry.answered_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-gray-700">
                        {inquiry.admin_reply}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
                      <p className="text-sm font-bold text-amber-700">
                        관리자가 문의를 확인한 뒤 답변을 등록할 예정입니다.
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
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

export default InquiryHistoryPage;
