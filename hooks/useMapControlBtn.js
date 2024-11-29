import { useState, useEffect } from "react";

export const useMapControlBtn = (isAdminMode) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [moveDirection, setMoveDirection] = useState(null);
    const [touchStartDistance, setTouchStartDistance] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setIsZooming(true);
        setScale((prev) => Math.min(prev + 0.2, 3));
        setTimeout(() => setIsZooming(false), 300);
    };

    const handleZoomOut = () => {
        setIsZooming(true);
        setScale((prev) => Math.max(prev - 0.2, 0.5));
        setTimeout(() => setIsZooming(false), 300);
    };

    const handleMoveStart = (direction) => {
        setMoveDirection(direction);
        setIsMoving(true);
    };

    const handleMoveStop = () => {
        setIsMoving(false);
        setMoveDirection(null);
    };

    const getTouchDistance = (touches) => {
        const [touch1, touch2] = touches;
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    const handleTouchStart = (e) => {
        if (!isAdminMode) return;

        if (e.touches.length === 2) {
            const distance = getTouchDistance(e.touches);
            setTouchStartDistance(distance);
        } else if (e.touches.length === 1) {
            setDragging(true);
            setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    };

    const handleTouchMove = (e) => {
        if (!isAdminMode) return;

        if (e.touches.length === 2 && touchStartDistance) {
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / touchStartDistance;
            setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3));
            setTouchStartDistance(currentDistance);
        } else if (dragging && e.touches.length === 1) {
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
        if (!isAdminMode) return;
        setDragging(false);
    };

    useEffect(() => {
        if (!isMoving || !moveDirection) return;

        const moveMap = () => {
            setPosition((prev) => {
                const moveDistance = 5;
                switch (moveDirection) {
                    case "up":
                        return { ...prev, y: prev.y - moveDistance };
                    case "down":
                        return { ...prev, y: prev.y + moveDistance };
                    case "left":
                        return { ...prev, x: prev.x - moveDistance };
                    case "right":
                        return { ...prev, x: prev.x + moveDistance };
                    default:
                        return prev;
                }
            });
        };

        const interval = setInterval(moveMap, 50);
        return () => clearInterval(interval);
    }, [isMoving, moveDirection]);

    return {
        scale,
        position,
        isZooming,
        handleZoomIn,
        handleZoomOut,
        handleMoveStart,
        handleMoveStop,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
