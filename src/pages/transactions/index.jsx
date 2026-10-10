import { useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiCheck, FiEdit2, FiPlus, FiRefreshCw, FiSearch, FiTrash2 } from "react-icons/fi";
import { transactionCategories } from "../../data.js";
import { downloadCsv, formatCurrency, formatDate, getClientName } from "../../utils.js";
import styles from "./styles.module.css";

const TransactionsPage = ({ clients, invoices, transactions, openCreate, openEdit, openDetails, requestDelete, updateTransaction, showToast }) => {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All activity");
    const [category, setCategory] = useState("All categories");

    const filtered = useMemo(() => transactions.filter((item) => {
        const invoice = invoices.find((entry) => entry.id === item.invoiceId);
        const searchText = `${item.id} ${item.description} ${item.category} ${getClientName(clients, item.clientId)} ${invoice?.id || ""}`.toLowerCase();
        return searchText.includes(query.toLowerCase()) && (status === "All activity" || item.status === status) && (category === "All categories" || item.category === category);
    }), [clients, invoices, transactions, query, status, category]);

    const reviewCount = transactions.filter((item) => item.status === "Needs review").length;
    const income = filtered.reduce((sum, item) => sum + Math.max(Number(item.amount), 0), 0);
    const expenses = filtered.reduce((sum, item) => sum + Math.abs(Math.min(Number(item.amount), 0)), 0);

    const exportCsv = () => {
        const rows = [["Date", "Description", "Category", "Account", "Status", "Amount"], ...filtered.map((item) => [item.date, item.description, item.category, item.account, item.status, item.amount])];
        if (!downloadCsv("folio-transactions.csv", rows)) showToast("There are no transactions to export.", "info");
        else showToast("Transactions exported as CSV.");
    };

    return (
        <section className={styles.page} aria-labelledby="transactions-title">
            <div className={styles.breadcrumb}><span>Books</span><span aria-hidden="true">/</span><strong>Transactions</strong></div>
            <div className={styles.headingRow}>
                <div><p className={styles.eyebrow}>BANK ACTIVITY</p><h1 id="transactions-title">Transactions</h1><p className={styles.subtitle}>Review imported activity and keep your books in balance.</p></div>
                <div className={styles.actions}><button className={styles.exportButton} type="button" onClick={exportCsv}><FiArrowUpRight aria-hidden="true" /> Export activity</button><button className={styles.addButton} type="button" onClick={() => openCreate("transaction")}><FiPlus aria-hidden="true" /> Add transaction</button></div>
            </div>

            <div className={styles.bookBalance}>
                <div className={styles.balanceStamp}><span>OCT</span><strong>10</strong><small>2026</small></div>
                <div className={styles.balanceIntro}><span>ACTIVITY IN VIEW</span><strong>{filtered.length} transactions</strong><small>Current workspace · Operating account and business card</small></div>
                <div className={styles.balanceTotals}><span><FiArrowDownLeft aria-hidden="true" /> Money in</span><strong>{formatCurrency(income)}</strong></div>
                <div className={styles.balanceTotals}><span><FiArrowUpRight aria-hidden="true" /> Money out</span><strong>{formatCurrency(expenses)}</strong></div>
                <div className={styles.reviewBadge}><i />{reviewCount} to review</div>
            </div>

            <div className={styles.filterRow}>
                <div className={styles.statusFilters} role="group" aria-label="Filter transaction status">
                    {["All activity", "Needs review", "Matched"].map((item) => <button type="button" key={item} onClick={() => setStatus(item)} className={status === item ? styles.selectedFilter : styles.filterButton} aria-pressed={status === item}>{item}{item === "Needs review" && reviewCount > 0 && <span>{reviewCount}</span>}</button>)}
                </div>
                <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.visuallyHidden}>Search transactions</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" /></label>
                <label className={styles.categorySelect}><span className={styles.visuallyHidden}>Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{transactionCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>

            <div className={styles.ledger}>
                <div className={styles.ledgerHeader}><div><span className={styles.ledgerKicker}>THE LEDGER</span><h2>Account activity</h2></div><span className={styles.accountLabel}><i /> Operating account <b>•• 4812</b></span></div>
                <div className={styles.tableScroll}>
                    <table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Account</th><th>Match</th><th className={styles.amountHead}>Amount</th><th><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>
                        <tbody>{filtered.map((item) => {
                            const clientName = item.clientId ? getClientName(clients, item.clientId) : "";
                            const invoice = invoices.find((entry) => entry.id === item.invoiceId);
                            const positive = Number(item.amount) >= 0;
                            return <tr key={item.id}>
                                <td className={styles.dateCell}>{formatDate(item.date, { month: "short", day: "numeric", year: "numeric" })}</td>
                                <td><button className={styles.description} type="button" onClick={() => openDetails("transaction", item)}>{item.description}</button><span className={styles.reference}>{item.id}{clientName ? ` · ${clientName}` : invoice ? ` · ${invoice.id}` : ""}</span></td>
                                <td><span className={styles.categoryPill}>{item.category}</span></td>
                                <td><span className={styles.accountName}>{item.account}</span></td>
                                <td><span className={item.status === "Matched" ? styles.matched : styles.needsReview}><i />{item.status}</span></td>
                                <td className={`${styles.amount} ${positive ? styles.credit : styles.debit}`}>{positive ? "+" : "−"}{formatCurrency(Math.abs(Number(item.amount)))}</td>
                                <td><div className={styles.rowActions}>
                                    <button type="button" aria-label={`Edit ${item.description}`} title="Edit transaction" onClick={() => openEdit("transaction", item)}><FiEdit2 aria-hidden="true" /></button>
                                    <button type="button" aria-label={item.status === "Matched" ? `Undo match for ${item.description}` : `Reconcile ${item.description}`} title={item.status === "Matched" ? "Undo match" : "Mark as matched"} onClick={() => updateTransaction(item, item.status === "Matched" ? "Needs review" : "Matched")}>{item.status === "Matched" ? <FiRefreshCw aria-hidden="true" /> : <FiCheck aria-hidden="true" />}</button>
                                    <button className={styles.deleteButton} type="button" aria-label={`Delete ${item.description}`} title="Delete transaction" onClick={() => requestDelete("transaction", item)}><FiTrash2 aria-hidden="true" /></button>
                                </div></td>
                            </tr>;
                        })}</tbody>
                    </table>
                    {filtered.length === 0 && <div className={styles.empty}><span>No transactions found</span><p>Try clearing filters or record a transaction.</p><button type="button" onClick={() => { setQuery(""); setStatus("All activity"); setCategory("All categories"); }}>Reset filters</button></div>}
                </div>
                <div className={styles.ledgerFooter}><span>Showing {filtered.length} of {transactions.length} entries</span><span>Updated just now <i /></span></div>
            </div>
        </section>
    );
};

export default TransactionsPage;
