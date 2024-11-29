import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
`;

export const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;

    #info {
        margin: 15px;
    }
`;

export const Button = styled.button`
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    height: 30px;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export const Btn = styled.button`
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: black;
    color: white;
    border: none;
    padding: 5px;
    border-radius: 5px;
`;

export const MapContainer = styled.div`
    padding: 1px;
    display: flex;
    width: 80vw;
    height: 70vh;
    transform-origin: center;
    pointer-events: auto;
    touch-action: manipulation;

    background-color: #FFD2B2;
    overflow: hidden;
    border: 2px solid #333;
`;

export const ZoomContainer = styled.div`
    display: flex;
    justify-content: baseline;
    z-index: 100;
    gap: 10px;
`;

export const ZoomButton = styled.button`
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #005bb5;
    }
`;

export const Nav = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

export const ArrorContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-direction: column;
    z-index: 100;
    gap: 0;
    width: 100px;
    justify-content: center;
    align-items: center;
`;

export const ArrowButton = styled.button`
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 50px;

    &:hover {
        background-color: #005bb5;
    }

    &:active {
        background-color: #003f7f;
    }
`;

export const AdminToggleButton = styled.button`
    padding: 10px 20px;
    background-color: ${({ isActive }) => (isActive ? "green" : "black")};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;
