import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#F9F9F9] border-t border-gray-200 py-10">
      <div className="max-w-[1200px] mx-auto px-10 flex flex-col items-center">
        
        <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-4 text-[13px] font-medium text-gray-500">
          <Link to="/about" className="hover:underline">회사소개</Link>
          <span className="text-gray-300">|</span>
          <Link to="/terms" className="hover:underline">이용약관</Link>
          <span className="text-gray-300">|</span>
          <Link to="/privacy" className="hover:underline font-bold text-gray-800">개인정보처리방침</Link>
          <span className="text-gray-300">|</span>
          <Link to="/support" className="hover:underline">문의하기</Link>
          <span className="text-gray-300">|</span>
          <Link to="/history" className="hover:underline">문의내역</Link>
        </nav>

        <div className="flex flex-wrap justify-center items-center gap-x-3 mb-5 text-[12px] text-gray-400">
          <span className="font-bold text-gray-500 tracking-tight">GIUT Project</span>
          <span className="text-gray-200">|</span>
          <span>Contact : ibm1234@event.com</span>
          <span className="text-gray-200">|</span>
          <span>IBM x RedHat AI(AX)</span>
        </div>

        <div className="w-full max-w-2xl border-t border-gray-600/50 text-center pt-1">
          <p className="text-[11px] text-gray-400 tracking-wider uppercase font-medium">
            Copyright © 2026 <span className="text-gray-500 font-bold">GIUT Corp.</span> All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;