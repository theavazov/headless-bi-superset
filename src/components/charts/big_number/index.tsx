import type { IBigNumber } from '../../../types/charts';
import styles from './index.module.css'

export const BigNumber = ({ props }: { props: IBigNumber }) => {
    const handleClick = () => {
        if (props.modal) {
            props.setModal?.(props.modal);
        }
    };

    return (
        <button
            className={`d-card ${styles.gt}`}
            onClick={handleClick}
        >
            <div className={styles.gt_ico}>{props.icon}</div>
            <span className={styles.gt_txt}>
                <span className={styles.gt_v}>{props.value}<small>{props.unit}</small></span>
                <span className={styles.gt_l}>{props.label}</span>
                <span className={styles.gt_d}>{props.description}</span>
            </span>
        </button>
    );
};