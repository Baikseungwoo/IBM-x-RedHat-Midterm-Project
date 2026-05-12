import axios from "axios"

//axios : http요청 쉽게 보낼 수 있는 라이브러리
const getBaseURL = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    if (typeof window !== "undefined" && window.location.hostname) {
        return `${window.location.protocol}//${window.location.hostname}:8081`;
    }

    return "http://localhost:8081";
};

const api=axios.create({
    baseURL: getBaseURL(),
    withCredentials:true,
});

export default api;
