import styles from "../../styles/MapSection.module.css";


export default function MapSection({ section, onStoreClick }) {
    const sectionClass = `${styles.storeContainer} ${styles[`section${section.section}`]}`;

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.section} 구역</h2>
            <div className={sectionClass}>
                {section.stores.map((store) => (
                    <div
                        key={store.id}
                        className={styles.storeCard}
                        onClick={() => onStoreClick(store.id)} // 클릭 이벤트 전달
                    >
                        <h3>{store.name}</h3>
                        <p>{store.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
