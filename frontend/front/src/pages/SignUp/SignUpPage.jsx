import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SuccessModal from '../../components/SuccessModal';


const SignUp = () => {

    const [nickname, setNickname]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [confirmPassword, setConfirmPassword]=useState("")
    const [successModalOpen, setSuccessModalOpen] = useState(false);


    const [showPassword, setShowPassword]=useState(false)
    const [showPasswordCheck, setShowPasswordCheck]=useState(false)

    const [nicknameCheck, setNicknameCheck]=useState(false)
    const [emailCheck, setEmailCheck]=useState(false)

    const navigate = useNavigate();
    
    const {checkNickname, checkEmail, signup} = useAuth();

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailCheck(false);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (value.length > 0 && !emailRegex.test(value)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
        } else {
            setEmailError("");
        }
        };

        const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (value.length > 0 && !passwordRegex.test(value)) {
            setPasswordError("비밀번호는 영문과 특수문자를 포함해 8자 이상이어야 합니다.");
        } else {
            setPasswordError("");
        }

        if (confirmPassword.length > 0 && value !== confirmPassword) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPasswordError("");
        }
        };

        const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (value.length > 0 && value !== password) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPasswordError("");
        }
    };


    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");


    const handleNicknameCheck = async ()=>{
        if (!nickname) return alert("닉네임을 입력해주세요."); 
        try{
            const isDuplicated = await checkNickname(nickname)
            if (isDuplicated){
                alert("이미 사용중인 닉네임입니다.");
            } else{
                alert("사용 가능한 닉네임입니다.");
                setNicknameCheck(true)
            }
        } catch (error) {
            alert("예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    }

    const handleEmailCheck = async ()=>{
        if (!email) return alert("이메일을 입력해주세요."); 
        if (emailError) {
            alert("올바른 이메일 형식으로 입력해주세요.");
            return;
        }
        try{
            const isDuplicated = await checkEmail(email)
            if (isDuplicated){
                alert("이미 사용중인 이메일입니다.");
            } else{
                alert("사용 가능한 이메일입니다.");
                setEmailCheck(true)
            }
        } catch (error) {
            alert("예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        if (emailError || passwordError || confirmPasswordError) {
            alert("입력 형식을 확인해주세요.");
            return;
        }

        if (!nicknameCheck) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        if (!emailCheck) {
            alert("이메일 중복 확인을 해주세요.");
            return;
        }

        if (!password || !confirmPassword) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await signup({ email, password, nickname, image_data: "" });
            setSuccessModalOpen(true);
        } catch (error) {
            alert("회원가입에 실패했습니다.");
        }
    };


    return (
        <>
            <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 border border-white">
                    <h1 className="text-3xl font-bold text-center text-[#1E3A8A] mb-10">회원가입</h1>
                    
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="relative flex items-center">
                            <span className="absolute left-5 text-lg">🙍‍♂️</span>
                            <input 
                                type='text'
                                placeholder='닉네임을 입력해주세요' 
                                className="w-full pl-12 pr-28 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                                value={nickname} 
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    setNicknameCheck(false);
                                }}
                                required
                            />
                            <button 
                                type='button' 
                                onClick={handleNicknameCheck}
                                className="absolute right-3 px-3 py-2 bg-blue-100 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-200 transition-colors"
                            >
                                중복확인
                            </button>
                        </div>

                        <div className="relative flex items-center">
                            <span className="absolute left-5 text-lg">📧</span>
                            <input
                                type="email"
                                placeholder="이메일을 입력해주세요"
                                className={`w-full pl-12 pr-28 py-4 bg-gray-50 border ${
                                    emailError ? "border-red-400" : "border-gray-100"
                                } rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner`}
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            
                            <button 
                                type='button' 
                                onClick={handleEmailCheck}
                                className="absolute right-3 px-3 py-2 bg-blue-100 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-200 transition-colors"
                            >
                                중복확인
                            </button>
                            
                        </div>
                        {emailError && (
                            <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                                {emailError}
                            </p>
                        )}
                        <div className="relative flex items-center">
                            <span className="absolute left-5 text-lg">🔒</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 입력해주세요"
                                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border ${
                                    passwordError ? "border-red-400" : "border-gray-100"
                                } rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner`}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <button 
                                type='button' 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showPassword ? '👁️' : '🙈'}
                            </button>
                        </div>
                            {passwordError && (
                                <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                                    {passwordError}
                                </p>
                            )}
                        <div className="relative flex items-center">
                            <span className="absolute left-5 text-lg">🔒</span>
                            <input
                                type={showPasswordCheck ? 'text' : 'password'}
                                placeholder="비밀번호를 다시 입력해주세요"
                                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border ${
                                    confirmPasswordError ? "border-red-400" : "border-gray-100"
                                } rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner`}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                />
                            <button 
                                type='button' 
                                onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                                className="absolute right-5 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showPasswordCheck ? '👁️' : '🙈'}
                            </button>
                        </div>
                                {confirmPasswordError && (
                            <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                                {confirmPasswordError}
                            </p>
                            )}
                        <button 
                            type='submit'
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 mt-6"
                        >
                            회원가입
                        </button>
                    </form>
                </div>
            </div>

            <SuccessModal
                open={successModalOpen}
                title="회원가입 완료"
                message="계정이 성공적으로 생성되었습니다. 로그인 페이지로 이동합니다."
                buttonText="로그인하기"
                onConfirm={() => {
                    setSuccessModalOpen(false);
                    navigate('/login');
                }}
            />
        </>
    );
};

export default SignUp;