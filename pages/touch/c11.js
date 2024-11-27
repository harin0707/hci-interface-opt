import { useRouter } from "next/router";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { experimentIdState, taskState } from "../../atoms/atoms.js";
import { storeDataA } from "../../data/storedataA.js";
import { storeDataB } from "../../data/storedataB.js";
import { storeDataC } from "../../data/storedataC.js";
import { storeDataD } from "../../data/storedataD.js";
import { storeDataE } from "../../data/storedataE.js";
import { storeDataF } from "../../data/storedataF.js";
import { useEffect, useState, useCallback,useRef } from "react";

export default function Condition1() {
    const router = useRouter();
    const { id } = router.query;

    const experimentId = useRecoilValue(experimentIdState);
    const [tasks, setTasks] = useRecoilState(taskState);

    const [elapsedTime, setElapsedTime] = useState(0); // 소요 시간 상태
    const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 상태

    const [touchDelay, setTouchDelay] = useState(false);

    const taskId = 1;
    const conditionId = 1;
    const [lastInteractionTime, setLastInteractionTime] = useState(0);
    const [isInteractionEnabled, setIsInteractionEnabled] = useState(true);

    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const mapRef = useRef(null);
    const [startTime, setStartTime] = useState(null);
    const INTERACTION_DELAY = 2000; // 2초
    const STORE_CLICK_DELAY = 2000; // 2
    const [isProcessingClick, setIsProcessingClick] = useState(false); // 새로 추가


    // 전역적으로 관리할 매장 정보를 선언
    const targetStore = {
        name: "스타벅스", // 찾아야 하는 매장 이름
        id: "A-1", // 찾아야 하는 매장 ID
    };
    
    // taskId가 1이고 conditionId가 1인 데이터 필터링
    const conditionData =
        tasks
            ?.find((task) => task.taskId === taskId)
            ?.conditions.find((condition) => condition.conditionId === conditionId) || {
            totalClicks: 0,
            timeSpent: 0,
        };

    // 전역 클릭 이벤트 추가
    const throttledClick = useCallback(() => {
        const now = Date.now();
        if (now - lastInteractionTime >= INTERACTION_DELAY && !isProcessingClick) {
            setClickCount((prev) => prev + 1);
            setLastInteractionTime(now);
            
            // 시각적 피드백을 위한 상태 설정
            setIsProcessingClick(true);
            setTimeout(() => {
                setIsProcessingClick(false);
            }, INTERACTION_DELAY);
        }
    }, [lastInteractionTime, isProcessingClick]);

    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        const startX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const startY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        setDragPosition({ x: startX, y: startY });
    }, []);

    // 터치 이벤트 핸들러 추가
    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        // 터치 시작 시 클릭 카운트 증가 방지
        e.stopPropagation();
        setTouchDelay(true);
        
        setTimeout(() => {
            const touch = e.touches[0];
            setIsDragging(true);
            setDragPosition({
                x: touch.clientX,
                y: touch.clientY
            });
            setTouchDelay(false);
        }, 300);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || touchDelay || !mapRef.current) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        
        // 이중 지연 효과 적용
        requestAnimationFrame(() => {
            setTimeout(() => {
                // 이동 속도를 0.15에서 0.1로 더 감소
                const deltaX = (touch.clientX - dragPosition.x) * 0.1;
                const deltaY = (touch.clientY - dragPosition.y) * 0.1;
                
                // 추가 지연 적용
                setTimeout(() => {
                    mapRef.current.scrollTo({
                        left: mapRef.current.scrollLeft - deltaX,
                        top: mapRef.current.scrollTop - deltaY,
                        behavior: 'smooth'
                    });
                    
                    setDragPosition({
                        x: touch.clientX,
                        y: touch.clientY
                    });
                }, 100);
            }, 300); // 200ms에서 300ms로 증가
        });
    }, [isDragging, dragPosition, touchDelay]);
    

    const handleDrag = useCallback((e) => {
        if (!isDragging || !mapRef.current) return;
        
        e.preventDefault(); // 기본 드래그 동작 방지
        
        const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const currentY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        
        // 드래그 지연 효과 구현
        requestAnimationFrame(() => {
            setTimeout(() => {
                const deltaX = (currentX - dragPosition.x) * 0.2; // 이동 속도 감소
                const deltaY = (currentY - dragPosition.y) * 0.2;
                
                if (mapRef.current) {
                    mapRef.current.scrollTo({
                        left: mapRef.current.scrollLeft - deltaX,
                        top: mapRef.current.scrollTop - deltaY,
                        behavior: 'smooth'
                    });
                }
                
                setDragPosition({ x: currentX, y: currentY });
            }, 150); // 지연 시간 조정
        });
    }, [isDragging, dragPosition]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);
    
    const handleGlobalClick = useCallback((e) => {
        if (isInteractionEnabled) {
            throttledClick();
            setIsInteractionEnabled(false);
            setTimeout(() => {
                setIsInteractionEnabled(true);
            }, INTERACTION_DELAY);
        }
    }, [isInteractionEnabled, throttledClick]);
    
    useEffect(() => {
        const mapElement = mapRef.current;
        if (!mapElement) return;
    
        // 터치 이벤트 리스너
        mapElement.addEventListener('touchstart', handleTouchStart, { passive: false });
        mapElement.addEventListener('touchmove', handleTouchMove, { passive: false });
        mapElement.addEventListener('touchend', handleDragEnd);
        
        // 마우스 이벤트 리스너
        mapElement.addEventListener('mousedown', handleDragStart);
        mapElement.addEventListener('mousemove', handleDrag);
        mapElement.addEventListener('mouseup', handleDragEnd);
    
        return () => {
            mapElement.removeEventListener('touchstart', handleTouchStart);
            mapElement.removeEventListener('touchmove', handleTouchMove);
            mapElement.removeEventListener('touchend', handleDragEnd);
            mapElement.removeEventListener('mousedown', handleDragStart);
            mapElement.removeEventListener('mousemove', handleDrag);
            mapElement.removeEventListener('mouseup', handleDragEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleDragEnd, handleDragStart, handleDrag]);

    // 타이머 시작 및 중단 관리
    useEffect(() => {
        let timer;
        if (isTimerRunning && startTime) {
            timer = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        }
    
        return () => clearInterval(timer);
    }, [isTimerRunning, startTime]);
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
    const handleStartTimer = useCallback(() => {
        setStartTime(Date.now()); // 시작 시간 저장
        setIsTimerRunning(true);
        setElapsedTime(0);
        setLastInteractionTime(Date.now());
        setIsInteractionEnabled(true);
    }, []);


    // 맞게 클릭했을 때 동작
    const handleStoreClick = useCallback((storeId, e) => {
        // 이벤트 전파 중지
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    
        // 클릭 카운트 증가
        setClickCount(prev => prev + 1);
    
        // 실험 시작 전의 클릭인 경우
        if (!isTimerRunning) {
            if (storeId === targetStore.id) {
                alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                router.push("/task1/c2");
            }
            return;
        }
    
        // 실험 중인 경우의 처리
        if (!isInteractionEnabled || isProcessingClick || !startTime) return;
    
        setIsProcessingClick(true);
        setIsInteractionEnabled(false);
        
        setTimeout(() => {
            if (storeId === targetStore.id) {
                const endTime = Date.now();
                const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                
                alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                setIsTimerRunning(false);
                
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
                                            timeSpent: actualElapsedSeconds,
                                            correctClick: true,
                                        }
                                        : condition
                                ),
                            }
                            : task
                    )
                );
                router.push("/task1/c2");
            }
    
            setIsProcessingClick(false);
            setIsInteractionEnabled(true);
        }, STORE_CLICK_DELAY);
    }, [clickCount, isInteractionEnabled, isProcessingClick, router, targetStore.id, setTasks, isTimerRunning, startTime]);

    return (
        <Container>
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
            <MapContainer>
                <M1Con isColumn="column"> 
                    <M2Con id="3"
                    style={{
                        borderRight: "solid 15px #CFBFBA",
                    }}>
                    {storeDataA.map((store) => (
    <MA 
        onClick={(e) => e.preventDefault()} 
        onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 2초 후에 클릭 카운트 증가
            setTimeout(() => {
                setClickCount(prev => prev + 1);
                
                // 정답 확인 등 나머지 로직
                if (store.id === targetStore.id) {
                    // 실험 시작 전의 클릭인 경우
                    if (!isTimerRunning) {
                        alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                        router.push("/task1/c2");
                        return;
                    }
                    
                    // 실험 중인 경우
                    const endTime = Date.now();
                    const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                    alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                    setIsTimerRunning(false);
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
                                                timeSpent: actualElapsedSeconds,
                                                correctClick: true,
                                            }
                                            : condition
                                    ),
                                }
                                : task
                        )
                    );
                    router.push("/task1/c2");
                }
            }, 2000); // 2초 지연
        }}
        key={store.id} 
        style={{
            width: store.width,
            height: store.height,
            transform: `rotate(${store.rotation}deg)`,
            fontSize: store.size,
            color: store.color,
            backgroundColor: store.bg,
            transition: 'all 0.5s ease',
        }}
    >
        {store.name}
    </MA>
))}
                    </M2Con>

                    <M2Con id="7"> 
                        <M3Con id="7" style={{
                        borderBottom: "solid 5px #CFBFBA",
                    }}> 
                        {storeDataB.map((store) => (
    <MA 
        onClick={(e) => e.preventDefault()} 
        onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 2초 후에 클릭 카운트 증가
            setTimeout(() => {
                setClickCount(prev => prev + 1);
                
                // 정답 확인 등 나머지 로직
                if (store.id === targetStore.id) {
                    // 실험 시작 전의 클릭인 경우
                    if (!isTimerRunning) {
                        alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                        router.push("/task1/c2");
                        return;
                    }
                    
                    // 실험 중인 경우
                    const endTime = Date.now();
                    const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                    alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                    setIsTimerRunning(false);
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
                                                timeSpent: actualElapsedSeconds,
                                                correctClick: true,
                                            }
                                            : condition
                                    ),
                                }
                                : task
                        )
                    );
                    router.push("/task1/c2");
                }
            }, 2000); // 2초 지연
        }}
        key={store.id} 
        style={{
            width: store.width,
            height: store.height,
            transform: `rotate(${store.rotation}deg)`,
            fontSize: store.size,
            color: store.color,
            backgroundColor: store.bg,
            transition: 'all 0.5s ease',
        }}
    >
        {store.name}
    </MA>
))}
                        </M3Con>
                        <M3Con id="3" style={{
                        borderTop: "solid 10px #CFBFBA",
                    }}>
                        {storeDataC.map((store) => (
    <MA 
        onClick={(e) => e.preventDefault()} 
        onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 2초 후에 클릭 카운트 증가
            setTimeout(() => {
                setClickCount(prev => prev + 1);
                
                // 정답 확인 등 나머지 로직
                if (store.id === targetStore.id) {
                    // 실험 시작 전의 클릭인 경우
                    if (!isTimerRunning) {
                        alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                        router.push("/task1/c2");
                        return;
                    }
                    
                    // 실험 중인 경우
                    const endTime = Date.now();
                    const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                    alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                    setIsTimerRunning(false);
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
                                                timeSpent: actualElapsedSeconds,
                                                correctClick: true,
                                            }
                                            : condition
                                    ),
                                }
                                : task
                        )
                    );
                    router.push("/task1/c2");
                }
            }, 2000); // 2초 지연
        }}
        key={store.id} 
        style={{
            width: store.width,
            height: store.height,
            transform: `rotate(${store.rotation}deg)`,
            fontSize: store.size,
            color: store.color,
            backgroundColor: store.bg,
            transition: 'all 0.5s ease',
        }}
    >
        {store.name}
    </MA>
))}
                        </M3Con>
                    </M2Con>
                </M1Con>

                <M1ConD>
                    <M2Con id="5"  >
                    {storeDataD.map((store) => (
    <MA 
        onClick={(e) => e.preventDefault()} 
        onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 2초 후에 클릭 카운트 증가
            setTimeout(() => {
                setClickCount(prev => prev + 1);
                
                // 정답 확인 등 나머지 로직
                if (store.id === targetStore.id) {
                    // 실험 시작 전의 클릭인 경우
                    if (!isTimerRunning) {
                        alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                        router.push("/task1/c2");
                        return;
                    }
                    
                    // 실험 중인 경우
                    const endTime = Date.now();
                    const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                    alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                    setIsTimerRunning(false);
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
                                                timeSpent: actualElapsedSeconds,
                                                correctClick: true,
                                            }
                                            : condition
                                    ),
                                }
                                : task
                        )
                    );
                    router.push("/task1/c2");
                }
            }, 2000); // 2초 지연
        }}
        key={store.id} 
        style={{
            width: store.width,
            height: store.height,
            transform: `rotate(${store.rotation}deg)`,
            fontSize: store.size,
            color: store.color,
            backgroundColor: store.bg,
            transition: 'all 0.5s ease',
        }}
    >
        {store.name}
    </MA>
))}
                    </M2Con>
                    <M2Con id="5" > 
                        <M4Con id="4"
                        style={{
                            transform: `rotate 0deg)`,
                            borderTop: "solid 10px #CFBFBA",
                            borderRight: "solid 10px #CFBFBA",
                        }} 
                        
                        > {storeDataE.map((store) => (
                            <MA 
                                onClick={(e) => e.preventDefault()} 
                                onTouchStart={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    // 2초 후에 클릭 카운트 증가
                                    setTimeout(() => {
                                        setClickCount(prev => prev + 1);
                                        
                                        // 정답 확인 등 나머지 로직
                                        if (store.id === targetStore.id) {
                                            // 실험 시작 전의 클릭인 경우
                                            if (!isTimerRunning) {
                                                alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                                                router.push("/task1/c2");
                                                return;
                                            }
                                            
                                            // 실험 중인 경우
                                            const endTime = Date.now();
                                            const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                                            alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                                            setIsTimerRunning(false);
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
                                                                        timeSpent: actualElapsedSeconds,
                                                                        correctClick: true,
                                                                    }
                                                                    : condition
                                                            ),
                                                        }
                                                        : task
                                                )
                                            );
                                            router.push("/task1/c2");
                                        }
                                    }, 2000); // 2초 지연
                                }}
                                key={store.id} 
                                style={{
                                    width: store.width,
                                    height: store.height,
                                    transform: `rotate(${store.rotation}deg)`,
                                    fontSize: store.size,
                                    color: store.color,
                                    backgroundColor: store.bg,
                                    transition: 'all 0.5s ease',
                                }}
                            >
                                {store.name}
                            </MA>
                        ))}</M4Con>
                        <M4Con id="6" isColumn="column" style={{
                        borderTop: "solid 10px #CFBFBA",
                        borderLeft: "solid 10px #CFBFBA",
                        transform: `rotate(-20deg)`,
                        
                    }} >
                        {storeDataF.map((store) => (
    <MA 
        onClick={(e) => e.preventDefault()} 
        onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 2초 후에 클릭 카운트 증가
            setTimeout(() => {
                setClickCount(prev => prev + 1);
                
                // 정답 확인 등 나머지 로직
                if (store.id === targetStore.id) {
                    // 실험 시작 전의 클릭인 경우
                    if (!isTimerRunning) {
                        alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}`);
                        router.push("/task1/c2");
                        return;
                    }
                    
                    // 실험 중인 경우
                    const endTime = Date.now();
                    const actualElapsedSeconds = Math.floor((endTime - startTime) / 1000);
                    alert(`정답입니다!\n총 클릭 횟수: ${clickCount + 1}\n소요 시간: ${actualElapsedSeconds}초`);
                    setIsTimerRunning(false);
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
                                                timeSpent: actualElapsedSeconds,
                                                correctClick: true,
                                            }
                                            : condition
                                    ),
                                }
                                : task
                        )
                    );
                    router.push("/task1/c2");
                }
            }, 2000); // 2초 지연
        }}
        key={store.id} 
        style={{
            width: store.width,
            height: store.height,
            transform: `rotate(${store.rotation}deg)`,
            fontSize: store.size,
            color: store.color,
            backgroundColor: store.bg,
            transition: 'all 0.5s ease',
        }}
    >
        {store.name}
    </MA>
))}
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
    overflow: auto;
    cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'grab'};
    user-select: none;
    -webkit-user-select: none;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);

    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    
    @media (hover: none) and (pointer: coarse) {
        scroll-behavior: smooth;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
    }
`;

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
    flex-grow: ${({ id }) => id || 1}; 
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 30px 0 ;


`;


const M4Con = styled.div`
    flex-grow: ${({ id }) => id || 1}; 
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 40px;


`;


const MA = styled.div`
    background-color: #F5F5F5;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.3rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;
    z-index: 10;

    touch-action: manipulation;

`;

const MB = styled.div`
    background-color: #F5F5F5;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 0.3rem;
    margin: 1px;

    padding: 1px;
    cursor: pointer;

    z-index: 100;

    touch-action: manipulation;

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

const Nav = styled.div`
    display: flex;
    gap: 20px;
`




