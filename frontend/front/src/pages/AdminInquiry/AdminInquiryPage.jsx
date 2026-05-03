import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import LoginRequiredModal from '../../components/LoginRequiredModal';
import SuccessModal from '../../components/SuccessModal';

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
  if (status === 'answered') return 'Answered';
  if (status === 'closed') return 'Closed';
  return 'Pending';
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

const AdminInquiryPage = () => {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [replyValues, setReplyValues] = useState({});
  const [filter, setFilter] = useState('all');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const pendingCount = inquiries.filter((inquiry) => inquiry.status !== 'answered').length;
  const answeredCount = inquiries.filter((inquiry) => inquiry.status === 'answered').length;

  const filteredInquiries = useMemo(() => {
    if (filter === 'pending') {
      return inquiries.filter((inquiry) => inquiry.status !== 'answered');
    }

    if (filter === 'answered') {
      return inquiries.filter((inquiry) => inquiry.status === 'answered');
    }

    return inquiries;
  }, [filter, inquiries]);

  const fetchInquiries = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.get('/api/admin/inquiries');

      if (response.data?.success !== true) {
        throw new Error('Admin inquiry request failed');
      }

      const nextInquiries = response.data.inquiries || [];
      setInquiries(nextInquiries);
      setReplyValues(
        nextInquiries.reduce((acc, inquiry) => {
          acc[inquiry.inquiry_id] = inquiry.admin_reply || '';
          return acc;
        }, {})
      );
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginModalOpen(true);
      } else if (error.response?.status === 403) {
        setErrorMessage('Admin permission is required to manage inquiries.');
      } else {
        setErrorMessage('Failed to load inquiries. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReplyChange = (inquiryId, value) => {
    setReplyValues((prev) => ({
      ...prev,
      [inquiryId]: value,
    }));
  };

  const handleReplyToggle = (inquiry) => {
    setErrorMessage('');

    setReplyValues((prev) => ({
      ...prev,
      [inquiry.inquiry_id]: prev[inquiry.inquiry_id] ?? inquiry.admin_reply ?? '',
    }));

    setActiveReplyId((prev) =>
      prev === inquiry.inquiry_id ? null : inquiry.inquiry_id
    );
  };

  const handleReplySubmit = async (inquiryId) => {
    const adminReply = (replyValues[inquiryId] || '').trim();

    if (!adminReply) {
      setErrorMessage('Please enter a reply.');
      return;
    }

    setSubmittingId(inquiryId);
    setErrorMessage('');

    try {
      const response = await api.patch(`/api/admin/inquiries/${inquiryId}/reply`, {
        admin_reply: adminReply,
      });

      if (response.data?.success !== true) {
        throw new Error('Inquiry reply failed');
      }

      const updatedInquiry = response.data.inquiry;
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.inquiry_id === inquiryId ? updatedInquiry : inquiry
        )
      );
      setReplyValues((prev) => ({
        ...prev,
        [inquiryId]: updatedInquiry.admin_reply || adminReply,
      }));
      setActiveReplyId(null);
      setSuccessModalOpen(true);
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginModalOpen(true);
      } else if (error.response?.status === 403) {
        setErrorMessage('Admin permission is required to submit replies.');
      } else {
        setErrorMessage('Failed to submit the reply. Please try again later.');
      }
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="rounded-[32px] border border-white/70 bg-white/70 p-7 shadow-xl shadow-sky-100/50 backdrop-blur-2xl md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-rose-500">
                  Admin
                </p>
                <h1 className="mt-2 text-3xl font-black text-gray-900">
                  관리자 문의 관리
                </h1>
                <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">
                  사용자 문의를 확인하고 답변을 등록할 수 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    filter === 'all'
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white/80 text-gray-500 hover:bg-white'
                  }`}
                >
                  전체 {inquiries.length}
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    filter === 'pending'
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-white/80 text-gray-500 hover:bg-white'
                  }`}
                >
                  대기 {pendingCount}
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('answered')}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    filter === 'answered'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white/80 text-gray-500 hover:bg-white'
                  }`}
                >
                  완료 {answeredCount}
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl bg-rose-50 px-5 py-4 text-sm font-bold text-rose-500 shadow-sm">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-[28px] bg-white/55 shadow-lg shadow-sky-100/40"
                />
              ))}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-white/80 bg-white/60 px-6 py-16 text-center shadow-lg shadow-sky-100/40 backdrop-blur">
              <p className="text-lg font-black text-gray-700">
                표시할 문의가 없습니다.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {filteredInquiries.map((inquiry) => (
                <article
                  key={inquiry.inquiry_id}
                  className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-sky-100/40 backdrop-blur-2xl"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-600">
                          {inquiry.user_nickname || `User #${inquiry.user_id}`}
                        </span>
                      </div>

                      <h2 className="mt-4 break-words text-xl font-black text-gray-900">
                        {inquiry.title}
                      </h2>
                    </div>

                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-gray-500 shadow-sm">
                      문의 #{inquiry.inquiry_id}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/80 p-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                      Inquiry
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-gray-600">
                      {inquiry.content}
                    </p>
                  </div>

                  {inquiry.admin_reply && (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-black text-emerald-700">
                          기존 답변
                        </p>
                        <span className="text-xs font-bold text-emerald-600/70">
                          {formatDate(inquiry.answered_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-gray-700">
                        {inquiry.admin_reply}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleReplyToggle(inquiry)}
                      className={`rounded-2xl px-5 py-3 text-sm font-black shadow-lg transition active:scale-95 ${
                        activeReplyId === inquiry.inquiry_id
                          ? 'bg-gray-900 text-white shadow-gray-200/60'
                          : 'bg-[#0369A1] text-white shadow-sky-200/60 hover:bg-sky-500'
                      }`}
                    >
                      {activeReplyId === inquiry.inquiry_id
                        ? 'Close Reply'
                        : inquiry.admin_reply
                          ? 'Edit Reply'
                          : 'Reply'}
                    </button>
                  </div>

                  {activeReplyId === inquiry.inquiry_id && (
                    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                      <label className="block">
                        <span className="text-sm font-black text-gray-700">
                          Admin Reply
                        </span>
                        <textarea
                          value={replyValues[inquiry.inquiry_id] || ''}
                          onChange={(e) =>
                            handleReplyChange(inquiry.inquiry_id, e.target.value)
                          }
                          className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-sky-100 bg-white/90 px-4 py-4 text-sm font-semibold leading-6 text-gray-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                          placeholder="Enter the reply to send to the user"
                        />
                      </label>

                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 active:scale-95"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReplySubmit(inquiry.inquiry_id)}
                          disabled={submittingId === inquiry.inquiry_id}
                          className="rounded-2xl bg-[#0369A1] px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-200/60 transition hover:bg-sky-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                        >
                          {submittingId === inquiry.inquiry_id
                            ? 'Submitting...'
                            : inquiry.admin_reply
                              ? 'Update Reply'
                              : 'Submit Reply'}
                        </button>
                      </div>
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

      <SuccessModal
        open={successModalOpen}
        title="Reply Submitted"
        message="The user can now see the reply in their inquiry history."
        buttonText="OK"
        onConfirm={() => setSuccessModalOpen(false)}
      />
    </>
  );
};

export default AdminInquiryPage;
