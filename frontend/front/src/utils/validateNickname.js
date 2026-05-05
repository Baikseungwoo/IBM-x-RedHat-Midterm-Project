export const validateNickname = (nickname) => {
    const trimmed = nickname.trim();

    if (trimmed.length < 2 || trimmed.length > 10) {
        return "닉네임은 2자 이상 10자 이하로 입력해주세요.";
    }

    if (!/[a-zA-Z0-9가-힣]/.test(trimmed)) {
        return "닉네임은 특수문자로만 사용할 수 없습니다.";
    }

    return "";
};
