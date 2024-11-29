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
} from "../../styles/c1Style.js";
import { M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB } from "../../styles/mapStyle";





export default function Condition1() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [scale, setScale] = useState(1); // 확대/축소 배율
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태

    const taskId = 1;
    const conditionId = 1;

    // 전역적으로 관리할 매장 정보를 선언
    const targetStore = {
        name: "커피빈", // 찾아야 하는 매장 이름
        id: "A-8", // 찾아야 하는 매장 ID
    };
    

    // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData =
        tasks
            ?.find((task) => task.taskId === taskId)
            ?.conditions.find((condition) => condition.conditionId === conditionId) || {
            totalClicks: 0,
            timeSpent: 0,
        };

        useEffect(() => {
            const handleRouteChange = () => {
                // 라우트 변경 시 확대 비율 초기화
                document.body.style.zoom = "1";
            };
    
            router.events.on("routeChangeComplete", handleRouteChange);
            return () => {
                router.events.off("routeChangeComplete", handleRouteChange);
            };
        }, [router.events]);
    


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
        if (storeId === targetStore.id) {
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
            // 전체 문서 확대율을 기본값으로 설정
        // document.body.style.zoom = "1"; 
        // document.body.style.transform = ""; 
            router.push("/task1/c2"); // /task1/c2로 라우팅
        }
    };

    const ZOOM_COOLDOWN = 2000; // 확대/축소 쿨다운 시간
    const DRAG_COOLDOWN = 2000; // 드래그 쿨다운 시간
    const [isZoomAllowed, setIsZoomAllowed] = useState(true); // 확대 쿨다운 상태
    const [isDragAllowed, setIsDragAllowed] = useState(true); // 드래그 쿨다운 상태
    const [dragging, setDragging] = useState(false); // 드래그 상태
    const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // 드래그 시작 위치

    const handleDragStart = (e) => {
        if (!isDragAllowed) return; // 쿨다운 중이면 동작하지 않음
    
        setDragging(true);
        setStartPos({
            x: e.clientX || e.touches[0]?.clientX,
            y: e.clientY || e.touches[0]?.clientY,
        });
    };
    
    const handleDragMove = (e) => {
        if (!dragging || !isDragAllowed) return; // 쿨다운 중이면 동작하지 않음
    
        const currentX = e.clientX || e.touches[0]?.clientX;
        const currentY = e.clientY || e.touches[0]?.clientY;
    
        setPosition((prev) => ({
            x: prev.x + (currentX - startPos.x),
            y: prev.y + (currentY - startPos.y),
        }));
        setStartPos({ x: currentX, y: currentY });
    
        // 드래그 쿨다운 활성화
        setIsDragAllowed(false);
        setTimeout(() => setIsDragAllowed(true), DRAG_COOLDOWN);
    };
    
    const handleDragEnd = () => {
        setDragging(false);
    };
    


    const handleZoom = (e) => {
        if (!isZoomAllowed) return; // 쿨다운 중이면 동작하지 않음
    
        if (e.touches.length === 2) {
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / touchStartDistance;
            setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3));
            setTouchStartDistance(currentDistance);
    
            // 확대 쿨다운 활성화
            setIsZoomAllowed(false);
            setTimeout(() => setIsZoomAllowed(true), ZOOM_COOLDOWN);
        }
    };
    



    return (
        <Container
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleZoom}
        onTouchMove={handleZoom}
        onTouchEnd={handleDragEnd}
        style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        }} >
            <div style={{ fontWeight: "bold" }}> [조건 1] 자유로운 확대와 드래그</div>
            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>

            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> {`Task1 ${targetStore.id[0]}구역에서 ${targetStore.name}를 찾아주세요`} </div>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
            </InfoContainer>
            <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
            </Button>
            <MapContainer
            style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            }}>
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





