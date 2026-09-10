import styles from "./index.module.css"

export const KPICard = ({
    a,
    b,
    c,
    trendColor,
}: {
    a: string | undefined;
    b: string | undefined;
    c?: string;
    trendColor?: string;
}) => {
    return (
        <div className={styles.mk}>
            <div className={styles.a}>{a}</div>
            <div className={styles.b}>{b}</div>
            <div className={styles.c} style={{ color: trendColor }}>{c}</div>
        </div>
    );
};