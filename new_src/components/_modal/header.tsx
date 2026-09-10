import styles from "./modal.module.css"

type ComponentProps = {
    title: string;
    description: string;
    icon: React.JSX.Element;
}

export const ModalHeader = (props: ComponentProps) => {
    return (
        <div className={styles.modal_header}>
            <span className={styles.modal_header_icon}>{props.icon}</span>
            <div className={styles.modal_header_titles}>
                <h3 className={styles.modal_header__title}>{props.title}</h3>
                <span className={styles.modal_header__description}>{props.description}</span>
            </div>
        </div>
    )
}