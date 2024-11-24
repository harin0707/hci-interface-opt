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

export default function Condition1() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태
    const taskId = 1;
    const conditionId = 1;

    // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData =
        tasks
            ?.find((task) => task.taskId === taskId)
            ?.conditions.find((condition) => condition.conditionId === conditionId) || {
            totalClicks: 0,
            timeSpent: 0,
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
        if (storeId === "A-1") {
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
            router.push("/task1/c2"); // /task1/c2로 라우팅
        }
    };

    



    return (
        <Container>
            <div> [조건 1] 자유로운 확대와 드래그 - Task Num: 1</div>
            <InfoContainer>
                <div id="info">실험자: {experimentId || "정보 없음"}</div>
                <div id="info">총 클릭 횟수: {clickCount}</div>
                <div id="info"> 소요 시간: {elapsedTime}초</div>
            </InfoContainer>
            <Button onClick={handleStartTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "실험 진행 중..." : "실험 시작"}
            </Button>
            <MapContainer>
                <M1Con isColumn="column"> 
                    <M2Con id="3"> 
                    {storeDataA.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                    }}>{store.name}</MA>))}
                    </M2Con>

                    <M2Con id="7"> 
                        <M3Con id="7"> 
                        {storeDataB.map((store) => (<MB onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        }}>{store.name}</MB>))}
                        </M3Con>
                        <M3Con id="3">
                        {storeDataC.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        }}>{store.name}</MA>))}
                        </M3Con>
                    </M2Con>
                </M1Con>

                <M1ConD>
                    <M2Con id="5"  >
                    {storeDataD.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        }}>{store.name}</MA>))}
                    </M2Con>
                    <M2Con id="5" > 
                        <M4Con id="4"> {storeDataE.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
                        }}>{store.name}</MA>))}</M4Con>
                        <M4Con id="6" isColumn="column">
                        {storeDataF.map((store) => (<MA onClick={() => handleStoreClick(store.id)} key={store.id} style={{
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
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;


`;

const M3Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    padding: 50px 0 ;
`;


const M4Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; /* ID를 기반으로 flex-grow 설정 */
    border: 1px solid black;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 50px 5px;

`;


const MA = styled.div`
    background-color: lightgreen;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.5rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;
`;

const MB = styled.div`
    background-color: lightgreen;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.5rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;
    height: 50px;
`;



