import React, { useState, useEffect } from "react";
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

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: ${({ disabled }) => (disabled ? "#a5d1ff" : "#007bff")};
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

const Input = styled.input`
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1rem;
    height: 48px;`
;

const Message = styled.span`
    color: ${({ error }) => (error ? "red" : "green")};
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
    display: block;
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

const Register = () => {
    const [user, setUser] = useState({
        id: "",
        password1: "",
        password2: "",
    });
    const [idMessage, setIdMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isIDValid, setIsIDValid] = useState(false);
    const navigate = useNavigate();

    // 회원가입 후 입력 필드를 초기화하는 useEffect
    useEffect(() => {
        setUser({ id: "", password1: "", password2: "" });
    }, []);  // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 초기화

    // 아이디 중복 확인
    const checkID = () => {
        if (user.id.trim() === "") {
            setIdMessage("아이디를 입력해주세요.");
            setIsIDValid(false);
            return;
        }

        // 임시 데이터로 ID 중복 확인
        const mockDatabase = [
            { id: "existingUser" },  // 예시로 존재하는 ID
        ];

        const idExists = mockDatabase.some((entry) => entry.id === user.id);

        if (idExists) {
            setIdMessage("ID가 이미 사용 중입니다.");
            setIsIDValid(false);
        } else {
            setIdMessage("사용 가능한 ID입니다.");
            setIsIDValid(true);
        }
    };

    // 비밀번호 일치 여부 확인
    const checkPasswordMatch = () => {
        if (user.password1.trim() === "" || user.password2.trim() === "") {
            setPasswordMessage("");
        } else if (user.password1 !== user.password2) {
            setPasswordMessage("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordMessage("");
        }
    };

    const validateForm = (event) => {
        event.preventDefault();
        
        if (!isIDValid) {
            setIdMessage("아이디 중복 확인이 필요합니다.");
            return;
        }
    
        if (user.password1 !== user.password2) {
            setPasswordMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
    
        const newUser = {
            id: user.id,
            password: user.password1,
        };
    
        localStorage.setItem("userId", newUser.id);
        localStorage.setItem("userPassword", newUser.password);
        
        alert("회원가입 성공!");
        navigate("/login");
        
        window.location.reload();
        

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 'user123', password: 'password123' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('회원가입 성공!');
            } else {
                alert('회원가입 실패');
            }
        })
        .catch(error => console.error('Error:', error));

        // 회원가입 성공 후 입력값 초기화
        setUser({ id: "", password1: "", password2: "" });
    };

    return (
        <div className="stage-container">
            <Title>회원가입</Title>
            <form onSubmit={validateForm} autoComplete="off">
                <Label htmlFor="id">아이디</Label>
                <Input
                    type="text"
                    id="id"
                    value={user.id}
                    onChange={(e) => setUser({ ...user, id: e.target.value })}
                    required
                    autoComplete="new-id"  // 아이디 자동완성 비활성화
                />
                <br/>
                <Button type="button" onClick={checkID}>
                    중복 확인
                </Button>
                <Message error={!isIDValid}>{idMessage}</Message>

                <Label htmlFor="password1">비밀번호</Label>
                <Input
                    type="password"
                    id="password1"
                    value={user.password1}
                    onChange={(e) => setUser({ ...user, password1: e.target.value })}
                    onBlur={checkPasswordMatch}
                    required
                    autoComplete="new-password"  // 비밀번호 자동완성 비활성화
                />
                <br />
                <Label htmlFor="password2">비밀번호 확인</Label>
                <Input
                    type="password"
                    id="password2"
                    value={user.password2}
                    onChange={(e) => setUser({ ...user, password2: e.target.value })}
                    onBlur={checkPasswordMatch}
                    required
                    autoComplete="new-password"  
                />
                <Message error={passwordMessage !== ""}>{passwordMessage}</Message>
                <Button type="submit" disabled={!isIDValid || passwordMessage !== ""}>
                    가입하기
                </Button>
            </form>
            <Paragraph>
                이미 계정이 있으신가요? <Link href="/login">여기에서 로그인</Link>
            </Paragraph>
        </div>
    );
};

export default Register;