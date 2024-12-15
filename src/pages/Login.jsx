import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 높이를 가득 채움 */
  background-color: #f9f9f9;
`;
const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
`;


const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  display: block;
  text-align: left;
`;

const Input = styled.input`
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
  font-weight: bold;
  font-size: 1rem;

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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // 로그인 API 호출
      const response = await axios.post("http://localhost:5000/api/login", {
        id,
        password,
      });

      if (response.data.success) {
        // 로그인 성공 시 토큰 저장
        localStorage.setItem("token", response.data.token);
        alert("로그인 성공!");
        navigate("/room"); // 룸 페이지로 리다이렉트
      } else {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <FormWrapper>
        <Title>로그인</Title>
        <form onSubmit={handleLogin} autoComplete="off">
          <Label htmlFor="id">아이디</Label>
          <Input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            autoComplete="new-id"npm
          />
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Button type="submit">로그인</Button>
        </form>
        <Paragraph>
          회원가입이 아직 안되셨나요? <Link href="/register">회원가입</Link>
        </Paragraph>
      </FormWrapper>
    </>
  );
};

export default Login;
