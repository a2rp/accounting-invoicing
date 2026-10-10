import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiBookOpen, FiMenu, FiPlus, FiX } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import styles from "./styles.module.css";

const links = [
    { label: "Overview", to: "/", end: true },
    { label: "Transactions", to: "/transactions" },
    { label: "Invoices", to: "/invoices" },
    { label: "Clients", to: "/clients" },
    { label: "Reports", to: "/reports" },
];

const Header = ({ onNewInvoice }) => {
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        let previous = window.scrollY;
        const handleScroll = () => {
            const current = window.scrollY;
            if (menuOpen || current < 72 || current < previous - 4) setHidden(false);
            else if (current > previous + 4) setHidden(true);
            previous = current;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuOpen]);

    useEffect(() => {
        setMenuOpen(false);
        setHidden(false);
    }, [location.pathname]);

    useEffect(() => {
        const closeOutside = (event) => {
            if (menuOpen && headerRef.current && !headerRef.current.contains(event.target)) setMenuOpen(false);
        };
        const closeEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeEscape);
        };
    }, [menuOpen]);

    return (
        <header ref={headerRef} className={`${styles.header} ${hidden ? styles.hidden : ""} ${menuOpen ? styles.menuOpen : ""}`}>
            <div className={styles.headerInner}>
                <Link className={styles.brand} to="/" aria-label="Folio Books overview">
                    <span className={styles.brandMark}><FiBookOpen aria-hidden="true" /></span>
                    <span>folio<span className={styles.brandDot}>.</span></span>
                </Link>
                <nav id="folio-navigation" className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`} aria-label="Main navigation">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={() => setMenuOpen(false)}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.actions}>
                    <a className={styles.repository} href="https://github.com/a2rp/accounting-invoicing" target="_blank" rel="noreferrer">
                        <FaGithub aria-hidden="true" /> <span>Repository</span>
                    </a>
                    <button className={styles.newInvoice} type="button" onClick={onNewInvoice}>
                        <FiPlus aria-hidden="true" /> <span>New invoice</span>
                    </button>
                    <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="folio-navigation" onClick={() => setMenuOpen((open) => !open)}>
                        {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
