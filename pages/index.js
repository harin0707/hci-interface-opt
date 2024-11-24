import { useRecoilState } from 'recoil';
import { experimentIdState } from './atoms';
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
        <h1>Welcome to the Home Page</h1>
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
            <Button onClick={() => router.push('/condition1/1')}>Task1</Button>
            <Button onClick={() => router.push('/condition1/2')}>Task2</Button>
            <Button onClick={() => router.push('/condition1/3')}>Task3</Button>
        </BtnContainer>
        </Container>
        </>
    )
}

    const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
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
    
    `