import { useRecoilState } from 'recoil';
import { experimentIdState } from '../atoms/atoms.js';
import styled from 'styled-components';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [experimentId, setExperimentId] = useRecoilState(experimentIdState);

    const handleInputChange = (event) => {
    setExperimentId(event.target.value);

    };

    return (


        <>
        <Container>
        <Title>실험자 번호를 입력하세요</Title>
        <InputContainer>
        <Input
        type="text"
        placeholder="실험자 번호"
        value={experimentId}
        onChange={handleInputChange}
        />
        </InputContainer>

        <BtnContainer>
            <Button onClick={() => router.push('/task1/c1')}>Task1</Button>
            <Button onClick={() => router.push('/task2/c1')}>Task2</Button>
            <Button onClick={() => router.push('/task3/c1')}>Task3</Button>
        </BtnContainer>
            <Btn onClick={() => router.push('/prac')}>연습하기</Btn>
        </Container>
        </>
    )
}

    const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 20px;

    `;

    const Title = styled.h3`
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
    `;

    const InputContainer = styled.div`
    display: flex;
    justify-content: center;
    `;

    const Input = styled.input`
    padding: 8px;
    font-size: 16px;
    margin-right: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
    `;

    const BtnContainer = styled.div`
    
    `

    const Button = styled.button`
        padding: 10px 20px;
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 70px;
        margin: 0 5px;

    `;

const Btn = styled.button`
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    width: 240px;
    margin: 5px;

`;
