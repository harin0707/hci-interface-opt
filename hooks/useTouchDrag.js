import { useState } from "react";

export const useTouchDrag = () => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [touchStartDistance, setTouchStartDistance] = useState(null);

    const getTouchDistance = (touches) => {
        const [touch1, touch2] = touches;
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    const handleTouchStart = (e, containerClass) => {
        if (!e.target.closest(`.${containerClass}`)) {
            e.preventDefault();
            return;
        }

        if (e.touches.length === 2) {
            const distance = getTouchDistance(e.touches);
            setTouchStartDistance(distance);
        } else if (e.touches.length === 1) {
            setDragging(true);
            setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    };

    const handleTouchMove = (e, containerClass) => {
        if (!e.target.closest(`.${containerClass}`)) {
            e.preventDefault();
            return;
        }

        if (e.touches.length === 2 && touchStartDistance) {
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / touchStartDistance;
            setScale((prevScale) => Math.min(Math.max(prevScale * scaleChange, 0.5), 3));
            setTouchStartDistance(currentDistance);
        } else if (e.touches.length === 1 && dragging) {
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
