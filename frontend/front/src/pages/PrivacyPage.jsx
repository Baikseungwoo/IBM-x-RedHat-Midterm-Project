import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen pt-20 pb-20 px-10">
      <div className="max-w-[800px] mx-auto bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">개인정보처리방침</h1>
        <p className="text-sm text-blue-500 font-medium mb-10">시행일자: 2026년 4월 21일</p>
        
        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section className="bg-yellow-50/50 p-6 rounded-2xl border border-yellow-100">
            <h2 className="text-lg font-bold text-gray-800 mb-3">1. 수집하는 개인정보 항목</h2>
            <p>GIUT은 원활한 서비스 제공을 위해 아래와 같은 정보를 수집할 수 있습니다.<br/>
            - 필수항목: 이메일, 닉네임, 서비스 이용 기록, 접속 로그</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">2. 개인정보의 수집 및 이용 목적</h2>
            <p>수집된 정보는 사용자 식별, 맞춤형 행사 정보 추천, 문의 사항 응대 및 서비스 개선을 위한 통계 자료로만 활용됩니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <p>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이 파기합니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;