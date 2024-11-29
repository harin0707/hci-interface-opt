import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
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
    ModeContainer,
    ModeButton,
    InfoContainer,
    Button,
    Btn,
    MapContainer,
    Nav, M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB 
} from "../../styles/c3Style.js";

export default function Condition3() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const { elapsedTime, isTimerRunning, startTimer, stopTimer } = useTimer();
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    
    const [scale, setScale] = useState(1); // 확대/축소 배율
    const [position, setPosition] = useState({ x: 0, y: 0 }); // 지도 이동 위치
    const [dragging, setDragging] = useState(false); // 드래그 상태
    const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // 드래그 시작 위치
    const [mode, setMode] = useState("touch"); // 모드 상태 (기본은 "zoom")
    
    const taskId = 1;
    const conditionId = 3;
      // 전역적으로 관리할 매장 정보를 선언
    const targetStore = {
        name: "커피빈", // 찾아야 하는 매장 이름
        id: "A-8", // 찾아야 하는 매장 ID
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
    
            if (mode === "touch" ) {
                // 터치나 드래그 모드일 때 두 손가락 방지
                document.addEventListener("touchmove", preventPinchZoom, { passive: false });
            } else if (mode === "zoom" || mode === "drag") {
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
    


    // 맞게 클릭했을 때 동작
    const handleStoreClick = (storeId) => {
        if (mode === "touch" & storeId === targetStore.id) {
            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            stopTimer();

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
            router.push("/task2/c1"); 
        }
    };


       // 두 손가락 터치 관련 상태
        const [touchStartDistance, setTouchStartDistance] = useState(null);

        // 터치와 확대/축소 처리 핸들러 **수정된 부분**
        const getTouchDistance = (touches) => {
            const [touch1, touch2] = touches;
            return Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        };

        const handleTouchStart = (e) => {
            if (mode === "zoom" && e.touches.length === 2) {
                // 확대/축소 동작 시작
                const distance = getTouchDistance(e.touches);
                setDragging(false); // 드래그 초기화
                setStartPos({ x: 0, y: 0 });
                setTouchStartDistance(distance);
            } else if (mode === "zoom" && e.touches.length === 1) {
                // 드래그 동작 시작
                setDragging(true);
                setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            }
        };

        const handleTouchMove = (e) => {
            if (mode === "zoom" && e.touches.length === 2 && touchStartDistance) {
                // 확대/축소 계산
                const currentDistance = getTouchDistance(e.touches);
                const scaleChange = currentDistance / touchStartDistance;
                setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3)); // 확대/축소 제한
                setTouchStartDistance(currentDistance); // 거리 갱신
            } else if (mode === "zoom" && dragging && e.touches.length === 1) {
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

        const handleTouchEnd = () => {
            if (mode === "zoom") {
                setDragging(false); // 드래그 종료
            }
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
            <div style={{ fontWeight: "bold" }}> [조건 3] 터치 모드 / 비터치 모드 구분 </div>

            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> {`Task1 ${targetStore.id[0]}구역에서 ${targetStore.name}를 찾아주세요`} </div>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
            </InfoContainer>

            <Nav>
            <Button onClick={startTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
            </Button>

            <ModeContainer>
                <ModeButton 
                    isActive={mode === "touch"} onClick={() => setMode("touch")}>터치 모드
                </ModeButton>
                <ModeButton 
                    isActive={mode === "drag"}onClick={() => setMode("drag")}>확대 모드
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
                    >{store.name}</MA>))}
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
                        }} disabled={mode !== "touch"}>{store.name}</MB>))}</M3Con>
                        <M3Con id="3" style={{
                        borderTop: "solid 10px #CFBFBA",
                    }}>{storeDataC.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                                width:store.width,
                                height:store.height,
                                transform: `rotate(${store.rotation}deg)`,
                                fontSize: store.size,
                                color: store.color,
                                backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{store.name}</MA>))}</M3Con>
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
                        }} disabled={mode !== "touch"}>{store.name}</MA>))}  </M2Con>
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
                        }} disabled={mode !== "touch"}>{store.name}</MA>))}</M4Con>
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
                        }} disabled={mode !== "touch"}>{store.name}</MA>))}</M4Con>
                    </M2Con>
                </M1ConD>
            </MapContainer>

        </Container>
    );
}
