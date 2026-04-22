import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import App from './../../App';
import api from '../../../api';

const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    


    const navigate = useNavigate();
    
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
      
        // 1.if,else문 사용 (제미나이가 자꾸 .catch(() => ({})) 이거라도 붙이래요..싫은데..)
        const response = await api.post('/api/auth/login', {email, password}).catch(() => ({}));

        if (response.data.success === true){
            navigate("/")
        }
        else if (response.data.success === false){
            alert("이메일 또는 비밀번호가 일치하지 않습니다.")
        } else {
            alert("오류가 발생했습니다. 다시 시도해주세요.")
        }

        // 2.try,catch 문 사용 (이메일,비번 오류가 에러 취급 당한다면 왜 이렇게 작성해야 하는지 모르곘음)
        // try{
        //     const response = await api.post('/api/auth/login', {email, password})

        //     if (response.data.success == true){
        //         navigater("/")
        //     } else {
        //         alert("이메일 또는 비밀번호가 일치하지 않습니다.")
        //     }    
        // } catch (error) {
        //     console.error("로그인 에러 :", error)
        //     alert("오류가 발생했습니다. 다시 시도해주세요.")
        // }

    };


    return (
        <div>
            <h1>로그인</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <input type='email' placeholder='이메일을 입력해주세요' value={email} onChange={handleEmailChange} required/>
                    {emailError && <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>}
                </div>
                <div>
                    <input type='password' placeholder='비밀번호를 입력해주세요' value={password} onChange={handlePasswordChange} required/>
                    {passwordError && <p style={{ color: 'red', fontSize: '12px' }}>{passwordError}</p>}
                </div>
                <button type='submit'>로그인</button>
            </form>
            <p>
                회원이 아니신가요?
                <button type='button' onClick={goSignup}> 회원가입</button>
            </p>

        </div>
    );
};

export default LoginPage;