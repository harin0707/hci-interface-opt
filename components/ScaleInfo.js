export const ScaleInfo = ({ scale }) => {
    return (
        <div style={{ fontWeight: "bold" }}>
            확대율: {scale.toFixed(2)}x
        </div>
    );
};