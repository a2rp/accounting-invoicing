import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, message, note, confirmLabel = "Delete record", onCancel, onConfirm }) => {
    const cancelRef = useRef(null);

    useEffect(() => {
        cancelRef.current?.focus();
        const handleKey = (event) => {
            if (event.key === "Escape") onCancel();
            if (event.key === "Tab") {
                const dialog = event.currentTarget.querySelector("[role='alertdialog']");
                const controls = dialog?.querySelectorAll("button");
                if (!controls?.length) return;
                if (event.shiftKey && document.activeElement === controls[0]) {
                    event.preventDefault();
                    controls[controls.length - 1].focus();
                } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
                    event.preventDefault();
                    controls[0].focus();
                }
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onCancel]);

    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
            <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
                <div className={styles.heading}>
                    <span className={styles.alertIcon}><FiAlertTriangle aria-hidden="true" /></span>
                    <button className={styles.close} type="button" onClick={onCancel} aria-label="Close confirmation"><FiX aria-hidden="true" /></button>
                </div>
                <h2 id="confirm-title">{title}</h2>
                <p id="confirm-message">{message}</p>
                {note && <p className={styles.note}>{note}</p>}
                <div className={styles.actions}>
                    <button ref={cancelRef} className={styles.cancel} type="button" onClick={onCancel}>Keep record</button>
                    <button className={styles.danger} type="button" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </section>
        </div>
    );
};

export default ConfirmDialog;
