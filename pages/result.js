import { useRecoilValue } from "recoil";
import { taskState,  experimentIdState } from "../atoms/atoms.js"
import { useRouter } from "next/router";
import styled from "styled-components";

export default function Result() {
    const tasks = useRecoilValue(taskState); // Recoil에서 상태 가져오기
    const experimentId = useRecoilValue(experimentIdState); // 실험자 ID 가져오기
    const router = useRouter();
    return (
        <>
        <Container>
        <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
        <Title>{experimentId || "정보 없음"} 결과</Title>
        {tasks.map((task) => (
                <InputContainer key={task.taskId}>
                    <div style={{ fontWeight: "bold" }}>Task{task.taskId}</div>
                    {task.conditions.map((condition) => (
                        <div key={condition.conditionId}>
                            조건 {condition.conditionId} -총 횟수: {condition.totalClicks}회, 작업 시간: {condition.timeSpent}초
                        </div>
                    ))}
                </InputContainer>
            ))}
    


        </Container>
        </>



    );
}


const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100vh;

`;


const Title = styled.h3`
font-size: 20px;
margin-bottom: 10px;
color: #333;
`;

const InputContainer = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
margin-top: 8px;
border-bottom: black solid 1px;
`;

const Btn = styled.button`
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: black;
        color: white;
        border: none;
        padding: 5px;
        border-radius: 5px;
`