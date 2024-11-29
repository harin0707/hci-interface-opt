import { useState } from "react";

export const useTouchMode = (mode) => {
    const [scale, setScale] = useState(1); // 확대/축소 배율
    const [position, setPosition] = useState({ x: 0, y: 0 }); // 드래그 위치
    const [dragging, setDragging] = useState(false); // 드래그 상태
    const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // 드래그 시작 위치
    const [touchStartDistance, setTouchStartDistance] = useState(null); // 두 손가락 거리

    // 두 손가락 간 거리 계산
    const getTouchDistance = (touches) => {
        const [touch1, touch2] = touches;
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    // 터치 시작 이벤트
    const handleTouchStart = (e, containerClass) => {
        const target = e.target.closest(`.${containerClass}`);
        if (!target) return;

        if (mode === "drag" && e.touches.length === 2) {
            // 확대/축소 시작
            const distance = getTouchDistance(e.touches);
            setTouchStartDistance(distance);
        } else if (mode === "drag" && e.touches.length === 1) {
            // 드래그 시작
            setDragging(true);
            setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    };

    // 터치 이동 이벤트
    const handleTouchMove = (e, containerClass) => {
        const target = e.target.closest(`.${containerClass}`);
        if (!target) return;

        if (mode === "drag" && e.touches.length === 2 && touchStartDistance) {
            // 확대/축소 동작
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / touchStartDistance;
            setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3)); // 확대 배율 제한
            setTouchStartDistance(currentDistance);
        } else if (mode === "drag" && e.touches.length === 1 && dragging) {
            // 드래그 동작
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startPos.x;
            const deltaY = currentY - startPos.y;

            setPosition((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
            }));
            setStartPos({ x: currentX, y: currentY });
        }
    };

    // 터치 종료 이벤트
    const handleTouchEnd = () => {
        setDragging(false);
        setTouchStartDistance(null);
    };

    return {
        scale,
        position,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
