import {
    useEffect,
    type ReactNode,
    type MouseEvent,
} from "react";
import styles from "./modal.module.css";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({
    open,
    onClose,
    children,
}: ModalProps) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const handleBackdropClick = (
        event: MouseEvent<HTMLDivElement>
    ) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={styles.modal_overlay}
            onMouseDown={handleBackdropClick}
        >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
            >
                <button
                    type="button"
                    className={styles.modal__close}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                <div className={styles.modal__content}>
                    {children}
                </div>
            </div>
        </div>
    );
}