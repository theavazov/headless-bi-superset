import styles from './index.module.css'

type componentProps = {
    title: string;
    description: string;
}

export const ChartCardHeader = ({ props }: { props: componentProps }) => {
    return (
        <div>
            <div className={styles.ttl}>{props.title}</div>
            <div className={styles.sub} id="txn-sub">{props.description}</div>
        </div>
    );
};