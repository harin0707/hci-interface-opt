import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { experimentIdState, taskState } from "../atoms/atoms.js";
import { storeDataA } from "../data/storedataA.js";
import { storeDataB } from "../data/storedataB.js";
import { storeDataC } from "../data/storedataC.js";
import { storeDataD } from "../data/storedataD.js";
import { storeDataE } from "../data/storedataE.js";
import { storeDataF } from "../data/storedataF.js";

export default function Prac() {
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
    const [mode, setMode] = useState("touch"); // 모드 상태 (기본은 "zoom")
    
    const taskId = 1;
    const conditionId = 3;

    // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData =
        tasks
            ?.find((task) => task.taskId === taskId)
            ?.conditions.find((condition) => condition.conditionId === conditionId) || {
            totalClicks: 0,
            timeSpent: 0,
        };

        useEffect(() => {
            const preventPinchZoom = (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault(); // 두 손가락 터치 방지
                }
            };
    
            const allowPinchZoom = (e) => {
                // 두 손가락 확대/축소 동작 허용
                if (e.touches.length > 1) {
                    e.stopPropagation();
                }
            };
    
            if (mode === "touch" || mode === "drag") {
                // 터치나 드래그 모드일 때 두 손가락 방지
                document.addEventListener("touchmove", preventPinchZoom, { passive: false });
            } else if (mode === "zoom") {
                // 줌 모드일 때 두 손가락 확대/축소 허용
                document.addEventListener("touchmove", allowPinchZoom, { passive: false });
            }
    
            // 클린업 함수
            return () => {
                document.removeEventListener("touchmove", preventPinchZoom);
                document.removeEventListener("touchmove", allowPinchZoom);
            };
        }, [mode]); // mode가 변경될 때마다 실행

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
        if (mode === "touch" & storeId === "A-1") {
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
            router.push("/result"); 
        }
    };


       // 두 손가락 터치 관련 상태
        const [touchStartDistance, setTouchStartDistance] = useState(null);

        // 두 손가락 거리 계산
        const getTouchDistance = (touches) => {
            const [touch1, touch2] = touches;
            return Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        };
    
        // 터치 시작 핸들러
    const handleTouchStart = (e) => {
        if (mode === "zoom" && e.touches.length === 2) {
            const distance = getTouchDistance(e.touches);
            setTouchStartDistance(distance);
        } else if (mode === "drag" && e.touches.length === 1) {
            setDragging(true);
            setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    };

    // 터치 이동 핸들러
    const handleTouchMove = (e) => {
        if (mode === "zoom" && e.touches.length === 2 && touchStartDistance) {
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / touchStartDistance;
            setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3));
            setTouchStartDistance(currentDistance);
        } else if (mode === "drag" && dragging && e.touches.length === 1) {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            setPosition((prevPos) => ({
                x: prevPos.x + (currentX - startPos.x),
                y: prevPos.y + (currentY - startPos.y),
            }));
            setStartPos({ x: currentX, y: currentY });
        }
    };

    // 터치 끝 핸들러
    const handleTouchEnd = () => {
        if (mode === "zoom") {
            setTouchStartDistance(null);
        } else if (mode === "drag") {
            setDragging(false);
        }
    };

    
        // 드래그 시작 이벤트 핸들러
        const handleDragStart = (e) => {
            if (mode !== "drag") return;
            e.preventDefault();
            setDragging(true);
            setStartPos({
                x: e.clientX || e.touches[0]?.clientX,
                y: e.clientY || e.touches[0]?.clientY,
            });
        };
    
        // 드래그 이동 이벤트 핸들러
        const handleDragMove = (e) => {
            if (!dragging || mode !== "drag") return;
    
            const currentX = e.clientX || e.touches[0]?.clientX;
            const currentY = e.clientY || e.touches[0]?.clientY;
    
            const newX = position.x + (currentX - startPos.x);
            const newY = position.y + (currentY - startPos.y);
    
            setPosition({ x: newX, y: newY });
            setStartPos({ x: currentX, y: currentY });
        };
    
        // 드래그 끝 이벤트 핸들러
        const handleDragEnd = () => {
            if (mode !== "drag") return;
            setDragging(false);
        };
    



    return (
        <Container
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            >

            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
            <div style={{ fontWeight: "bold" }}>Task? [조건 ?] ? </div>

            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> Task: ?구역에서 ?를 찾아주세요 </div>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
            </InfoContainer>

            <Nav>
            <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
            </Button>

            <ModeContainer>
                <ModeButton
                    isActive={mode === "zoom"} onClick={() => setMode("zoom")}> 확대/축소 모드
                </ModeButton>
                <ModeButton 
                    isActive={mode === "drag"}onClick={() => setMode("drag")}>드래그 모드
                </ModeButton>
                <ModeButton 
                    isActive={mode === "touch"} onClick={() => setMode("touch")}>터치 모드
                </ModeButton>
                
                </ModeContainer>

            </Nav>

            <MapContainer
                style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                }}>
                <M1Con isColumn="column"> 
                    <M2Con id="3" style={{
                        borderRight: "solid 15px #CFBFBA",
                    }}> 
                    {storeDataA.map((store) => (
                    <MA onClick={() => handleStoreClick(store.id)} 
                    key={store.id} style={
                        {width:store.width,
                        height:store.height,
                        transform: `rotate(${store.rotation}deg)`,
                        fontSize: store.size,
                        color: store.color,
                        backgroundColor: store.bg,}} disabled={mode !== "touch"}
                    >{}</MA>))}
                    </M2Con>
                    <M2Con id="7"> 
                        <M3Con id="7" style={{
                        borderBottom: "solid 5px #CFBFBA",
                    }} >{storeDataB.map((store) => (<MB onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{}</MB>))}</M3Con>
                        <M3Con id="3" style={{
                        borderTop: "solid 10px #CFBFBA",
                    }}>{storeDataC.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                                width:store.width,
                                height:store.height,
                                transform: `rotate(${store.rotation}deg)`,
                                fontSize: store.size,
                                color: store.color,
                                backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{}</MA>))}</M3Con>
                    </M2Con>
                </M1Con>

                <M1ConD>
                    <M2Con id="5" > {storeDataD.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        width:store.width,
                        height:store.height,
                        transform: `rotate(${store.rotation}deg)`,
                        fontSize: store.size,
                        color: store.color,
                        backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{}</MA>))}  </M2Con>
                    <M2Con id="5"> 
                        <M4Con id="4" style={{
                            transform: `rotate 0deg)`,
                            borderTop: "solid 10px #CFBFBA",
                            borderRight: "solid 10px #CFBFBA",
                        }} >{storeDataE.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{}</MA>))}</M4Con>
                        <M4Con id="6" isColumn="column" style={{
                        borderTop: "solid 10px #CFBFBA",
                        borderLeft: "solid 10px #CFBFBA",
                        transform: `rotate(-20deg)`,
                        
                    }}>{storeDataF.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                         width:store.width,
                         height:store.height,
                         transform: `rotate(${store.rotation}deg)`,
                         fontSize: store.size,
                         color: store.color,
                         backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{}</MA>))}</M4Con>
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

const ModeContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    z-index: 100;
`;

const ModeButton = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: ${({ isActive }) => (isActive ? "black" : "#ccc")};
    color: white;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${({ isActive }) => (isActive ? "#005bb5" : "#bbb")};
    }
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

transform-origin: center;
pointer-events: auto;
`

const M1Con = styled.div`
    display: flex;
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")}; /* id에 따라 방향 변경 */
    padding: 5px;
    width: 100vw;
`;

const M2Con = styled.div`
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")};
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

`;

const M1ConD = styled.div`
    display: flex;
    flex-direction: ${({ isColumn }) => (isColumn === "column" ? "row" : "column")}; /* id에 따라 방향 변경 */
    padding: 5px;
    width: 100vw;
    flex-wrap: wrap;
`;

const M3Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    padding: 30px 0 ;

    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const M4Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 40px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

`;


const MA = styled.div`
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.3rem;
    margin: 1px;
    z-index: 10;

    padding: 1px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const MB = styled.div`
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.3rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;
    height: 50px;
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

