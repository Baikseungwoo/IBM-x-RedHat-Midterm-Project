import React from 'react';

const TermsPage = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen pt-20 pb-20 px-10">
      <div className="max-w-[800px] mx-auto bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">이용약관</h1>
        
        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">제 1 조 (목적)</h2>
            <p>본 약관은 GIUT(이하 "서비스")이 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 서비스의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">제 2 조 (용어의 정의)</h2>
            <p>1. "이용자"란 서비스를 이용하는 모든 회원 및 비회원을 말합니다.<br/>
               2. "콘텐츠"란 서비스가 제공하는 행사 정보, 지도 데이터 등을 말합니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">제 3 조 (서비스의 제공)</h2>
            <p>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 하나, 시스템 점검이나 설비 장애 시 일시 중단될 수 있습니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;