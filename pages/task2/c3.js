import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useTimerModal } from "@/hooks/useModal";
import TimerModal from "@/components/TimeModal";
import { useTouchMode } from "@/hooks/useTouchMode";
import { ScaleInfo } from "@/components/ScaleInfo";
import { useInfoScale } from "../../hooks/useInfoScale"; 
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
    Nav,  M1Con, M1ConD, M2Con, M3Con, M4Con, MA, MB, MapCon
} from "../../styles/c3Style.js";

export default function Condition3() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [mode, setMode] = useState("touch"); // 모드 상태 (기본은 "zoom")
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const { elapsedTime, isTimerRunning, startTimer, stopTimer } = useTimer();
    const { isModalVisible, startTimer: handleStartTimer } = useTimerModal(startTimer); // 타이머 시작
    const { scale, position, handleTouchStart, handleTouchMove, handleTouchEnd} = useTouchMode(mode);
    const MINIMUM_SCALE = 1.5;
    const { scaleI, updateScale } = useInfoScale(1); 

    
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // 현재 탐색 중인 매장 인덱스

    
    const taskId = 2;
    const conditionId = 3;
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
        if (scale >= MINIMUM_SCALE) {
            setClickCount((prev) => prev + 1);

        if (mode === "touch" & storeId === targetStores[currentTargetIndex].id) {
            if (mode === "touch" & currentTargetIndex === targetStores.length - 1) {
            alert( `정답입니다!\n모든 매장을 찾았습니다!\n총 클릭 횟수: 
                ${clickCount + 1}\n소요 시간: ${elapsedTime}초`);
            stopTimer(); // 타이머 중단
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
            router.push("/task3/c1"); 
        } else {
            // 다음 매장으로 진행
            alert(
                `정답입니다! 다음 매장: ${targetStores[currentTargetIndex + 1].id[0]}구역에 ${targetStores[currentTargetIndex + 1].name}를 찾아주세요!`
            );
            setCurrentTargetIndex((prevIndex) => prevIndex + 1);
        }
    }}}
    // 순서에 맞지 않는 매장은 무시


    return (
        <Container>
            <TimerModal isVisible={isModalVisible} onStart={handleStartTimer} />


            <Btn id='home' onClick={() => router.push('/')}> 홈 </Btn>
            <div style={{ fontWeight: "bold" }}> [조건 3] 터치 모드 / 비터치 모드 구분 </div>

            
            <InfoContainer>
                <div id="info" style={{ fontWeight: "bold" }}> 
                Task2: {`${targetStores[currentTargetIndex].id[0]}구역에서 ${targetStores[currentTargetIndex].name}를 찾아주세요`}
                </div>
                <div id="info">탐색 매장 수: 2</div>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
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
                        borderRight: "solid 15px gray ",
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
