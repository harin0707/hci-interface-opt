import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { experimentIdState, taskState } from '../atoms/atoms.js';


export default function Condition1() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출

    //Recoil 상태 가져오기
    const experimentId = useRecoilValue(experimentIdState);
    const tasks = useRecoilValue(taskState);

     // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData = tasks
    .find((task) => task.taskId === 1) // taskId가 1인 Task 찾기
    ?.conditions.find((condition) => condition.conditionId === 1); // conditionId가 1인 조건 찾기
        

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