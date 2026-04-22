import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';

const SignUp = () => {

    // 컨텍스트에서 전체 유저 목록과 체크 상태 변경 함수를 가져왔다고 가정
    // const { allUsers, setIdCheck } = useContext(UserContext);

    const [nickname, setNickname]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [confirmPassword, setConfirmPassword]=useState("")

    const [showPassword, setShowPassword]=useState(false)
    const [showPasswordCheck, setShowPasswordCheck]=useState(false)

    const [nicknameCheck, setNicknameCheck]=useState(false)
    const [emailCheck, setEmailCheck]=useState(false)

    const navigate = useNavigate();

    const handleNicknameCheck = async ()=>{
        if (!nickname) return alert("닉네임을 입력해주세요."); 
        const response = await api.get(`/api/auth/check-nickname?nickname=${nickname}`);
            if (response.data.duplicated === true){
                alert("이미 사용중인 닉네임입니다.")
                setNicknameCheck(false)
            } else {
                alert("사용 가능한 닉네임입니다.")
                setNicknameCheck(true)
            }
        }

    const handleEmailCheck = async ()=>{
        if (!email) return alert("이메일을 입력해주세요.");
        const response = await api.get(`/api/auth/check-email?email=${email}`);
            if (response.data.duplicated === true){
                alert("이미 사용중인 이메일입니다.")
                setEmailCheck(false)
            } else {
                alert("사용 가능한 이메일입니다.")
                setEmailCheck(true)
            }
        }

    const handleSignup = async (e) =>{
        e.preventDefault()

        if (!nicknameCheck){
            alert("닉네임 중복 확인을 해주세요.")
            return
        } 
        if (!emailCheck){
            alert("이메일 중복 확인을 해주세요.")
            return
        }
        if (password !== confirmPassword){
            alert("비밀번호가 일치하지 않습니다.")
            return
        }

        try{
            const signupData = {
                email,
                password,
                nickname,
                image_data:"" //string이라 넣음. 아니면 기본 이미지 넣는거 해야하나?
            }
            const response = await api.post("/api/auth/signup", signupData)
            if (response.data.success === true){
                alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.")
                navigate("/login")
            }
        } catch (error){
            console.error("회원가입 에러 :", error)
            alert("오류가 발생했습니다. 다시 시도해주세요.")
        }

    }

    return (
        <div>
            <h1>회원가입</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <span>🙍‍♂️</span>
                    <input 
                    type='text'
                    placeholder='닉네임을 입력해주세요' 
                    value={nickname} 
                    onChange={(e)=>{
                        setNickname(e.target.value);
                        setNicknameCheck(false);
                    }}
                    required/>
                    <button type='button' onClick={handleNicknameCheck}>중복확인</button>
                </div>

                <div>
                    <span>🙍‍♂️</span>
                    <input 
                    type='text'
                    placeholder='이메일을 입력해주세요' 
                    value={email} 
                    onChange={(e)=>{
                        setEmail(e.target.value);
                        setEmailCheck(false);
                    }}
                    required/>
                    <button type='button' onClick={handleEmailCheck}>중복확인</button>
                </div>

                <div>
                    <span>🔒</span>
                    <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='비밀번호를 입력해주세요'
                    value={password}
                    onChange={(e)=>
                        setPassword(e.target.value)
                    }
                    required/>
                    <button type='button' onClick={()=>setShowPassword(!showPassword)}>👁</button>
                </div>

                <div>
                    <span>🔒</span>
                    <input
                    type={showPasswordCheck ? 'text' : 'password'}
                    placeholder='비밀번호를 재입력해주세요'
                    value={confirmPassword}
                    onChange={(e)=>
                        setConfirmPassword(e.target.value)
                    }
                    required/>
                    <button type='button' onClick={()=>setShowPasswordCheck(!showPasswordCheck)}>👁</button>
                </div>

                <button type='submit'>회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;