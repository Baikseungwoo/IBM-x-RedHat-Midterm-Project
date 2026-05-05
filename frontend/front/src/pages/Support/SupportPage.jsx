import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import LoginRequiredModal from '../../components/LoginRequiredModal';
import SuccessModal from '../../components/SuccessModal';
import { useAuth } from '../../contexts/AuthContext';

const SupportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setErrorMessage('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.post('/api/inquiries', {
        title: trimmedTitle,
        content: trimmedContent,
      });

      if (response.data?.success !== true) {
        throw new Error('Inquiry creation failed');
      }

      setTitle('');
      setContent('');
      setSuccessModalOpen(true);
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginModalOpen(true);
      } else {
        setErrorMessage('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessConfirm = () => {
    setSuccessModalOpen(false);
    navigate('/history');
  };

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-12">
        <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-white/70 bg-white/70 p-7 shadow-xl shadow-sky-100/50 backdrop-blur-2xl md:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
            Support
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">
            문의하기
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">
            관리자에게 전달할 문의 내용을 작성하는 페이지입니다.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-black text-gray-700">제목</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="mt-2 h-12 w-full rounded-2xl border border-sky-100 bg-white/90 px-4 text-sm font-semibold text-gray-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                placeholder="문의 제목을 입력하세요"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-gray-700">내용</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 min-h-48 w-full resize-none rounded-2xl border border-sky-100 bg-white/90 px-4 py-4 text-sm font-semibold leading-6 text-gray-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                placeholder="문의 내용을 입력하세요"
              />
            </label>

            {errorMessage && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-500">
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-[#0369A1] px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-200/60 transition hover:bg-sky-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {submitting ? '등록 중...' : '문의 등록'}
              </button>
            </div>
          </form>
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

      <SuccessModal
        open={successModalOpen}
        title="문의가 등록되었습니다"
        message="관리자가 확인한 뒤 답변을 등록하면 문의내역에서 확인할 수 있습니다."
        buttonText="문의내역 보기"
        onConfirm={handleSuccessConfirm}
      />
    </>
  );
};

export default SupportPage;
