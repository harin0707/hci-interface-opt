import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 90%;
`;

const TimerModal = ({ isVisible, onStart }) => {
    if (!isVisible) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>실험을 시작하시겠습니까?</h2>
                <button onClick={onStart}>실험 시작</button>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TimerModal;
