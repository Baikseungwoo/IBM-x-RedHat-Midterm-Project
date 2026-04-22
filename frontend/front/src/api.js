import axios from "axios"

//axios : http요청 쉽게 보낼 수 있는 라이브러리
const api=axios.create({
    baseURL: "http://localhost:8000",
    withCredentials:true,
});

export default api;