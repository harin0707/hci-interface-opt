import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';
import { experimentIdState, taskState } from '../../atoms/atoms.js'

    export async function getStaticPaths() {
        // 사전에 생성할 경로 정의
        const paths = [
        { params: { id: 'task1-c1' } },
        { params: { id: 'task2-c1' } },
        { params: { id: 'task3-c1' } },
        ];
    
        return {
        paths,
        fallback: false, // paths에 정의되지 않은 경로는 404 반환
        };
    }
    
    export async function getStaticProps({ params }) {
        // 정적 페이지로 전달할 데이터 정의
        const { id } = params;
        return {
        props: {
            id,
        },
        };
    }
export default function Condition1() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출
    

    //Recoil 상태 가져오기
    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);


    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const taskId = 1; // 예시로 Task ID를 1로 설정
    const conditionId = 1; // 예시로 Condition ID를 1로 설정

     // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData = tasks
    .find((task) => task.taskId === 1) // taskId가 1인 Task 찾기
    ?.conditions.find((condition) => condition.conditionId === 1); // conditionId가 1인 조건 찾기
        
     // 소요 시간 증가
    useEffect(() => {
        const timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);

    // Recoil 상태에 실시간 데이터 업데이트
    useEffect(() => {
        setTasks((prevTasks) =>
        prevTasks.map((task) =>
            task.taskId === taskId
            ? {
                ...task,
                conditions: task.conditions.map((condition) =>
                    condition.conditionId === conditionId
                    ? {
                        ...condition,
                        totalClicks: clickCount,
                        timeSpent: elapsedTime,
                        }
                    : condition
                ),
                }
            : task
        )
        );
    }, [elapsedTime, clickCount, setTasks]);

    // 클릭 횟수 증가 함수
    const handleButtonClick = () => {
        setClickCount((prev) => prev + 1);
    };
    return (

        <Container>
            <div>Condition1 Page 기존 방식-  Task Num: 1</div>
            <InfoContainer>
                <div id='info'> 실험자: {experimentId || '정보 없음'}</div>
                <div id='info' >총 클릭 횟수: {conditionData.totalClicks}</div>
                <div id='info'>잘못 클릭한 횟수: {conditionData.incorrectClicks}</div>
                <div id='info'>소요 시간: {conditionData.timeSpent}</div>

            </InfoContainer>
            

        </Container>
    )

}



const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 20px 0;
`;

const InfoContainer = styled.div`
display: flex;
align-items: center;
margin: 20px 0;

#info{
    margin: 15px;
}
`;