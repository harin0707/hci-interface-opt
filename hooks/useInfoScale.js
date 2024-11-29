import { useState, useEffect } from "react";

export const useInfoScale = (initialScale = 1) => {
    const [scale, setScale] = useState(initialScale);

    // 확대율을 업데이트하는 함수
    const updateScale = (newScale) => {
        setScale(newScale);
    };

    return { scale, updateScale };
};
