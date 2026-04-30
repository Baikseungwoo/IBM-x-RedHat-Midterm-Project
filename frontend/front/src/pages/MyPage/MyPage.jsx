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
                // 1. 병렬 요청으로 성능 최적화 (3개를 동시에 찌름)
                const [userRes, bookmarkRes, courseRes] = await Promise.all([
                    api.get('/api/users/me').catch(() => null),
                    api.get('/api/users/me/bookmarks').catch(() => ({ data: { success: true, events: [] } })),
                    api.get('/api/users/me/courses').catch(() => ({ data: { success: true, courses: [] } }))
                ]);

                // 2. 응답 데이터 안전하게 매핑
                if (userRes?.data?.success) setUser(userRes.data.user);
                if (bookmarkRes?.data?.success) setBookmarks(bookmarkRes.data.events);
                if (courseRes?.data?.success) setCourses(courseRes.data.courses);

            } catch (error) {
                console.error("데이터 로드 중 심각한 오류 발생:", error);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };
        fetchAllData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
            마이페이지 정보를 불러오는 중입니다...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 pb-20 px-4">
            <div className="w-full max-w-5xl space-y-10">
                <h1 className="text-3xl font-black ml-4 text-gray-900">마이페이지</h1>
                
                {/* 1. 프로필 섹션 */}
                <ProfileSection user={user} setUser={setUser} />

                {/* 2. 북마크 섹션*/}
                <BookmarkSection bookmarks={bookmarks} setBookmarks={setBookmarks} />
        
                {/* 3. AI 추천 코스 섹션 */}
                <CourseSection courses={courses} setCourses={setCourses} />
            </div>
        </div>
    );
};

export default MyPage;