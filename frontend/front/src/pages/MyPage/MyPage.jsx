import React, { useEffect, useState } from 'react';
import api from '../../api';
import ProfileSection from './ProfileSection';
import BookmarkSection from './BookmarkSection';
import CourseSection from './CourseSection';

const MyPage = () => {
    const [user, setUser] = useState({ nickname: '', email: '', image_data: '' });
    const [bookmarks, setBookmarks] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 실제 연동 시 주석 해제, 현재는 테스트 데이터 포함
                const userRes = await api.get('/api/users/me');
                if (userRes.data.success) setUser(userRes.data.user);

                const bookmarkRes = await api.get('/api/users/me/bookmarks');
                if (bookmarkRes.data.success) setBookmarks(bookmarkRes.data.events);

                const courseRes = await api.get('/api/users/me/courses');
                if (courseRes.data.success) setCourses(courseRes.data.courses);
            } catch (error) {
                console.error("Data load error:", error);
            }
        };
        fetchAllData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 pb-20 px-4">
            <div className="w-full max-w-5xl space-y-10">
                <h1 className="text-3xl font-black ml-4">마이페이지</h1>
                
                {/* 1. 프로필 섹션 */}
                <ProfileSection user={user} setUser={setUser} />

                {/* 2. 북마크 섹션 */}
                <BookmarkSection bookmarks={bookmarks} setBookmarks={setBookmarks} />

                {/* 3. AI 추천 코스 섹션 */}
                <CourseSection courses={courses} setCourses={setCourses} />

                <div className="text-center text-[10px] text-gray-300 tracking-widest pt-10">
                    GIUT PROJECT © 2026. ALL RIGHTS RESERVED.
                </div>
            </div>
        </div>
    );
};

export default MyPage;