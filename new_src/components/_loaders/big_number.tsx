import styles from "./index.module.css"

type ComponentProps = {
    size: 'md' | 'lg'
}

export default function BigNumberLoader(props: ComponentProps) {
    if (props.size === 'md') {
        return (
            <div className={styles.mk}>
                <div className={styles.a}></div>
                <div className={styles.b}></div>
            </div>
        )
    }

    else if (props.size === 'lg') {
        return (
            <div className={styles.gt_txt}>
                <div className={styles.gt_v}></div>
                <div className={styles.gt_l}></div>
                <div className={styles.gt_d}></div>
            </div>
        )
    }

    return null
}