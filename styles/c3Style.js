
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
`;

export const ModeContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    z-index: 100;
`;

export const ModeButton = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: ${({ isActive }) => (isActive ? "#ccc": "black")};
    color: white;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${({ isActive }) => (isActive ? "#005bb5" : "#bbb")};
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
    cursor: pointer;
    margin-bottom: 20px;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export const MapContainer = styled.div`
padding: 1px;
display: flex;
width: 80vw;
height: 70vh;

transform-origin: center;
pointer-events: auto;
`

export const Btn = styled.button`
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: black;
        color: white;
        border: none;
        padding: 5px;
        border-radius: 5px;
`

export const Nav = styled.div`
    display: flex;
    gap: 20px;
`
