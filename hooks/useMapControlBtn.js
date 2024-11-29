import { useState, useEffect } from "react";

export const useMapControlBtn = (isAdminMode) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [moveDirection, setMoveDirection] = useState(null);

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

    const handleMove = (direction) => {
        const moveDistance = 50; // 한 번에 이동할 거리
        setPosition((prev) => {
            switch (direction) {
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
            setScale((prevScale) => Math.min(Math.max(prevScale * (distance / 100), 0.5), 3));
        }
    };

    const handleTouchMove = (e) => {
        if (!isAdminMode) return;
    };

    const handleTouchEnd = () => {
        if (!isAdminMode) return;
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
        handleMove,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
