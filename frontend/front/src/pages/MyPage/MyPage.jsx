import React, { useEffect, useRef, useState, } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate()

    const [email, setEmail]=useState("")
    const [nickname, setNickname]=useState("")
    const [image_data, setImage_data]=useState("")
    const [bookmarks, setBookmarks]=useState([])
    const [courses, setCourses]=useState([])

    const {checkEmail, checkNickname} = useAuth();

    const [nicknameMode, setNicknameMode]=useState("view") //view:수정, check:중복확인, save:저장
    const [emailMode, setEmailMode]=useState("view")
    const [nicknameMsg, setNicknameMsg]=useState("")
    const [emailMsg, setEmailMsg]=useState("")

    const fileInputRef = useRef(null);


    //(마운트)회원 정보, 북마크, ai코스 불러오기
    // useEffect(() => {
    //     const userData = async () => {
    //         try {
    //             const response = await api.get('/api/users/me');
    //             if (response.data.success) {
    //                 const user = response.data.user;
    //                 setNickname(user.nickname)
    //                 setEmail(user.email)
    //                 setImage_data(user.image_data)
    //             }
    useEffect(()=>{
        const userData = async () =>{
            try{
                const userResponse = {
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
                    const user = userResponse.data.user;
                    setNickname(user.nickname)
                    setEmail(user.email)
                    setImage_data(user.image_data)
                }

                const bookmarkResponse = await api.get('/api/users/me/bookmarks')
                if (bookmarkResponse.data.success){
                    setBookmarks(bookmarkRes.data.events)
                }

                const courseResponse = await api.get('/api/users/me/courses')
                if (courseResponse.data.success){
                    setCourses(courseResponse.data.events)
                }
                
            } catch (error) {
                console.error("데이터 로드 오류 : ", error)
                alert("데이터를 로드하는데 실패했습니다.")
            }
        }
        userData();
    }, []);

    //연필 버튼 클릭 -> 이미지 input 클릭
    const handleImageBtn = () => {
        fileInputRef.current?.click();
    }

    //사진 변경
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

    //북마크 삭제
    const handleDeleteBookmark = async (content_id) =>{
        const confirm = window.confirm("저장된 북마크를 삭제하시겠습니까?")
        if(confirm === false){
            return;
        } else
        try{
            const response = await api.delete(`/api/users/me/bookmarks/${content_id}`)
            if(response.data.success){
            setBookmarks(prev=>prev.filter(b=>b.content_id !== content_id))}
        } catch(error) {
            console.error("북마크 삭제 오류 : ", error)
            alert("삭제하는 중에 문제가 발생했습니다. 다시 시도해 주세요.")
        }
    }

    //코스 삭제
    const handleDeleteCourse = async (course_id) =>{
        const confirm = window.confirm("저장된 추천코스를 삭제하시겠습니까?")
        if(confirm === false){
            return;
        } else
        try{
            const response = await api.delete(`/api/users/me/courses/${course_id}`)
            if(response.data.success){
            setCourses(prev=>prev.filter(c=>c.course_id !== course_id))}
        } catch(error) {
            console.error("코스 삭제 오류 : ", error)
            alert("삭제하는 중에 문제가 발생했습니다. 다시 시도해 주세요.")
        }
    }





    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4 font-sans text-gray-900">
            <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl p-12">
                <h1 className="text-3xl font-black mb-12 ml-2 tracking-tight">마이페이지</h1>
                
                <div className="flex flex-row items-center gap-16">
                    {/* 왼쪽: 프로필 사진 */}
                    <div className="relative flex-shrink-0">
                        <div className="w-48 h-48 rounded-full overflow-hidden shadow-md bg-gray-100 border-4 border-white ring-1 ring-gray-100">
                            <img
                                src={image_data || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button 
                            onClick={handleImageBtn}
                            className="absolute bottom-2 right-2 bg-blue-50 text-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-100 transition-all border-2 border-white"
                        >
                            <span className="text-xl font-bold text-blue-600">🖍</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onChangeImage}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* 오른쪽: 인풋창 덩어리 */}
                    <div className="flex-1 bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden shadow-inner">
                        {/* 닉네임 영역 */}
                        <div className="p-8 border-b border-gray-200 transition-all hover:bg-white group">
                            <div className="flex items-center justify-between gap-8">
                                <div className="flex-1">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">닉네임</label>
                                    {nicknameMode === "view" ? (
                                        <span className="text-2xl font-bold text-gray-800">{nickname}</span>
                                    ) : (
                                        <input type='text' 
                                            value={nickname} 
                                            onChange={(e)=>{
                                                setNickname(e.target.value)
                                                setNicknameMode("check")
                                            }}  
                                            className="w-full bg-transparent border-b-2 border-blue-500 outline-none text-2xl font-bold py-1 text-gray-800"
                                            autoFocus
                                        />
                                    )}
                                </div>
                                <button onClick={handleNicknameBtn}
                                    className={`px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-sm ${
                                        nicknameMode === "save" 
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 shadow-lg" 
                                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
                                >
                                    {nicknameMode === "view" ? "수정" : 
                                     nicknameMode === "check" ? "중복확인" : "저장"}
                                </button>
                            </div>
                            {nicknameMsg && <p className={`mt-4 text-sm font-bold ${nicknameMode === 'save' ? 'text-blue-600' : 'text-red-500'}`}>{nicknameMsg}</p>}
                        </div>

                        {/* 이메일 영역 */}
                        <div className="p-8 transition-all hover:bg-white group">
                            <div className="flex items-center justify-between gap-8">
                                <div className="flex-1">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">이메일</label>
                                    {emailMode === "view" ? (
                                        <span className="text-2xl font-bold text-gray-800">{email}</span>
                                    ) : (
                                        <input type='text' 
                                            value={email} 
                                            onChange={(e)=>{
                                                setEmail(e.target.value)
                                                setEmailMode("check")
                                            }}  
                                            className="w-full bg-transparent border-b-2 border-blue-500 outline-none text-2xl font-bold py-1 text-gray-800"
                                        />
                                    )}
                                </div>
                                <button onClick={handleEmailBtn}
                                    className={`px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-sm ${
                                        emailMode === "save" 
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 shadow-lg" 
                                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
                                >
                                    {emailMode === "view" ? "수정" : 
                                     emailMode === "check" ? "중복확인" : "저장"}
                                </button>
                            </div>
                            {emailMsg && <p className={`mt-4 text-sm font-bold ${emailMode === 'save' ? 'text-blue-600' : 'text-red-500'}`}>{emailMsg}</p>}
                        </div>
                    </div>
                </div>

                <hr className="my-10 border-gray-100" />

                <section>
                    <h2>북마크 목록</h2>

                    {bookmarks.length > 0 ? (
                        bookmarks.map((item) => (
                            <div key={item.bookmark_id} style={{ border: '1px solid #eee', borderRadius: '20px', padding: '15px', marginBottom: '10px' }}>
                                <img src={item.first_image} alt="" style={{ width: '100%', borderRadius: '15px' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>📍 {item.region}</p>
                                        <p style={{ color: 'gray', fontSize: '12px' }}>{item.start_date} ~ {item.end_date}</p>
                                    </div>

                                <button 
                                onClick={() => handleDeleteBookmark(item.content_id)}
                                style={{ backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 12px' }}
                                >📌
                                </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                        <p>아직 북마크한 행사가 없어요. 마음에 드는 행사를 찾아볼까요?</p>
                        <button onClick={()=>navigate('/events')}>다양한 행사 찾아보기</button>
                        </>
                    )}
                </section>

                <section>
                    <h2>AI 추천코스 목록</h2>

                    {courses.length > 0 ? (
                        courses.map((item) => (
                            <div key={item.course_id} style={{ border: '1px solid #eee', borderRadius: '20px', padding: '15px', marginBottom: '10px' }}>
                                {/*  api목록에 image가 없음 */}

                                <div style={{ display: 'flex', justifyContent:? 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
                                    <div>
                                        <p>코스 이름: {item.course_title}</p>
                                        <p>📍 {item.region}</p>
                                        <p>{item.description}</p>
                                        <p style={{ color: 'gray', fontSize: '12px' }}>{item.start_date} ~ {item.end_date}</p>
                                    </div>

                                <button 
                                onClick={() => handleDeleteBookmark(item.content_id)}
                                style={{ backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 12px' }}
                                >📌
                                </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                        <p>아직 저장된 코스가 없네요. AI와 함께 맞춤형 여행 계획을 세워볼까요?</p>
                        <button onClick={()=>navigate('/recommend')}>나만의 코스 만들기</button>
                        </>
                    )}
                </section>


                <div className="mt-6 pt-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                    GIUT Project © 2026. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default MyPage;