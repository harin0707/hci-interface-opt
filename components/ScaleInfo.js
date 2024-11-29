export const ScaleInfo = ({ scale }) => {
    return (
        <div style={{ fontWeight: "bold", marginTop: "10px" }}>
            확대율: {scale.toFixed(2)}x
        </div>
    );
};