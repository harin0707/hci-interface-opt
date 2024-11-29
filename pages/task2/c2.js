import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { experimentIdState, taskState } from "../../atoms/atoms.js";
import { storeDataA } from "../../data/storedataA.js";
import { storeDataB } from "../../data/storedataB.js";
import { storeDataC } from "../../data/storedataC.js";
import { storeDataD } from "../../data/storedataD.js";
import { storeDataE } from "../../data/storedataE.js";
import { storeDataF } from "../../data/storedataF.js";
import {
    Container,
    InfoContainer,
    Button,
    Btn,
    MapContainer,
    ZoomContainer,
    ZoomButton,
    Nav,
    ArrorContainer,
    ArrowButton,
    AdminToggleButton,
} from "../../styles/c2Style.js";
import { M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB } from "../../styles/mapStyle";


export default function Condition2() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태
    

    const [scale, setScale] = useState(1); // 확대/축소 배율
    const [isZooming, setIsZooming] = useState(false); // 확대/축소 버튼 사용 상태

    const [position, setPosition] = useState({ x: 0, y: 0 }); // 지도 이동 위치
    const [isMoving, setIsMoving] = useState(false); // 버튼 지속 상태
    const [moveDirection, setMoveDirection] = useState(null); // 이동 방향

    const [isAdminMode, setIsAdminMode] = useState(true); // 운영자 모드 상태 추가
    useEffect(() => {
        const handleTouchMove = (e) => {
            if (!isAdminMode && e.touches.length > 1) {
                e.preventDefault(); // 운영자 모드가 아니면 두 손가락 확대/축소 방지
            }
        };
    
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => {
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isAdminMode]);

    const toggleAdminMode = () => {
        setIsAdminMode((prevMode) => !prevMode); // 운영자 모드 토글
        console.log(isAdminMode);
    };

    
    // 두 손가락 터치 관련 상태
    const [touchStartDistance, setTouchStartDistance] = useState(null);
    
    // 터치 확대/축소 계산 함수
    const getTouchDistance = (touches) => {
        const [touch1, touch2] = touches;
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };
    
    // 터치 시작 핸들러
    const handleTouchStart = (e) => {
        if (!isAdminMode) return; // 운영자 모드가 아니면 무시
    
        if (e.touches.length === 2) {
            // 확대/축소 시작
            const distance = getTouchDistance(e.touches);
            setTouchStartDistance(distance);
        } else if (e.touches.length === 1) {
            // 드래그 시작
            setDragging(true);
            setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    };
    
    // 터치 이동 핸들러
    const handleTouchMove = (e) => {
        if (!isAdminMode) return; // 운영자 모드가 아니면 무시
    
        if (e.touches.length === 2 && touchStartDistance) {
            // 확대/축소 계산
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / touchStartDistance;
            setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3)); // 확대/축소 제한
            setTouchStartDistance(currentDistance);
        } else if (dragging && e.touches.length === 1) {
            // 드래그 계산
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            setPosition((prevPos) => ({
                x: prevPos.x + (currentX - startPos.x),
                y: prevPos.y + (currentY - startPos.y),
            }));
            setStartPos({ x: currentX, y: currentY });
        }
    };
    
    // 터치 종료 핸들러
    const handleTouchEnd = () => {
        if (!isAdminMode) return; // 운영자 모드가 아니면 무시
        setDragging(false); // 드래그 종료
    };
    



    const handleMoveStart = (direction) => {
        setMoveDirection(direction);
        setIsMoving(true);
    };

    const handleMoveStop = () => {
        setIsMoving(false);
        setMoveDirection(null);
    };

    useEffect(() => {
        if (!isMoving || !moveDirection) return;

        const moveMap = () => {
            setPosition((prev) => {
                const moveDistance = 5; // 이동 거리
                switch (moveDirection) {
                    case "up":
                        return { ...prev, y: prev.y - moveDistance };
                    case "down":
                        return { ...prev, y: prev.y + moveDistance };
                    case "left":
                        return { ...prev, x: prev.x - moveDistance };
                    case "right":
                        return { ...prev, x: prev.x + moveDistance };
                    default:
                        return prev;
                }
            });
        };

        const interval = setInterval(moveMap, 50); // 이동 속도 조정
        return () => clearInterval(interval);
    }, [isMoving, moveDirection]);


    const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // 현재 탐색 중인 매장 인덱스

    const taskId = 2;
    const conditionId = 2;
    // 전역 변수로 관리할 매장 정보
    const targetStores = [
        { name: "하남스타필드", id: "E-42" }, // 두 번째 매장
        { name: "코스트코", id: "B-36" }, // 첫 번째 매장

    ];


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
        if (storeId === targetStores[currentTargetIndex].id) {
            if (currentTargetIndex === targetStores.length - 1) {
                alert( `정답입니다!\n모든 매장을 찾았습니다!\n총 클릭 횟수: 
            ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
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
            router.push("/task2/c3");
        } else {
            // 다음 매장으로 진행
            alert(
                `정답입니다! 다음 매장: ${targetStores[currentTargetIndex + 1].id[0]}구역에 ${targetStores[currentTargetIndex + 1].name}를 찾아주세요!`
            );
            setCurrentTargetIndex((prevIndex) => prevIndex + 1);
        }
    }}
    // 순서에 맞지 않는 매장은 무시

    
     // 확대 버튼 핸들러
    const handleZoomIn = () => {
        setIsZooming(true);
        setScale((prevScale) => Math.min(prevScale + 0.2, 3));
        setTimeout(() => setIsZooming(false), 300); // 확대 후 상태 복원
    };

    // 축소 버튼 핸들러
    const handleZoomOut = () => {
        setIsZooming(true);
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
        setTimeout(() => setIsZooming(false), 300); // 축소 후 상태 복원
    };



    return (
        <Container>

            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
            <div style={{ fontWeight: "bold" }}> [조건 2] 확대/축소, 드래그 버튼 구현</div>
            
            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> 
                Task2: {`${targetStores[currentTargetIndex].id[0]}구역에서 ${targetStores[currentTargetIndex].name}를 찾아주세요`}
                </div>
                <div id="info">탐색 매장 수: 2</div>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
                <div id="info" style={{ fontWeight: "bold" }}> 운영자 모드  </div>
                <AdminToggleButton onClick={toggleAdminMode}>
                    {isAdminMode ? "활성화" : "비활성화"}
                </AdminToggleButton>
            </InfoContainer>

            <Nav>
                <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                    {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
                </Button>
                <ZoomContainer>
                    <ZoomButton onClick={handleZoomIn}  disabled={isZooming}>+</ZoomButton>
                    <ZoomButton onClick={handleZoomOut} disabled={isZooming}>-</ZoomButton>
                </ZoomContainer>

                <ArrorContainer>
                <ArrowButton
                    onMouseDown={() => handleMoveStart("down")}
                    onMouseUp={handleMoveStop}
                    onMouseLeave={handleMoveStop}
                    onTouchStart={() => handleMoveStart("down")}
                    onTouchEnd={handleMoveStop}
                >
                    ↑
                </ArrowButton>

                <div>
                    <ArrowButton
                        onMouseDown={() => handleMoveStart("right")}
                        onMouseUp={handleMoveStop}
                        onMouseLeave={handleMoveStop}
                        onTouchStart={() => handleMoveStart("right")}
                        onTouchEnd={handleMoveStop}
                    >
                        ←
                    </ArrowButton>
                    <ArrowButton
                        onMouseDown={() => handleMoveStart("left")}
                        onMouseUp={handleMoveStop}
                        onMouseLeave={handleMoveStop}
                        onTouchStart={() => handleMoveStart("left")}
                        onTouchEnd={handleMoveStop}
                    >
                        →
                    </ArrowButton>
                </div>

                <ArrowButton
                    onMouseDown={() => handleMoveStart("up")}
                    onMouseUp={handleMoveStop}
                    onMouseLeave={handleMoveStop}
                    onTouchStart={() => handleMoveStart("up")}
                    onTouchEnd={handleMoveStop}
                >
                    ↓
                </ArrowButton>

                </ArrorContainer>
            </Nav>
            
            

            
            
            <MapContainer style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                }}>
                <M1Con isColumn="column"> 
                    <M2Con id="3" style={{
                        borderRight: "solid 15px #CFBFBA",
                    }}> 
                    {storeDataA.map((store) => (
                    <MA onClick={() => handleStoreClick(store.id)} 
                    key={store.id} style={{
                        width:store.width,
                        height:store.height,
                        transform: `rotate(${store.rotation}deg)`,
                        fontSize: store.size,
                        color: store.color,
                        backgroundColor: store.bg,
                    }}
                    >{store.name}</MA>))}
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
                        borderTop: "solid 10px #CFBFBA",}}> 
                        {storeDataC.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,}}>{store.name}</MA>))}</M3Con>
                    </M2Con>
                </M1Con>

                <M1ConD>
                    <M2Con id="5" >{storeDataD.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
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
                        }}>{store.name}</MA>))}
                        </M4Con>
                        <M4Con id="6" isColumn="column" style={{
                        borderTop: "solid 10px #CFBFBA",
                        borderLeft: "solid 10px #CFBFBA",
                        transform: `rotate(-20deg)`,
                        
                    }}> {storeDataF.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
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


