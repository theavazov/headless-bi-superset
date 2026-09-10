import { supersetLogo } from "../../utils/icons"
import styles from "./index.module.css"

export default function SupersetLoader() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.icon}>{supersetLogo}</div>
            <p className={styles.text}>
                Waiting for superset
                <span className={styles.dots}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </span>
            </p>
        </div>
    )
}