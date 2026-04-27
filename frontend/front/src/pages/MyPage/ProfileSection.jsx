import React, { useState, useRef } from 'react';
import api from '../../api';

const ProfileSection = ({ user, setUser }) => {
    const fileInputRef = useRef(null);
    const [isEdit, setIsEdit] = useState({ nickname: false, email: false });

    const handleUpdate = async (field, value) => {
        try {
            const res = await api.put('/api/users/me', { ...user, [field]: value });
            if (res.data.success) {
                setUser(prev => ({ ...prev, [field]: value }));
                setIsEdit(prev => ({ ...prev, [field]: false }));
            }
        } catch (e) { alert("수정에 실패했습니다."); }
    };

    return (
        <div className="flex items-center gap-10 bg-white p-10 rounded-[40px] shadow-sm">
            <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                    <img src={user.image_data || "/default-profile.png"} className="w-full h-full object-cover" />
                </div>
                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-1 right-1 bg-gray-700 text-white p-2 rounded-full border-2 border-white text-xs">🖍</button>
                <input type="file" ref={fileInputRef} className="hidden" />
            </div>

            <div className="flex-1 space-y-4">
                <div className="bg-gray-100 p-6 rounded-3xl flex justify-between items-center px-8">
                    <span className="text-xl font-bold">{user.nickname}</span>
                    <button className="text-gray-400 text-sm font-bold bg-gray-200 px-4 py-1 rounded-lg">수정</button>
                </div>
                <div className="bg-gray-100 p-6 rounded-3xl flex justify-between items-center px-8">
                    <span className="text-xl font-bold text-gray-600">{user.email}</span>
                    <button className="text-gray-400 text-sm font-bold bg-gray-200 px-4 py-1 rounded-lg">수정</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;