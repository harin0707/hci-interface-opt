import { useRouter } from 'next/router';
import styled from 'styled-components';

export default function Home() {
    const router = useRouter();

    const navigateToPage = () => {
        router.push('/'); // 이동할 경로 설정
    };

    return (
        <Container>
            <h1>Home</h1>
            <Button onClick={navigateToPage}>이동</Button>
        </Container>
    );
    }

// styled-components 스타일 정의
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    `;

    const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;
