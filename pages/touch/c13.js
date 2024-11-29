import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useTouchDrag } from "../../hooks/useTouchDrag";
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
import { MapCon, M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB } from "../../styles/mapStyle";

const ScaleInfo = ({ scale }) => {
    return (
        <div style={{ fontWeight: "bold", marginTop: "10px" }}>
            확대율: {scale.toFixed(2)}x
        </div>
    );
};

export default function Condition1() {
    const router = useRouter();
    const { id } = router.query;
    const { elapsedTime, isTimerRunning, startTimer, stopTimer } = useTimer();
    const { scale, position, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchDrag();

    const [clickCount, setClickCount] = useState(0);
    const MINIMUM_SCALE = 2; // 확대 배수를 조절할 수 있습니다

    const taskId = 1;
    const conditionId = 1;

    const targetStore = {
        name: "스타벅스",
        id: "A-1",
    };

    const scaleRef = useRef(scale); //새로 추가함

    useEffect(() => {              // 새로 추가함
        scaleRef.current = scale;
    }, [scale]);
    
    const handleStoreTouch = (e, storeId) => {
        e.preventDefault();  
        e.stopPropagation();
        
        // scale이 1.2배 이상일 때만 클릭 카운트 증가 및 정답 체크
        if (scale >= MINIMUM_SCALE) {
            setClickCount(prev => prev + 1);
            
            if (storeId === targetStore.id) {
                alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
                stopTimer(false);
                router.push("/");
            }
        }
    };
    return (
        <Container>
            <div style={{ fontWeight: "bold" }}> [조건 1] 자유로운 확대와 드래그</div>
            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>

            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> {`연습용 ${targetStore.id[0]}구역에서 ${targetStore.name}를 찾아주세요`} </div>
                <div id="info">탐색 매장 수: 1</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info">소요 시간: {elapsedTime}초</div>
                <ScaleInfo scale={scale} />
            </InfoContainer>
            <Button onClick={startTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
            </Button>
            <MapContainer 
                onTouchStart={(e) => handleTouchStart(e, "map-container")}
                onTouchMove={(e) => handleTouchMove(e, "map-container")}
                onTouchEnd={handleTouchEnd}
            >
                <MapCon
                    className="map-container"
                    style={{
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                        transformOrigin: "center",
                    }}
                >
                    <M1Con isColumn="column">
                        <M2Con id="3" style={{ borderRight: "solid 15px #CFBFBA" }}>
                            {storeDataA.map((store) => (
                                <MA
                                onTouchStart={(e) => e.stopPropagation()}
                                onTouchEnd={(e) => handleStoreTouch(e, store.id)}
                                key={store.id}
                                    style={{
                                        width: store.width,
                                        height: store.height,
                                        transform: `rotate(${store.rotation}deg)`,
                                        fontSize: store.size,
                                        color: store.color,
                                        backgroundColor: store.bg,
                                    }}
                                >
                                    {store.name}
                                </MA>
                            ))}
                        </M2Con>

                        <M2Con id="7"> 
                            <M3Con id="7" style={{ borderBottom: "solid 5px #CFBFBA" }}> 
                                {storeDataB.map((store) => (
                                    <MB
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onTouchEnd={(e) => handleStoreTouch(e, store.id)}
                                        key={store.id}
                                        style={{
                                            width: store.width,
                                            height: store.height,
                                            transform: `rotate(${store.rotation}deg)`,
                                            fontSize: store.size,
                                            color: store.color,
                                            backgroundColor: store.bg,
                                        }}
                                    >
                                        {store.name}
                                    </MB>
                                ))}
                            </M3Con>
                            <M3Con id="3" style={{ borderTop: "solid 10px #CFBFBA" }}>
                                {storeDataC.map((store) => (
                                    <MA
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onTouchEnd={(e) => handleStoreTouch(e, store.id)}                                        key={store.id}
                                        style={{
                                            width: store.width,
                                            height: store.height,
                                            transform: `rotate(${store.rotation}deg)`,
                                            fontSize: store.size,
                                            color: store.color,
                                            backgroundColor: store.bg,
                                        }}
                                    >
                                        {store.name}
                                    </MA>
                                ))}
                            </M3Con>
                        </M2Con>
                    </M1Con>

                    <M1ConD>
                        <M2Con id="5">
                            {storeDataD.map((store) => (
                                <MA
                                onTouchStart={(e) => e.stopPropagation()}
                                onTouchEnd={(e) => handleStoreTouch(e, store.id)}                                      key={store.id}
                                    style={{
                                        width: store.width,
                                        height: store.height,
                                        transform: `rotate(${store.rotation}deg)`,
                                        fontSize: store.size,
                                        color: store.color,
                                        backgroundColor: store.bg,
                                    }}
                                >
                                    {store.name}
                                </MA>
                            ))}
                        </M2Con>
                        <M2Con id="5"> 
                            <M4Con id="4" style={{
                                transform: `rotate(0deg)`,
                                borderTop: "solid 10px #CFBFBA",
                                borderRight: "solid 10px #CFBFBA",
                            }}>
                                {storeDataE.map((store) => (
                                    <MA
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onTouchEnd={(e) => handleStoreTouch(e, store.id)}                                           key={store.id}
                                        style={{
                                            width: store.width,
                                            height: store.height,
                                            transform: `rotate(${store.rotation}deg)`,
                                            fontSize: store.size,
                                            color: store.color,
                                            backgroundColor: store.bg,
                                        }}
                                    >
                                        {store.name}
                                    </MA>
                                ))}
                            </M4Con>
                            <M4Con id="6" isColumn="column" style={{
                                borderTop: "solid 10px #CFBFBA",
                                borderLeft: "solid 10px #CFBFBA",
                                transform: `rotate(-20deg)`,
                            }}>
                                {storeDataF.map((store) => (
                                    <MA
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onTouchEnd={(e) => handleStoreTouch(e, store.id)}                                         key={store.id}
                                        style={{
                                            width: store.width,
                                            height: store.height,
                                            transform: `rotate(${store.rotation}deg)`,
                                            fontSize: store.size,
                                            color: store.color,
                                            backgroundColor: store.bg,
                                        }}
                                    >
                                        {store.name}
                                    </MA>
                                ))}
                            </M4Con>
                        </M2Con>
                    </M1ConD>
                </MapCon>
            </MapContainer>
        </Container>
    );
}