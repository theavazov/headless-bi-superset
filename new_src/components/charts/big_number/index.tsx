import type { IBigNumber } from '../../../types/charts';
import BigNumberLoader from '../../_loaders/big_number';
import styles from './index.module.css'

export const BigNumber = ({ props }: { props: IBigNumber }) => {
    return (
        <span className={`d-card ${styles.kpi}`}>
            {props.isLoading ? (
                <BigNumberLoader size="lg" />
            ) : (
                <>
                    <span className={styles.kpi_l}>{props.label}</span>
                    <span className={styles.kpi_v}>{props.value} <span className={styles.kpi_v__u}>{props.unit}</span></span>
                    <span className={styles.kpi_d}>
                        <span className={props.trend > 0 ? `${styles.u} ${styles.trend_up}` : `${styles.u} ${styles.trend_down}`}>
                            {props.trend > 0 ? '▲' : '▼'} {props.description}
                        </span>
                    </span>
                </>
            )}
        </span>
    );
};