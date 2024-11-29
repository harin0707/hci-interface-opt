import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useTouchMode } from "@/hooks/useTouchMode";
import { useInfoScale } from "../../hooks/useInfoScale"; 
import { ScaleInfo } from "@/components/ScaleInfo";
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
    Nav, M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB , MapCon
} from "../../styles/c3Style.js";

export default function Condition3() {
    const router = useRouter();
    const { id } = router.query;
    const [mode, setMode] = useState("touch"); // 모드 상태 (기본은 "zoom")
    const { elapsedTime, isTimerRunning, startTimer, stopTimer } = useTimer();
    const { scale, position, handleTouchStart, handleTouchMove, handleTouchEnd} = useTouchMode(mode);

    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    
    const taskId = 1;
    const conditionId = 3;
    const targetStore = {
        name: "스타벅스", // 찾아야 하는 매장 이름
        id: "A-1", // 찾아야 하는 매장 ID
    };

    const MINIMUM_SCALE = 1.5;
    const { scaleI, updateScale } = useInfoScale(1); 


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


    // 맞게 클릭했을 때 동작
    const handleStoreClick = (storeId) => {
        if (scale >= MINIMUM_SCALE) {
            setClickCount((prev) => prev + 1);
        if (mode === "touch" & storeId === targetStore.id) {
            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            stopTimer(); // 타이머 중단
            router.push("/"); 
        }}
    };




    return (
        <Container >

            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
            <div style={{ fontWeight: "bold" }}> [조건 3] 터치 모드 / 비터치 모드 구분 </div>

            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> {`연습용 ${targetStore.id[0]}구역에서 ${targetStore.name}를 찾아주세요`} </div>
                <div id="info">탐색 매장 수: 1</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
                <ScaleInfo scale={scale} />
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
            onTouchStart={(e) => handleTouchStart(e, "map-container")}
            onTouchMove={(e) => handleTouchMove(e, "map-container")}
            onTouchEnd={handleTouchEnd}
            style={{
                touchAction: "none",

            }}
            
            >
                <MapCon
                className="map-container"
                style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: "center",
                    touchAction: "manipulation",
                }}
                >
                <M1Con isColumn="column"> 
                    <M2Con id="3" style={{
                        borderRight: "solid 15px gray",
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
                        borderBottom: "solid 5px gray",
                    }} >{storeDataB.map((store) => (<MB onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{store.name}</MB>))}</M3Con>
                        <M3Con id="3" style={{
                        borderTop: "solid 10px gray",
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
                            borderTop: "solid 10px gray",
                            borderRight: "solid 10px gray",
                        }} >{storeDataE.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                            width:store.width,
                            height:store.height,
                            transform: `rotate(${store.rotation}deg)`,
                            fontSize: store.size,
                            color: store.color,
                            backgroundColor: store.bg,
                        }} disabled={mode !== "touch"}>{store.name}</MA>))}</M4Con>
                        <M4Con id="6" isColumn="column" style={{
                        borderTop: "solid 10px gray",
                        borderLeft: "solid 10px gray",
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
                </MapCon>
            </MapContainer>

        </Container>
    );
}
