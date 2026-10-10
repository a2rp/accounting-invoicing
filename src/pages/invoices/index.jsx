import { useMemo, useState } from "react";
import { FiArrowDownToLine, FiArrowUpRight, FiCheck, FiEdit2, FiFileText, FiPlus, FiSearch, FiSend, FiTrash2 } from "react-icons/fi";
import { getClientName, formatCurrency, formatDate, downloadCsv } from "../../utils.js";
import styles from "./styles.module.css";

const filters = ["All invoices", "Draft", "Sent", "Overdue", "Paid"];

const InvoicesPage = ({ clients, invoices, openCreate, openEdit, openDetails, requestDelete, markInvoiceSent, recordPayment, showToast }) => {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All invoices");

    const visibleInvoices = useMemo(() => invoices.filter((invoice) => {
        const searchText = `${invoice.id} ${invoice.title} ${getClientName(clients, invoice.clientId)}`.toLowerCase();
        return searchText.includes(query.toLowerCase()) && (status === "All invoices" || invoice.status === status);
    }), [clients, invoices, query, status]);

    const outstanding = invoices.filter((invoice) => invoice.status !== "Paid" && invoice.status !== "Draft").reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const overdueCount = invoices.filter((invoice) => invoice.status === "Overdue").length;

    const exportInvoices = () => {
        const rows = [["Invoice", "Client", "Description", "Issued", "Due", "Status", "Amount"], ...visibleInvoices.map((invoice) => [invoice.id, getClientName(clients, invoice.clientId), invoice.title, invoice.issueDate, invoice.dueDate, invoice.status, invoice.amount])];
        if (!downloadCsv("folio-invoices.csv", rows)) showToast("There are no invoices to export.", "info");
        else showToast("Invoice register exported as CSV.", "success");
    };

    return (
        <section className={styles.page} aria-labelledby="invoices-title">
            <div className={styles.breadcrumb}><span>Books</span><span aria-hidden="true">/</span><strong>Invoices</strong></div>
            <div className={styles.headingRow}>
                <div>
                    <p className={styles.eyebrow}>ACCOUNTS RECEIVABLE</p>
                    <h1 id="invoices-title">Invoice register</h1>
                    <p className={styles.subtitle}>Keep every client bill, due date, and payment in one tidy place.</p>
                </div>
                <div className={styles.headingActions}>
                    <button className={styles.secondaryButton} type="button" onClick={exportInvoices}><FiArrowDownToLine aria-hidden="true" /> Export CSV</button>
                    <button className={styles.primaryButton} type="button" onClick={() => openCreate("invoice")}><FiPlus aria-hidden="true" /> New invoice</button>
                </div>
            </div>

            <div className={styles.summaryStrip}>
                <div className={styles.summaryIcon}><FiFileText aria-hidden="true" /></div>
                <div className={styles.summaryCopy}><span>Awaiting payment</span><strong>{formatCurrency(outstanding)}</strong></div>
                <div className={styles.summaryDivider} />
                <p><strong>{overdueCount} overdue</strong><span>{overdueCount === 1 ? "invoice needs" : "invoices need"} a follow-up</span></p>
                <span className={styles.summaryNote}>Register total <b>{invoices.length}</b></span>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.tabs} role="group" aria-label="Filter invoices by status">
                    {filters.map((item) => <button className={status === item ? styles.activeTab : styles.tab} type="button" key={item} onClick={() => setStatus(item)} aria-pressed={status === item}>{item}{item === "All invoices" && <span>{invoices.length}</span>}</button>)}
                </div>
                <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.visuallyHidden}>Search invoices</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoice or client" /></label>
            </div>

            <div className={styles.tableFrame}>
                <div className={styles.tableHeading}><div><h2>Client billing</h2><p>Recent invoices and their payment status</p></div><span>{visibleInvoices.length} {visibleInvoices.length === 1 ? "record" : "records"}</span></div>
                <div className={styles.tableScroll}>
                    <table>
                        <thead><tr><th>Invoice</th><th>Client</th><th>Issue date</th><th>Due date</th><th>Status</th><th className={styles.amountHeading}>Amount</th><th><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>
                        <tbody>
                            {visibleInvoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td><button className={styles.invoiceLink} type="button" onClick={() => openDetails("invoice", invoice)}>{invoice.id}<FiArrowUpRight aria-hidden="true" /></button><span className={styles.itemTitle}>{invoice.title}</span></td>
                                    <td><span className={styles.clientName}>{getClientName(clients, invoice.clientId)}</span><span className={styles.clientHint}>Client account</span></td>
                                    <td>{formatDate(invoice.issueDate)}</td>
                                    <td className={invoice.status === "Overdue" ? styles.overdueDate : ""}>{formatDate(invoice.dueDate)}</td>
                                    <td><span className={`${styles.status} ${styles[invoice.status.toLowerCase()]}`}><i aria-hidden="true" />{invoice.status}</span></td>
                                    <td className={styles.amount}>{formatCurrency(invoice.amount)}</td>
                                    <td><div className={styles.rowActions}>
                                        <button type="button" onClick={() => openDetails("invoice", invoice)} aria-label={`View ${invoice.id}`} title="View details"><FiArrowUpRight aria-hidden="true" /></button>
                                        <button type="button" onClick={() => openEdit("invoice", invoice)} aria-label={`Edit ${invoice.id}`} title="Edit invoice"><FiEdit2 aria-hidden="true" /></button>
                                        {invoice.status === "Draft" && <button type="button" onClick={() => markInvoiceSent(invoice)} aria-label={`Mark ${invoice.id} as sent`} title="Mark as sent"><FiSend aria-hidden="true" /></button>}
                                        {invoice.status !== "Paid" && <button type="button" onClick={() => recordPayment(invoice)} aria-label={`Record payment for ${invoice.id}`} title="Record payment"><FiCheck aria-hidden="true" /></button>}
                                        <button className={styles.deleteAction} type="button" onClick={() => requestDelete("invoice", invoice)} aria-label={`Delete ${invoice.id}`} title="Delete invoice"><FiTrash2 aria-hidden="true" /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleInvoices.length === 0 && <div className={styles.emptyState}><FiFileText aria-hidden="true" /><strong>No invoices match this view</strong><span>Try a different search or add an invoice.</span><button className={styles.secondaryButton} type="button" onClick={() => { setQuery(""); setStatus("All invoices"); }}>Clear filters</button></div>}
                </div>
                <div className={styles.tableFooter}><span>Invoices stay in this session and reset when the page reloads.</span><button type="button" onClick={() => openCreate("invoice")}><FiPlus aria-hidden="true" /> Add invoice</button></div>
            </div>
        </section>
    );
};

export default InvoicesPage;
