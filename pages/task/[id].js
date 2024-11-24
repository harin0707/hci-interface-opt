import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';
import { experimentIdState, taskState } from '../../atoms/atoms.js'
import MapSection from '../component/MapSection.js';

const mapData = [
    {
    section: "A",
    stores: [
        { id: "A-1", name: "카페 블랑", description: "특별한 커피와 디저트" },
        { id: "A-2", name: "북 카페", description: "책과 커피를 함께" },
        { id: "A-3", name: "필름 갤러리", description: "필름 카메라를 사랑하는 공간" },
        { id: "A-4", name: "오브제 스토어", description: "유니크한 소품 매장" },
        { id: "A-5", name: "파스텔 베이커리", description: "맛있는 베이커리와 음료" },
    ],
    },
    {
    section: "B",
    stores: [
        { id: "B-1", name: "플랜트샵", description: "실내 식물과 인테리어 아이템" },
        { id: "B-2", name: "스몰 라이브", description: "작은 음악 공연을 즐기는 공간" },
        { id: "B-3", name: "핸드메이드 마켓", description: "수공예 제품 판매" },
        { id: "B-4", name: "빈티지 의류", description: "개성 있는 빈티지 옷" },
        { id: "B-5", name: "코지 라운지", description: "휴식을 위한 라운지" },
    ],
    },
    {
    section: "C",
    stores: [
        { id: "C-1", name: "디자인 문구", description: "창의적인 문구용품" },
        { id: "C-2", name: "미니 갤러리", description: "작은 미술 작품 전시" },
        { id: "C-3", name: "아트 카페", description: "예술과 커피의 만남" },
        { id: "C-4", name: "서점 코너", description: "다양한 장르의 책" },
        { id: "C-5", name: "팝업 스토어", description: "특별한 이벤트 매장" },
    ],
    },
    {
    section: "D",
    stores: [
        { id: "D-1", name: "푸드마켓", description: "신선한 농산물과 간편식" },
        { id: "D-2", name: "헬스 라운지", description: "건강과 웰니스를 위한 공간" },
        { id: "D-3", name: "요가 스튜디오", description: "요가와 명상을 위한 공간" },
        { id: "D-4", name: "다이어트 카페", description: "저칼로리 메뉴 제공" },
        { id: "D-5", name: "비건 베이커리", description: "비건을 위한 빵과 디저트" },
    ],
    },
    {
    section: "E",
    stores: [
        { id: "E-1", name: "스마트 디바이스", description: "최신 전자기기 체험" },
        { id: "E-2", name: "게임존", description: "게임을 즐길 수 있는 공간" },
        { id: "E-3", name: "가전 매장", description: "가전제품 쇼룸" },
        { id: "E-4", name: "키즈 스토어", description: "아이들을 위한 장난감 매장" },
        { id: "E-5", name: "피트니스 웨어", description: "스포츠 의류와 용품" },
    ],
    },
    {
    section: "F",
    stores: [
        { id: "F-1", name: "페인팅 클래스", description: "미술 클래스 운영" },
        { id: "F-2", name: "도자기 공방", description: "도자기 제작 체험" },
        { id: "F-3", name: "플라워 샵", description: "꽃과 관련된 모든 것" },
        { id: "F-4", name: "DIY 스튜디오", description: "셀프 제작 워크숍" },
        { id: "F-5", name: "아로마 테라피", description: "아로마 제품과 힐링" },
    ],
    },
];



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
    const [incorrectClicks, setIncorrectClicks] = useState(0); // 잘못된 클릭 횟수 상태
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
                                        incorrectClicks: incorrectClicks,
                                        timeSpent: elapsedTime,
                                    }
                                : condition
                        ),
                    }
                    : task
            )
        );
}, [elapsedTime, clickCount, incorrectClicks, setTasks]);

// 클릭 이벤트 처리
const handleStoreClick = (storeId) => {
    setClickCount((prev) => prev + 1); // 클릭 횟수 증가
    if (storeId !== "A-3") {
        setIncorrectClicks((prev) => prev + 1); // 잘못된 클릭 횟수 증가
    }
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

            {mapData.map((section) => (
            <MapSection key={section.section} section={section} onStoreClick={handleStoreClick} />
            ))}


            

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