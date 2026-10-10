import { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = {
    success: FiCheckCircle,
    info: FiInfo,
    warning: FiInfo,
    error: FiXCircle,
};

const Toast = ({ toast, onDismiss }) => {
    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(onDismiss, 4200);
        return () => window.clearTimeout(timer);
    }, [toast, onDismiss]);

    if (!toast) return null;
    const Icon = icons[toast.tone] || icons.success;

    return (
        <div className={`${styles.toast} ${styles[toast.tone] || ""}`} role={toast.tone === "error" ? "alert" : "status"} aria-live={toast.tone === "error" ? "assertive" : "polite"}>
            <Icon className={styles.icon} aria-hidden="true" />
            <p>{toast.message}</p>
            <button className={styles.dismiss} type="button" onClick={onDismiss} aria-label="Dismiss notification"><FiX aria-hidden="true" /></button>
        </div>
    );
};

export default Toast;
