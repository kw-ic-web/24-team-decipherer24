import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9f9f9; /* 배경색 */
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
    margin-bottom: 2rem;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 왼쪽 정렬 */
    margin-bottom: 1rem;

    label {
        margin-right: 10px;
        font-weight: bold;
        font-size: 1rem;
        width: 150px; /* 라벨의 고정 너비 설정 */
    }
`;

const Input = styled.input`
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    margin-right: 10px; /* 버튼과의 간격 */
    width: 200px; /* 입력 칸의 너비 설정 */
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: ${({ disabled }) => (disabled ? '#a5d1ff' : '#007bff')};
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ disabled }) =>
            disabled ? '#a5d1ff' : '#0056b3'};
    }
`;

const Message = styled.span`
    display: block;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: ${({ error }) => (error ? 'red' : 'green')};
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
        id: '',
        password1: '',
        password2: '',
    });

    const [isIDValid, setIsIDValid] = useState(false);
    const [idMessage, setIdMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // 아이디 중복 확인
    const checkID = async () => {
        try {
            const response = await axios.get('http://localhost:21281/api/check-id', {
                params: { userid: user.id },
            });

            if (response.data.exists) {
                setIsIDValid(false);
                setIdMessage('이미 사용 중인 아이디입니다.');
            } else {
                setIsIDValid(true);
                setIdMessage('사용 가능한 아이디입니다.');
            }
        } catch (err) {
            console.error('아이디 확인 중 오류 발생', err);
        }
    };

    // 비밀번호 확인
    const checkPasswordMatch = () => {
        if (user.password1 !== user.password2) {
            setPasswordMessage('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordMessage('');
        }
    };

    // 회원가입 처리
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!isIDValid || passwordMessage !== '') return;

        try {
            const response = await axios.post('http://localhost:21281/api/register', {
                id: user.id,
                password: user.password1,
            });

            alert('회원가입 성공!');
            // 회원가입 후 로그인 페이지로 리디렉션
            window.location.href = '/login';
        } catch (err) {
            console.error('회원가입 실패', err);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <>
            <FormWrapper>
                <Title>회원가입</Title>
                <form onSubmit={handleRegister}>
                    {/* 아이디 입력과 중복 확인 버튼 */}
                    <Row>
                        <label htmlFor='id'>아이디</label>
                        <Input
                            type='text'
                            id='id'
                            value={user.id}
                            onChange={(e) =>
                                setUser({ ...user, id: e.target.value })
                            }
                            required
                        />
                        <Button type='button' onClick={checkID}>
                            중복 확인
                        </Button>
                    </Row>
                    <Message error={!isIDValid}>{idMessage}</Message>

                    {/* 비밀번호 입력 */}
                    <Row>
                        <label htmlFor='password1'>비밀번호</label>
                        <Input
                            type='password'
                            id='password1'
                            value={user.password1}
                            onChange={(e) =>
                                setUser({ ...user, password1: e.target.value })
                            }
                            onBlur={checkPasswordMatch}
                            required
                        />
                    </Row>

                    {/* 비밀번호 확인 */}
                    <Row>
                        <label htmlFor='password2'>비밀번호 확인</label>
                        <Input
                            type='password'
                            id='password2'
                            value={user.password2}
                            onChange={(e) =>
                                setUser({ ...user, password2: e.target.value })
                            }
                            onBlur={checkPasswordMatch}
                            required
                        />
                    </Row>
                    <Message error={passwordMessage !== ''}>
                        {passwordMessage}
                    </Message>

                    {/* 회원가입 버튼 */}
                    <Button
                        type='submit'
                        disabled={!isIDValid || passwordMessage !== ''}
                    >
                        가입하기
                    </Button>
                </form>

                <Paragraph>
                    이미 계정이 있으신가요?{' '}
                    <Link href='/login'>여기에서 로그인</Link>
                </Paragraph>
            </FormWrapper>
        </>
    );
};

export default Register;
