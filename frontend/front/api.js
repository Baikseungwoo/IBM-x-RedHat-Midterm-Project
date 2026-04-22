import axios from "axios"

//axios : http요청 쉽게 보낼 수 있는 라이브러리
const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true,
});

export default api;