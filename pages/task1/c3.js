import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import TimerModal from "@/components/TimeModal";
import { useTimerModal } from "@/hooks/useModal";
import { useTouchMode } from "@/hooks/useTouchMode";
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
import { MapCon } from "@/styles/mapStyle";


export default function Condition3() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);
    const [mode, setMode] = useState("touch"); // 모드 상태 (기본은 "zoom")

    const { elapsedTime, isTimerRunning, startTimer, stopTimer } = useTimer();
    const { isModalVisible, startTimer: handleStartTimer } = useTimerModal(startTimer); // 타이머 시작
    const { scale, position, handleTouchStart, handleTouchMove, handleTouchEnd} = useTouchMode(mode);
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    
    
    const taskId = 1;
    const conditionId = 3;
      // 전역적으로 관리할 매장 정보를 선언
    const targetStore = {
        name: "커피빈", // 찾아야 하는 매장 이름
        id: "A-8", // 찾아야 하는 매장 ID
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


    return (
        <Container>
            <TimerModal isVisible={isModalVisible} onStart={handleStartTimer} />

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
