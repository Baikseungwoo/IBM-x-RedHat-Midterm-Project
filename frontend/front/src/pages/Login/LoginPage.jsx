import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import App from './../../App';
import SuccessModal from '../../components/SuccessModal';


const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from || '/';

    const {login} = useAuth();
    
    const goSignup = () => {
        navigate('/signup');
    };

    const handleEmailChange=(e)=>{
        const value=e.target.value;
        setEmail(value);
        //아무문자@아무문자 + . + 아무문자
        const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (value.length > 0 && !emailCheck.test(value)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
        } else {
            setEmailError()
        }
    }

    const handlePasswordChange=(e)=>{
        const value=e.target.value;
        setPassword(value);
        //영문자, 특수문자 포함 최소 8자
        const pwCheck = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (value.length > 0 && !pwCheck.test(value)) {
            setPasswordError("특수문자를 포함해 8자 이상 입력해주세요.")
        } else {
            setPasswordError("");
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (emailError || passwordError) {
            alert("입력 양식을 확인해주세요.")
            return;
        }

        try{
            await login(email, password);
            setSuccessModalOpen(true);
        } catch (error) {
            alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

    };

    return (
        <>
            <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 border border-white">
                    <h1 className="text-3xl font-bold text-center text-[#1E3A8A] mb-10">로그인</h1>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input 
                                type='email' 
                                placeholder='이메일을 입력해주세요' 
                                className={`w-full px-6 py-4 bg-gray-50 border ${emailError ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner`}
                                value={email} 
                                onChange={handleEmailChange} 
                                required
                            />
                            {emailError && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{emailError}</p>}
                        </div>
                        
                        <div>
                            <input 
                                type='password' 
                                placeholder='비밀번호를 입력해주세요' 
                                className={`w-full px-6 py-4 bg-gray-50 border ${passwordError ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner`}
                                value={password} 
                                onChange={handlePasswordChange} 
                                required
                            />
                            {passwordError && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{passwordError}</p>}
                        </div>

                        <button 
                            type='submit'
                            className="w-full py-4 bg-[#999999] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 mt-4"
                        >
                            로그인
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        회원이 아니신가요?
                        <button 
                            type='button' 
                            onClick={goSignup}
                            className="text-blue-500 font-bold hover:underline ml-2"
                        >
                            회원가입
                        </button>
                    </p>
                </div>
            </div>

            <SuccessModal
                open={successModalOpen}
                title="로그인 성공"
                message="환영합니다. 이전 페이지로 이동합니다."
                buttonText="시작하기"
                onConfirm={() => {
                    setSuccessModalOpen(false);
                    navigate(redirectPath, { replace: true });
                }}
            />
        </>
    );
};

export default LoginPage;
