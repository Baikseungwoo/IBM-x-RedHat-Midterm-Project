import React from 'react';

const AboutPage = () => {
  return (
    <div className="w-full bg-white min-h-screen pt-20 pb-20 px-10">
      <div className="max-w-[800px] mx-auto space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">About GIUT</h1>
          <p className="text-xl text-gray-500 font-medium">전국 모든 행사를 연결하는 스마트 플랫폼</p>
        </section>

        <section className="space-y-6 leading-relaxed text-gray-700">
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-600 mb-3">우리의 미션</h2>
            <p>GIUT은 "어디로 가야 할지 고민될 때" 가장 먼저 떠오르는 파트너가 되고자 합니다. 지역별 파편화된 행사 정보를 통합하여 사용자에게는 즐거움을, 지역 사회에는 활력을 불어넣습니다.</p>
          </div>

          <div className="space-y-4 px-4">
            <h2 className="text-2xl font-bold text-gray-800">주요 서비스</h2>
            <ul className="list-disc list-inside space-y-2 opacity-80">
              <li>지도를 활용한 직관적인 지역별 행사 탐색</li>
              <li>실시간 인기 여행지 및 축제 랭킹 제공</li>
              <li>사용자 맞춤형 테마별 행사 추천</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;   