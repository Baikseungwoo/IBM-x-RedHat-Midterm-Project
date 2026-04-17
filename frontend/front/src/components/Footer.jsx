import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 서비스 로고 및 소개 */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-blue-600">IBM x RedHat Project</h2>
            <p className="text-sm text-gray-600">
              여러가지 지역 행사들을 찾아 지금 바로 떠나보세요.<br />
           
            </p>
          </div>

          {/* 주요 링크 (라우터 연결) */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-gray-800">바로가기</h3>
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">메인 홈</Link>
            <Link to="/events" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">이벤트 목록</Link>
            <Link to="/recommend" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">AI 추천</Link>
          </div>

          {/* 연락처 및 저작권 */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-gray-800">Contact</h3>
            <p className="text-sm text-gray-500">Email: team@example.com</p>
            <p className="text-sm text-gray-500">GitHub: IBM-x-RedHat-Midterm-Project</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2026 Gunil Park & Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;