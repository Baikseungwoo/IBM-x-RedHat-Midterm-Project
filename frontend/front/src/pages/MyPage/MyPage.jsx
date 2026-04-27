import React, { useEffect, useRef, useState, } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';

const MyPage = () => {
    const [email, setEmail]=useState("")
    const [nickname, setNickname]=useState("")
    const [image_data, setImage_data]=useState("")

    const {checkEmail, checkNickname} = useAuth();

    const [nicknameMode, setNicknameMode]=useState("view") //view:수정, check:중복확인, save:저장
    const [emailMode, setEmailMode]=useState("view")
    const [nicknameMsg, setNicknameMsg]=useState("")
    const [emailMsg, setEmailMsg]=useState("")

    const fileInputRef = useRef(null);


    //(마운트)회원 정보 불러오기
    useEffect(()=>{
        const userData = async () =>{
            try{
                // const response= await api.get('/api/users/me');
                // if(response.data.success){
                const response = {
                    data: {
                        success: true,
                        user: {
                            nickname: "테스트유저",
                            email: "test@example.com",
                            image_data: "https://via.placeholder.com/150"
                        }
                    }
                }
                if (true){
                    const user = response.data.user;
                    setNickname(user.nickname)
                    setEmail(user.email)
                    setImage_data(user.image_data)
                }
            } catch (error) {
                console.error("회원정보 로드 오류 : ", error)
                alert("회원정보를 로드하는데 실패했습니다.")
            }
        }
        userData();
    }, []);

    //연필 버튼 클릭 -> 이미지 input 클릭
    const handleImageBtn = () => {
        fileInputRef.current?.click();
    }

    //사진 선택 -> 
    const onChangeImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result;
            
            try {

                const response = await api.put('/api/users/me', {
                    image_data: base64,
                    nickname: nickname, 
                    email: email
                });

                if (response.data.success) {
                    setImage_data(base64); 
                    alert("프로필 이미지가 변경되었습니다.");
                }
            } catch (error) {
                console.error("이미지 업로드 오류 : ", error);
                alert("이미지 변경에 실패했습니다.");
            }
        };
        reader.readAsDataURL(file);
    }

    //닉네임 수정 버튼 변경
    const handleNicknameBtn = async () =>{
        if(nicknameMode === "view"){
            setNicknameMode("check")
        } else if(nicknameMode === "check"){
            if(!nickname) return alert("닉네임을 입력해주세요.")
            try{
                const isDuplicated = await checkNickname(nickname)
                if(isDuplicated){
                    setNicknameMsg("이미 사용중인 닉네임 입니다.")
                } else{
                    setNicknameMsg("사용 가능한 닉네임입니다.")
                    setNicknameMode("save")
                }
            } catch(error){
                alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
            }
        }
    }

    //이메일 수정버튼 변경
    const handleEmailBtn = async () =>{
        if(emailMode === "view"){
            setEmailMode("check")
        } else if(emailMode === "check"){
            if(!email) return alert("이메일을 입력해주세요.")
            try{
                const isDuplicated = await checkEmail(email)
                if(isDuplicated){
                    setEmailMsg("이미 사용중인 이메일입니다.")
                } else{
                    setEmailMsg("사용 가능한 이메일입니다.")
                    setEmailMode("save")
                }
            } catch (error) {
                alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
            }
        }
    }

    //회원정보 수정 저장
    const handleUpdate = async () =>{
        try{
            const response = await api.put('/api/users/me', {
                email:email,
                nickname:nickname,
                image_data:image_data
            })
        } catch (error) {
            console.error("회원정보 수정 오류 : ", error)
            alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    }





    return (
        <div>
            <h1>마이페이지</h1>
            <div>
                <img
                    src={image_data || "https://via.placeholder.com/150"}
                    alt="Profile"
                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />

                <button onClick={handleImageBtn}>🖍</button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onChangeImage}
                    accept="image/*"
                    style={{ display: "none" }}
                />

                <hr />

            <div>
                <label>닉네임</label>
                <div>
                    {nicknameMode === "view" ? (
                        <span>{nickname}</span>
                    ) : (
                        <input type='text' 
                        value={nickname} 
                        onChange={(e)=>{
                            setNickname(e.target.value)
                            setNicknameMode("check")
                        }}  
                        />
                    )}

                    <button onClick={handleImageBtn}>
                        {nicknameMode === "view" ? "수정" : 
                         nicknameMode === "check" ? "중복확인" : "저장"}
                    </button>
                </div>

                {nicknameMsg && <p>{nicknameMsg}</p>}

            </div>
            </div>
        </div>
    );
};

export default MyPage;