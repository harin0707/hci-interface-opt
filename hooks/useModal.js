import { useState } from "react";

export const useTimerModal = (startTimerCallback) => {
    const [isModalVisible, setIsModalVisible] = useState(true); // 모달 표시 상태

    const startTimer = () => {
        setIsModalVisible(false); // 모달 숨김
        if (startTimerCallback) {
            startTimerCallback(); // 타이머 시작 콜백 실행
        }
    };

    return {
        isModalVisible,
        startTimer,
    };
};
