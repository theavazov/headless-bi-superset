import styles from './index.module.css'

type componentProps = {
    title: string;
    description: string;
    top_left: string;
    top_right?: string;
}

export const ChartCardHeader = ({ props }: { props: componentProps }) => {
    return (
        <div>
            <div className={styles.header_top}>
                <p className={styles.header_top__left}>{props.top_left}</p>
                {props.top_right && <p className={styles.header_top__right}>{props.top_right}</p>}
            </div>
            <div className={styles.ttl}>{props.title}</div>
            <div className={styles.sub} id="txn-sub">{props.description}</div>
        </div>
    );
};