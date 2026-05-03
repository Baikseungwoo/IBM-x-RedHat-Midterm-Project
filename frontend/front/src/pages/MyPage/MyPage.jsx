import React, { useEffect, useState } from 'react';
import api from '../../api';
import ProfileSection from './ProfileSection';
import BookmarkSection from './BookmarkSection';
import CourseSection from './CourseSection';

const MyPage = () => {
  const [user, setUser] = useState({ nickname: '', email: '', image_data: '' });
  const [bookmarks, setBookmarks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [userRes, bookmarkRes, courseRes] = await Promise.all([
          api.get('/api/users/me').catch(() => null),
          api.get('/api/users/me/bookmarks').catch(() => ({ data: { success: true, events: [] } })),
          api.get('/api/users/me/courses').catch(() => ({ data: { success: true, courses: [] } })),
        ]);

        if (userRes?.data?.success) setUser(userRes.data.user);
        if (bookmarkRes?.data?.success) setBookmarks(bookmarkRes.data.events);
        if (courseRes?.data?.success) setCourses(courseRes.data.courses);
      } catch (error) {
        console.error('데이터 로드 중 심각한 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="h-56 animate-pulse rounded-[40px] bg-white/55 shadow-2xl shadow-sky-200/40" />
          <div className="mt-8 space-y-8">
            <div className="h-72 animate-pulse rounded-[40px] bg-white/50" />
            <div className="h-64 animate-pulse rounded-[40px] bg-white/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-4 py-10 md:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-16 h-56 w-56 rounded-full bg-yellow-200/45 blur-3xl" />
        <div className="absolute right-[10%] top-40 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute bottom-24 left-[35%] h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl space-y-10">
        <section className="overflow-hidden rounded-[44px] border border-white/70 bg-white/58 p-6 shadow-2xl shadow-sky-200/40 backdrop-blur-2xl md:p-8">
            <div className="relative overflow-hidden rounded-[34px] bg-white/45 p-7 md:p-9">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-200/35 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-200/35 blur-3xl" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-black text-sky-700 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    My Festival Space
                    </div>

                    <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                    마이페이지
                    </h1>

                    <p className="mt-4 text-base font-semibold leading-7 text-gray-500 md:text-lg">
                    저장한 축제와 AI 추천 코스를 한곳에서 관리해보세요.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex">
                    <div className="rounded-3xl bg-white/80 px-5 py-4 text-center shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
                        Bookmarks
                    </p>
                    <p className="mt-1 text-2xl font-black text-[#0369A1]">
                        {bookmarks.length}개
                    </p>
                    </div>

                    <div className="rounded-3xl bg-white/80 px-5 py-4 text-center shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-400">
                        AI Courses
                    </p>
                    <p className="mt-1 text-2xl font-black text-gray-900">
                        {courses.length}개
                    </p>
                    </div>
                </div>
                </div>
            </div>

            <div className="mt-6">
            <ProfileSection user={user} setUser={setUser} />
            </div>
            </section>


        <section className="rounded-[40px] border border-white/70 bg-white/55 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-2xl md:p-8">
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
              Saved Festivals
            </p>
            <h2 className="mt-1 text-2xl font-black text-gray-900">
              북마크한 행사
            </h2>
          </div>

          <BookmarkSection bookmarks={bookmarks} setBookmarks={setBookmarks} />
        </section>

        <section className="rounded-[40px] border border-white/70 bg-white/55 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-2xl md:p-8">
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-pink-400">
              AI Travel Courses
            </p>
            <h2 className="mt-1 text-2xl font-black text-gray-900">
              저장한 AI 추천 코스
            </h2>
          </div>

          <CourseSection courses={courses} setCourses={setCourses} />
        </section>
      </div>
    </div>
  );
};

export default MyPage;
