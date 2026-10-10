import { Tooltip } from "react-tooltip";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiCoffee, FiGlobe, FiHeart, FiMail, FiPenTool } from "react-icons/fi";
import styles from "./styles.module.css";

const links = [
    { label: "Portfolio", address: "ashishranjan.net", href: "https://www.ashishranjan.net", Icon: FiGlobe },
    { label: "GitHub", address: "github.com/a2rp", href: "https://github.com/a2rp", Icon: FaGithub },
    { label: "Source code", address: "github.com/a2rp/accounting-invoicing", href: "https://github.com/a2rp/accounting-invoicing", Icon: FaGithub },
    { label: "CodePen", address: "codepen.io/ash1198", href: "https://codepen.io/ash1198", Icon: FiPenTool },
    { label: "LinkedIn", address: "linkedin.com/in/aashishranjan", href: "https://www.linkedin.com/in/aashishranjan", Icon: FaLinkedinIn },
    { label: "Facebook", address: "facebook.com/theash.ashish", href: "https://www.facebook.com/theash.ashish/", Icon: FaFacebookF },
    { label: "YouTube", address: "youtube.com/@ashishranjan-ashz", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", Icon: FaYoutube },
    { label: "Email", address: "ash.ranjan09@gmail.com", href: "mailto:ash.ranjan09@gmail.com", Icon: FiMail },
    { label: "Support", address: "a2rp-donation-page.netlify.app", href: "https://a2rp-donation-page.netlify.app/", Icon: FiHeart },
    { label: "Buy Me a Coffee", address: "buymeacoffee.com/ashishranjan", href: "https://buymeacoffee.com/ashishranjan", Icon: FiCoffee },
    { label: "Patreon", address: "patreon.com/ashishranjan", href: "https://www.patreon.com/ashishranjan", Icon: FiHeart },
];

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.footerInner}>
            <div className={styles.copyright}>
                <a className={styles.logoLink} href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" aria-label="Ashish Ranjan portfolio">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan" />
                </a>
                <p>© {new Date().getFullYear()} <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
            </div>
            <div className={styles.linkList} aria-label="Social and support links">
                {links.map(({ label, address, href, Icon }, index) => (
                    <a key={`${label}-${href}`} className={styles.iconLink} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"} data-tooltip-id="folio-footer-tooltip" data-tooltip-content={`${label}\n${address}`} aria-label={`${label}, ${address}`}>
                        <Icon aria-hidden="true" />
                        {index === 0 && <span className={styles.visuallyHidden}>Portfolio</span>}
                    </a>
                ))}
                <Tooltip id="folio-footer-tooltip" className={styles.tooltip} place="top" delayShow={180} />
            </div>
        </div>
    </footer>
);

export default Footer;
