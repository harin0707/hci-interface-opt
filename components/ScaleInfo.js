export const ScaleInfo = ({ scale }) => {
    return (
        <div
            style={{
                fontWeight: "bold",
                color: scale >= 1.5 ? "red" : "black", // 조건부 스타일링
            }}
        >
            확대율: {scale.toFixed(2)}x
        </div>
    );
};
