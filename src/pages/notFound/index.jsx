import { Link } from "react-router-dom";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <section className={styles.page} aria-labelledby="not-found-title">
        <div className={styles.paper}>
            <span className={styles.mark}><FiBookOpen aria-hidden="true" /></span>
            <span className={styles.code}>PAGE 404 · NOT IN THIS LEDGER</span>
            <h1 id="not-found-title">This page is missing from the books.</h1>
            <p>The address may have changed, or the page may not exist in this workspace.</p>
            <Link className={styles.backLink} to="/"><FiArrowLeft aria-hidden="true" /> Back to your overview</Link>
            <span className={styles.pageNumber}>FOLIO BOOKS&nbsp;&nbsp; / &nbsp;&nbsp;01</span>
        </div>
    </section>
);

export default NotFoundPage;
