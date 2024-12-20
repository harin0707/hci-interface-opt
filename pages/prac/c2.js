import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useMapControlBtn } from "../../hooks/useMapControlBtn.js";
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
import { MapCon, M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB } from "../../styles/mapStyle";



export default function Condition2() {
    const router = useRouter();
    const { id } = router.query;
    const { elapsedTime, isTimerRunning, startTimer, stopTimer } = useTimer();
    const [isAdminMode, setIsAdminMode] = useState(false); // 운영자 모드 상태 추가
    const {
        scale,
        position,
        isZooming,
        handleZoomIn,
        handleZoomOut,
        handleMove,
    } = useMapControlBtn(isAdminMode);

    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const MINIMUM_SCALE = 1.5;
    const { scaleI, updateScale } = useInfoScale(1); 

    
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

    
    const taskId = 1;
    const conditionId = 2;
    const targetStore = {
        name: "스타벅스", // 찾아야 하는 매장 이름
        id: "A-1", // 찾아야 하는 매장 ID
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


    // 맞게 클릭했을 때 동작
    const handleStoreClick = (storeId) => {
        if (scale >= MINIMUM_SCALE) {
            setClickCount((prev) => prev + 1);
        if (storeId === targetStore.id) {
            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            stopTimer(); // 타이머 중단
            router.push("/");
        }}
    };




    return (
        <Container>

            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
            <div style={{ fontWeight: "bold" }}> [조건 2] 확대/축소, 드래그 버튼 구현</div>
            
            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> {`연습용 ${targetStore.id[0]}구역에서 ${targetStore.name}를 찾아주세요`} </div>
                <div id="info">탐색 매장 수: 1</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
                <ScaleInfo scale={scale} />
                <div id="info" style={{ fontWeight: "bold" }}> 운영자 모드  </div>
                <AdminToggleButton onClick={toggleAdminMode}>
                    {isAdminMode ? "활성화" : "비활성화"}
                </AdminToggleButton>
            </InfoContainer>

            <Nav>
                <Button onClick={startTimer} disabled={isTimerRunning}>
                    {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
                </Button>
                <ZoomContainer>
                    <ZoomButton onClick={handleZoomIn}  disabled={isZooming}>+</ZoomButton>
                    <ZoomButton onClick={handleZoomOut} disabled={isZooming}>-</ZoomButton>
                </ZoomContainer>
                <ArrorContainer>
                    <ArrowButton onClick={() => handleMove("up")}>↑</ArrowButton>
                    <div>
                    <ArrowButton onClick={() => handleMove("left")}>←</ArrowButton>
                    <ArrowButton onClick={() => handleMove("right")}>→</ArrowButton>
                    </div>
                    <ArrowButton onClick={() => handleMove("down")}>↓</ArrowButton>
                </ArrorContainer>
            </Nav>
            
            

            
            
            <MapContainer >

            <MapCon
            style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            }}>
                <M1Con isColumn="column"> 
                    <M2Con id="3" style={{
                        borderRight: "solid 15px gray",
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
                        borderBottom: "solid 5px gray",
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
                        borderTop: "solid 10px gray",}}> 
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
                            borderTop: "solid 10px gray",
                            borderRight: "solid 10px gray",
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
                        borderTop: "solid 10px gray",
                        borderLeft: "solid 10px gray",
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
                </MapCon>
            </MapContainer>
        </Container>
    );
}


