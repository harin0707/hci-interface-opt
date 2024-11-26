import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { experimentIdState, taskState } from "../../atoms/atoms.js";
import { storeDataA } from "../../data/storedataA.js";
import { storeDataB } from "../../data/storedataB.js";
import { storeDataC } from "../../data/storedataC.js";
import { storeDataD } from "../../data/storedataD.js";
import { storeDataE } from "../../data/storedataE.js";
import { storeDataF } from "../../data/storedataF.js";

export default function Condition1() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태

    const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // 현재 탐색 중인 매장 인덱스

    const [lastInteractionTime, setLastInteractionTime] = useState(0);
    const [isInteractionEnabled, setIsInteractionEnabled] = useState(true);

    const [touchCount, setTouchCount] = useState(0);
    const [isInteractionAllowed, setIsInteractionAllowed] = useState(true);
    const [isProcessingClick, setIsProcessingClick] = useState(false);

    const MAX_TOUCHES = 2; // 최대 연속 터치 횟수
    const TOUCH_RESET_TIME = 2000; // 터치 카운트 리셋 시간 (2초)
    const INTERACTION_COOLDOWN = 2000;

    const taskId = 2;
    const conditionId = 1;
    // 전역 변수로 관리할 매장 정보
    const targetStores = [
        { name: "스타벅스", id: "A-1" }, // 첫 번째 매장
        { name: "ABC 마트", id: "B-1" }, // 두 번째 매장
    ];
    

    // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData =
        tasks
            ?.find((task) => task.taskId === taskId)
            ?.conditions.find((condition) => condition.conditionId === conditionId) || {
            totalClicks: 0,
            timeSpent: 0,
        };

        const handleInteraction = () => {
            const currentTime = Date.now();
            
            if (!isInteractionAllowed) {
                return false;
            }
        
            if (currentTime - lastInteractionTime < INTERACTION_COOLDOWN) {
                return false;
            }
        
            if (touchCount >= MAX_TOUCHES) {
                setIsInteractionAllowed(false);
                alert("잠시 기다려 주세요.");
                setTimeout(() => {
                    setIsInteractionAllowed(true);
                    setTouchCount(0);
                }, TOUCH_RESET_TIME);
                return false;
            }
        
            setLastInteractionTime(currentTime);
            setTouchCount(prev => prev + 1);
        
            setTimeout(() => {
                setTouchCount(prev => Math.max(0, prev - 1));
            }, TOUCH_RESET_TIME);
        
            return true;
        };
        

    // 전역 클릭 이벤트 추가
    const throttledClick = useCallback(() => {
        const now = Date.now();
        if (now - lastInteractionTime >= INTERACTION_DELAY && !isProcessingClick) {
            setClickCount((prev) => prev + 1);
            setLastInteractionTime(now);
            
            // 시각적 피드백을 위한 상태 설정
            setIsProcessingClick(true);
            setTimeout(() => {
                setIsProcessingClick(false);
            }, INTERACTION_DELAY);
        }
    }, [lastInteractionTime, isProcessingClick]);
    
    useEffect(() => {
        const handleGlobalClick = () => {
            if (handleInteraction()) {
                setTimeout(() => {
                    setClickCount(prev => prev + 1);
                }, INTERACTION_COOLDOWN);
            }
        };
    
        document.addEventListener("click", handleGlobalClick);
        document.addEventListener("touchstart", handleGlobalClick);
    
        return () => {
            document.removeEventListener("click", handleGlobalClick);
            document.removeEventListener("touchstart", handleGlobalClick);
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


    const handleStoreClick = (storeId) => {
        if (!handleInteraction()) {
            return;
        }
    
        if (storeId === targetStores[currentTargetIndex].id) {
            setIsProcessingClick(true);
            setIsInteractionEnabled(false);
    
            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            setIsTimerRunning(false);
            
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
    
            if (currentTargetIndex < targetStores.length - 1) {
                setCurrentTargetIndex(prev => prev + 1);
                setTimeout(() => {
                    setIsProcessingClick(false);
                    setIsInteractionEnabled(true);
                }, INTERACTION_COOLDOWN);
            } else {
                setTimeout(() => {
                    setIsProcessingClick(false);
                    setIsInteractionEnabled(true);
                    router.push("/touch/c2");
                }, INTERACTION_COOLDOWN);
            }
        }
    };
    

    return (
        <Container>
            <div style={{ fontWeight: "bold" }}> [조건 1] 자유로운 확대와 드래그</div>
            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>

            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> 
                Task2: {`${targetStores[currentTargetIndex].id[0]}구역에서 ${targetStores[currentTargetIndex].name}를 찾아주세요`}
                </div>
                <div id="info">탐색 매장 수: 2</div>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
            </InfoContainer>
            <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
            </Button>
            <MapContainer>
                <M1Con isColumn="column"> 
                    <M2Con id="3"
                    style={{
                        borderRight: "solid 15px #CFBFBA",
                    }}>
                    {storeDataA.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        width:store.width,
                        height:store.height,
                        transform: `rotate(${store.rotation}deg)`,
                        fontSize: store.size,
                        color: store.color,
                        backgroundColor: store.bg,
                    }}>{store.name}</MA>))}
                    </M2Con>

                    <M2Con id="7"> 
                        <M3Con id="7" style={{
                        borderBottom: "solid 5px #CFBFBA",
                    }}> 
                        {storeDataB.map((store) => (<MB onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
                        }}>{store.name}</MB>))}
                        </M3Con>
                        <M3Con id="3" style={{
                        borderTop: "solid 10px #CFBFBA",
                    }}>
                        {storeDataC.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
                        }}>{store.name}</MA>))}
                        </M3Con>
                    </M2Con>
                </M1Con>

                <M1ConD>
                    <M2Con id="5"  >
                    {storeDataD.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        width:store.width,
                        height:store.height,
                        transform: `rotate(${store.rotation}deg)`,
                        
                        }}>{store.name}</MA>))}
                    </M2Con>
                    <M2Con id="5" > 
                        <M4Con id="4"
                        style={{
                            transform: `rotate 0deg)`,
                            borderTop: "solid 10px #CFBFBA",
                            borderRight: "solid 10px #CFBFBA",
                        }} 
                        
                        > {storeDataE.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,

                        }}>{store.name}</MA>))}</M4Con>
                        <M4Con id="6" isColumn="column" style={{
                        borderTop: "solid 10px #CFBFBA",
                        borderLeft: "solid 10px #CFBFBA",
                        transform: `rotate(-20deg)`,
                        
                    }} >
                        {storeDataF.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,

                        }}>{store.name}</MA>))}
                        </M4Con>
                    </M2Con>
                </M1ConD>
            </MapContainer>
        </Container>
    );
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

    #info {
        margin: 15px;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: black;
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


const MapContainer = styled.div`
padding: 1px;
display: flex;
width: 80vw;
height: 70vh;

`

const M1Con = styled.div`
    display: flex;
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")}; /* id에 따라 방향 변경 */
    padding: 5px;
    width: 100vw;
`;


const M1ConD = styled.div`
    display: flex;
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")}; /* id에 따라 방향 변경 */
    padding: 5px;
    width: 100vw;
    flex-wrap: wrap;
`;



const M2Con = styled.div`
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")};
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const M3Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; 
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 30px 0 ;


`;


const M4Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; 
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 40px;


`;


const MA = styled.div`
    background-color: #F5F5F5;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.3rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;
    z-index: 10;
`;

const MB = styled.div`
    background-color: #F5F5F5;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.3rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;

    z-index: 100;
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

const Nav = styled.div`
    display: flex;
    gap: 20px;
`




