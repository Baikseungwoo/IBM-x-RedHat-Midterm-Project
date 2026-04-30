import React, { useState, useRef } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const ProfileSection = ({ user, setUser }) => {
    const { checkEmail, checkNickname } = useAuth();
    const fileInputRef = useRef(null);

    const [nicknameMode, setNicknameMode] = useState("view");
    const [emailMode, setEmailMode] = useState("view");
    const [nicknameMsg, setNicknameMsg] = useState("");
    const [emailMsg, setEmailMsg] = useState("");

    const DefaultProfileSVG = () => (
        <svg className="w-full h-full text-gray-400 bg-gray-200 p-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    // 공통 서버 전송 로직 (명세서 규격에 맞춤)
    const updateProfileOnServer = async (updatedData) => {
        try {
            // 명세서 규격: { email, nickname, image_data } 3개만 정확히 추출해서 전송
            // user 객체에 들어있는 user_id, created_at 등이 포함되면 400 에러가 날 수 있음
            const payload = {
                email: updatedData.email,
                nickname: updatedData.nickname,
                // image_data가 전체 DataURL(data:image...)인 경우 순수 base64만 추출
                image_data: updatedData.image_data?.includes(',') 
                            ? updatedData.image_data.split(',')[1] 
                            : updatedData.image_data 
            };

            const res = await api.put('/api/users/me', payload);

            if (res.status === 200 || res.data.success) {
                // 서버는 업데이트된 정보를 다시 주므로, 이를 상태에 반영 (전체 정보 유지)
                setUser(prev => ({
                    ...prev,
                    ...res.data.user
                }));
                return true;
            }
        } catch (error) {
            console.error("서버 전송 실패:", error.response?.data || error.message);
            alert(`수정 실패: ${error.response?.data?.detail || "알 수 없는 오류"}`);
            return false;
        }
    };

    // 1. 프로필 이미지 변경
    const onChangeImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const fullBase64 = reader.result;
            
            // 이미지 변경 시에도 현재의 닉네임과 이메일을 함께 보내야 함 (MeUpdateRequest 규격)
            const success = await updateProfileOnServer({
                ...user,
                image_data: fullBase64
            });

            if (success) alert("이미지가 변경되었습니다.");
        };
        reader.readAsDataURL(file);
    };

    // 2. 닉네임 버튼 로직
    const handleNicknameBtn = async () => {
        if (nicknameMode === "view") {
            setNicknameMode("check");
            setNicknameMsg("");
        } else if (nicknameMode === "check") {
            if (!user.nickname) return alert("닉네임을 입력해주세요.");
            try {
                const isDuplicated = await checkNickname(user.nickname);
                if (isDuplicated) {
                    setNicknameMsg("이미 사용중인 닉네임입니다.");
                } else {
                    setNicknameMsg("사용 가능한 닉네임입니다.");
                    setNicknameMode("save");
                }
            } catch (e) { alert("중복 확인 오류"); }
        } else if (nicknameMode === "save") {
            const success = await updateProfileOnServer(user);
            if (success) {
                alert("닉네임이 수정되었습니다.");
                setNicknameMode("view");
                setNicknameMsg("");
            }
        }
    };


    // 3. 이메일 버튼 로직
    const handleEmailBtn = async () => {
        if (emailMode === "view") {
            setEmailMode("check");
            setEmailMsg("");
        } else if (emailMode === "check") {
            if (!user.email) return alert("이메일을 입력해주세요.");
            try {
                const isDuplicated = await checkEmail(user.email);
                if (isDuplicated) {
                    setEmailMsg("이미 사용중인 이메일입니다.");
                } else {
                    setEmailMsg("사용 가능한 이메일입니다.");
                    setEmailMode("save");
                }
            } catch (e) { alert("중복 확인 오류"); }
        } else if (emailMode === "save") {
            const success = await updateProfileOnServer(user);
            if (success) {
                alert("이메일이 수정되었습니다.");
                setEmailMode("view");
                setEmailMsg("");
            }
        }
    };

    return (
        <div className="flex flex-row items-center gap-16 bg-white p-12 rounded-[40px] shadow-sm border border-gray-50">
            <div className="relative flex-shrink-0">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-md bg-gray-100 border-4 border-white ring-1 ring-gray-100 flex items-center justify-center">
                    {user.image_data ? (
                        <img
                            src={user.image_data.startsWith('data:') ? user.image_data : `data:image/png;base64,${user.image_data}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <DefaultProfileSVG />
                    )}
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-50 text-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-100 transition-all border-2 border-white"
                >
                    <span className="text-xl font-bold">🖍</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={onChangeImage} accept="image/*" className="hidden" />
            </div>

            <div className="flex-1 bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden shadow-inner">
                {/* 닉네임 섹션 */}
                <div className="p-8 border-b border-gray-200 hover:bg-white transition-all group">
                    <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">닉네임</label>
                            {nicknameMode === "view" ? (
                                <span className="text-2xl font-bold text-gray-800">{user.nickname || "닉네임 없음"}</span>
                            ) : (
                                <input 
                                    type='text' 
                                    value={user.nickname} 
                                    onChange={(e) => {
                                        setUser({ ...user, nickname: e.target.value });
                                        setNicknameMode("check");
                                    }}  
                                    className="w-full bg-transparent border-b-2 border-blue-500 outline-none text-2xl font-bold py-1 text-gray-800"
                                />
                            )}
                        </div>
                        <button onClick={handleNicknameBtn} className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${nicknameMode === "save" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
                            {nicknameMode === "view" ? "수정" : nicknameMode === "check" ? "중복확인" : "저장"}
                        </button>
                    </div>
                    {nicknameMsg && <p className={`mt-4 text-sm font-bold ${nicknameMode === 'save' ? 'text-blue-600' : 'text-red-500'}`}>{nicknameMsg}</p>}
                </div>

                {/* 이메일 섹션 */}
                <div className="p-8 hover:bg-white transition-all group">
                    <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">이메일</label>
                            {emailMode === "view" ? (
                                <span className="text-2xl font-bold text-gray-800">{user.email || "이메일 없음"}</span>
                            ) : (
                                <input 
                                    type='text' 
                                    value={user.email} 
                                    onChange={(e) => {
                                        setUser({ ...user, email: e.target.value });
                                        setEmailMode("check");
                                    }}  
                                    className="w-full bg-transparent border-b-2 border-blue-500 outline-none text-2xl font-bold py-1 text-gray-800"
                                />
                            )}
                        </div>
                        <button onClick={handleEmailBtn} className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${emailMode === "save" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
                            {emailMode === "view" ? "수정" : emailMode === "check" ? "중복확인" : "저장"}
                        </button>
                    </div>
                    {emailMsg && <p className={`mt-4 text-sm font-bold ${emailMode === 'save' ? 'text-blue-600' : 'text-red-500'}`}>{emailMsg}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;