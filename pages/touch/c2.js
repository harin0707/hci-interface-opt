import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { storeDataA } from "../../data/storedataA.js";
import { storeDataB } from "../../data/storedataB.js";
import { storeDataC } from "../../data/storedataC.js";
import { storeDataD } from "../../data/storedataD.js";
import { storeDataE } from "../../data/storedataE.js";
import { storeDataF } from "../../data/storedataF.js";

export default function Condition2() {
    const router = useRouter();
    const { id } = router.query;

    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태
    const [lastInteractionTime, setLastInteractionTime] = useState(0);
    const [isInteractionEnabled, setIsInteractionEnabled] = useState(true);
    

    const [scale, setScale] = useState(1); // 확대/축소 배율
    const [isZooming, setIsZooming] = useState(false); // 확대/축소 버튼 사용 상태

    const [position, setPosition] = useState({ x: 0, y: 0 }); // 지도 이동 위치
    const [dragging, setDragging] = useState(false); // 드래그 상태
    const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // 드래그 시작 위치

    const [mode, setMode] = useState("drag"); 

    
    const INTERACTION_DELAY = 1000; // 1초
    const ZOOM_DELAY = 800;        // 0.8초
    const DRAG_DELAY = 500;

    const taskId = 1;
    const conditionId = 2;
    const targetStore = {
        name: "스타벅스", // 찾아야 하는 매장 이름
        id: "A-1", // 찾아야 하는 매장 ID
    };


    // 확대/축소 제한 핸들러 추가
    useEffect(() => {
        const preventPinchZoom = (e) => {
            if (e.touches.length > 1) {
                // 두 손가락 터치를 방지
                e.preventDefault();
            }
        };
        document.addEventListener("touchmove", preventPinchZoom, { passive: false });

        return () => {
            document.removeEventListener("touchmove", preventPinchZoom);
        };
    }, []);

    // 전역 클릭 이벤트 추가
    useEffect(() => {
        const handleGlobalClick = () => {
            if (isInteractionEnabled) {
                setClickCount(prev => prev + 1);
                setIsInteractionEnabled(false);
                setTimeout(() => setIsInteractionEnabled(true), INTERACTION_DELAY);
            }
        };
    
        document.addEventListener("click", handleGlobalClick);
        return () => document.removeEventListener("click", handleGlobalClick);
    }, [isInteractionEnabled]);

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

    // 타이머 시작 핸들러
    const handleStartTimer = () => {
        setIsTimerRunning(true); // 타이머 시작
        setElapsedTime(0); // 시간 초기화
    };


    // 맞게 클릭했을 때 동작
    const handleStoreClick = useCallback((storeId) => {
        if (!isInteractionEnabled) return;
    
        if (storeId === targetStore.id) {
            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            setIsTimerRunning(false);
            router.push("/");
        }
    
        setIsInteractionEnabled(false);
        setTimeout(() => setIsInteractionEnabled(true), INTERACTION_DELAY);
    }, [clickCount, elapsedTime, isInteractionEnabled, targetStore.id]); // router 추가

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


/*
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
}; */

const handleDragStart = useCallback((e) => {
    if (mode !== "drag" || !isInteractionEnabled) return;
    e.preventDefault();
    setDragging(true);
    setStartPos({
        x: e.clientX || e.touches?.[0]?.clientX,
        y: e.clientY || e.touches?.[0]?.clientY,
    });
    setIsInteractionEnabled(false);
    setTimeout(() => setIsInteractionEnabled(true), DRAG_DELAY);
}, [mode, isInteractionEnabled]);

const handleDragMove = ((e) => {
    if (!dragging || mode !== "drag" || !isInteractionEnabled) return;

    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const currentY = e.clientY || e.touches?.[0]?.clientY;

    const newX = position.x + (currentX - startPos.x);
    const newY = position.y + (currentY - startPos.y);

    setPosition({ x: newX, y: newY });
    setStartPos({ x: currentX, y: currentY });
    setIsInteractionEnabled(false);
    setTimeout(() => setIsInteractionEnabled(true), DRAG_DELAY);
}, [dragging, mode, isInteractionEnabled, position, startPos]);

// 드래그 끝 이벤트 핸들러
const handleDragEnd = () => {
    if (mode !== "drag") return;
    setDragging(false);
};



    /* // 확대 버튼 핸들러
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
    }; */

    const handleZoomIn = useCallback(() => {
        if (!isInteractionEnabled) return;
        setIsZooming(true);
        setScale((prevScale) => Math.min(prevScale + 0.2, 3));
        setIsInteractionEnabled(false);
        setTimeout(() => {
            setIsZooming(false);
            setIsInteractionEnabled(true);
        }, ZOOM_DELAY);
    }, [isInteractionEnabled]);
    
    const handleZoomOut = useCallback(() => {
        if (!isInteractionEnabled) return;
        setIsZooming(true);
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
        setIsInteractionEnabled(false);
        setTimeout(() => {
            setIsZooming(false);
            setIsInteractionEnabled(true);
        }, ZOOM_DELAY);
    }, [isInteractionEnabled]);

    return (
        <Container
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}>

            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
            <div style={{ fontWeight: "bold" }}> [조건 2] 확대/축소 버튼과 자유로운 드래그</div>
            
            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> {`연습용 ${targetStore.id[0]}구역에서 ${targetStore.name}를 찾아주세요`} </div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
            </InfoContainer>

            <Nav>
                <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                    {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
                </Button>
                <ZoomContainer>
                    <ZoomButton onClick={handleZoomIn}  disabled={isZooming}>+</ZoomButton>
                    <ZoomButton onClick={handleZoomOut} disabled={isZooming}>-</ZoomButton>
                </ZoomContainer>
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;

    cursor: grab;

    &:active {
        cursor: grabbing;
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


    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

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
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    display: flex;
    justify-content: center;
    align-items: center;

    flex-wrap: wrap;
    padding: 30px 0 ;
`;

const M4Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 40px

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

    padding: 1px;
    cursor: pointer;

    pointer-events: auto;
    z-index: 10;
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


const ZoomContainer = styled.div`
    display: flex;
    justify-content: baseline;
    z-index: 100;
    gap: 10px;
`;

const ZoomButton = styled.button`
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    

    &:hover {
        background-color: #005bb5;
    }
`;

const Nav = styled.div`
    display: flex;
    gap: 20px;
`

