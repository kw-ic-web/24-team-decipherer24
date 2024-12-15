import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate로 변경
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  const [error, setError] = useState("");  // 로그인 에러 상태 추가
  const navigate = useNavigate();  // useNavigate로 변경

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:21281/api/login', {
        id,
        password,
      });

      const { token, user } = response.data;

      // 토큰을 로컬 스토리지나 쿠키에 저장
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);

      // 로그인 성공 시 홈 페이지로 리디렉션
      navigate("/room");  // 홈 페이지로 리디렉션 (useNavigate로 변경)
    } catch (err) {
      console.error(err);
      // 로그인 실패 시 에러 메시지 표시
      setError(err.response?.data?.error || "로그인에 실패했습니다.");
    }
  };

  return (
    <Container>
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
            autoComplete="new-id"
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

        {error && <p style={{ color: "red" }}>{error}</p>} {/* 에러 메시지 표시 */}

        <Paragraph>
          회원가입이 아직 안되셨나요? <Link href="/register">회원가입</Link>
        </Paragraph>
      </FormWrapper>
    </Container>
  );
};

export default Login;
