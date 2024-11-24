import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { experimentIdState, taskState } from "../../atoms/atoms.js";
import MapSection from "../component/MapSection.js";
import { mapData } from "../mapData.js";
import { storeDataA } from "../../data/storedataA.js";


export default function Condition2() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태
    

    const [scale, setScale] = useState(1); // 확대/축소 배율
    const [position, setPosition] = useState({ x: 0, y: 0 }); // 지도 이동 위치
    const [dragging, setDragging] = useState(false); // 드래그 상태
    const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // 드래그 시작 위치
    
    const taskId = 1;
    const conditionId = 1;

    // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData =
        tasks
            ?.find((task) => task.taskId === taskId)
            ?.conditions.find((condition) => condition.conditionId === conditionId) || {
            totalClicks: 0,
            timeSpent: 0,
        };

    // 전역 클릭 이벤트 추가
    useEffect(() => {
        const handleGlobalClick = () => {
            setClickCount((prev) => prev + 1);
        };

        document.addEventListener("click", handleGlobalClick);

        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    // 타이머 시작 및 중단 관리
    useEffect(() => {
        let timer;
        if (isTimerRunning) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timer); // 타이머 정리
    }, [isTimerRunning]);

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

    // 타이머 시작 핸들러
    const handleStartTimer = () => {
        setIsTimerRunning(true); // 타이머 시작
        setElapsedTime(0); // 시간 초기화
    };


    // 맞게 클릭했을 때 동작
    const handleStoreClick = (storeId) => {
        if (storeId === "A-1") {
            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            setIsTimerRunning(false); // 타이머 중단
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.taskId === taskId
                        ? {
                                ...task,
                                conditions: task.conditions.map((condition) =>
                                    condition.conditionId === conditionId
                                        ? {
                                            ...condition,
                                            totalClicks: clickCount + 1,
                                            timeSpent: elapsedTime,
                                            correctClick: true,
                                        }
                                        : condition
                                ),
                            }
                        : task
                )
            );
            router.push("/task1/c3");
        }
    };

// 드래그 시작 이벤트 핸들러
const handleDragStart = (e) => {
    e.preventDefault(); // 기본 이벤트 차단
    e.stopPropagation(); // 이벤트 전파 차단
    setDragging(true);
    setStartPos({
        x: e.clientX || e.touches[0]?.clientX, // 마우스 또는 터치
        y: e.clientY || e.touches[0]?.clientY,
    });
};

// 드래그 이동 이벤트 핸들러
const handleDragMove = (e) => {
    if (!dragging) return;

    e.preventDefault(); // 기본 동작 차단
    e.stopPropagation(); // 이벤트 전파 차단

    const currentX = e.clientX || e.touches[0]?.clientX;
    const currentY = e.clientY || e.touches[0]?.clientY;

    const newX = position.x + (currentX - startPos.x);
    const newY = position.y + (currentY - startPos.y);

    // 경계 설정
    const boundaryX = Math.min(Math.max(newX, -500), 500);
    const boundaryY = Math.min(Math.max(newY, -500), 500);

    setPosition({ x: boundaryX, y: boundaryY });
    setStartPos({ x: currentX, y: currentY });
};

// 드래그 끝 이벤트 핸들러
const handleDragEnd = (e) => {
    e.preventDefault(); // 기본 동작 차단
    e.stopPropagation(); // 이벤트 전파 차단
    setDragging(false);
};

    const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.2, 3));
    const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));



    return (
        <Container
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}>
            <div>Condition2 확대/축소 버튼 - Task Num: 1</div>
            <ZoomContainer>
                <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
                <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
            </ZoomContainer>
            <InfoContainer>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
            </InfoContainer>
            <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "시작"}
            </Button>
            
            <MapContainer style={{ transform: `scale(${scale})` }}>
                <M1Con isColumn="column"> 
                    <M2Con id="3"> 
                    {storeDataA.map((store) => (
                    <MA onClick={() => handleStoreClick(store.id)} 
                    key={store.id} 
                    style={{
                        width: store.width,
                        height: store.height,
                    }}
                    >{store.name}</MA>))}
                    </M2Con>
                    <M2Con id="7"> 
                        <M3Con id="7">B</M3Con>
                        <M3Con id="3">C</M3Con>
                    </M2Con>
                </M1Con>
                <M1Con>
                    <M2Con id="4" > D </M2Con>
                    <M2Con id="6" isColumn="column"> 
                        <M4Con id="3">E</M4Con>
                        <M4Con id="7">F</M4Con>
                    </M2Con>
                </M1Con>
            </MapContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;

    overflow: hidden;
    position: relative;

cursor: grab;

    &:active {
        cursor: grabbing;
    }
transform-origin: center;

pointer-events: auto;
`;

const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;

    #info {
        margin: 15px;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #0073e6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

//
const MapContainer = styled.div`
padding: 5px;
display: flex;
background-color: red;
width: 100vw;
height: 73vh;

display: flex;
transform-origin: center;

pointer-events: auto;

`

const M1Con = styled.div`
    display: flex;
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")}; /* id에 따라 방향 변경 */
    border: 2px solid green;
    padding: 5px;
    width: 100vw;
`;

const M2Con = styled.div`
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")};
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    background-color: yellow;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

`;

const M3Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    background-color: yellow;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

`;

const M4Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    background-color: yellow;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

`;


const MA = styled.div`
    background-color: lightgreen;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.5rem;
    margin: 1px;

    padding: 5px;
    cursor: pointer;

    pointer-events: auto;
`;

const ZoomContainer = styled.div`
    display: flex;
    justify-content: baseline;
    gap: 10px;
    margin: 10px 0 0 0;
    z-index: 100;
`;

const ZoomButton = styled.button`
    padding: 10px 20px;
    background-color: #0073e6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #005bb5;
    }
`;

