import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styled from "styled-components";

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 1rem;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1rem;
    height: 48px;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    transition: background-color 0.3s ease;
    font-weight:bold;
    font-size:1rem;

    &:hover {
        background-color: ${({ disabled }) => (disabled ? "#a5d1ff" : "#0056b3")};
    }
`;

const Paragraph = styled.p`
        margin-top: 1rem;
    font-size: 0.9rem;
    color: #666;
`;

const Link = styled.a`
        color: #007bff;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;


const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

    const storedId = localStorage.getItem("userId");
    const storedPassword = localStorage.getItem("userPassword");

    // 로그인 정보 확인
    if (id === storedId && password === storedPassword) {
      // 로그인 성공 시 토큰을 localStorage에 저장
        localStorage.setItem("token", "someAuthToken");
        alert("로그인 성공!");
      navigate("/home");  // 홈 페이지로 리다이렉트
    } else {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
};

return (
    <div className="stage-container">
        <Title>로그인</Title>
        <form onSubmit={handleLogin} autoComplete="off">
        <Label htmlFor="id">아이디</Label>
        <Input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            autoComplete="new-id" 
        /><br/>
        <Label htmlFor="password">비밀번호</Label>
        <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password" 
        />
        <br/>
        <Button type="submit">로그인</Button>
        </form>
        <Paragraph>
            회원가입이 아직 안되셨나요? <Link href="/register">회원가입</Link>
        </Paragraph>
    </div>
    );
};

export default Login;
