import { Link } from "react-router-dom";
import { FiArrowDownLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiChevronRight, FiClock, FiFileText, FiPlus, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import { formatCurrency, formatDate, getClientName } from "../../utils.js";
import styles from "./styles.module.css";

const OverviewPage = ({ clients, invoices, transactions, openCreate, openDetails, recordPayment, updateTransaction, showToast }) => {
    const now = new Date();
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthTransactions = transactions.filter((item) => item.date.startsWith(monthPrefix));
    const monthIncome = monthTransactions.reduce((sum, item) => sum + Math.max(Number(item.amount), 0), 0);
    const monthExpenses = monthTransactions.reduce((sum, item) => sum + Math.abs(Math.min(Number(item.amount), 0)), 0);
    const reviewItems = transactions.filter((item) => item.status === "Needs review").slice(0, 4);
    const overdue = invoices.filter((item) => item.status === "Overdue").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const dueSoon = invoices.filter((item) => item.status === "Sent").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3);
    const recentItems = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 5);
    const dailyTotals = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
        const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const entries = transactions.filter((item) => item.date === dayKey);
        return { key: dayKey, label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date), income: entries.reduce((sum, item) => sum + Math.max(Number(item.amount), 0), 0), expenses: entries.reduce((sum, item) => sum + Math.abs(Math.min(Number(item.amount), 0)), 0) };
    });
    const maxDaily = Math.max(1, ...dailyTotals.map((item) => Math.max(item.income, item.expenses)));
    const net = monthIncome - monthExpenses;

    return (
        <section className={styles.page} aria-labelledby="overview-title">
            <div className={styles.breadcrumb}><span>Books</span><span aria-hidden="true">/</span><strong>Overview</strong><span className={styles.dateStamp}>{formatDate(localToday, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span></div>
            <div className={styles.pageHeading}><div><p className={styles.eyebrow}>YOUR BOOKS, AT A GLANCE</p><h1 id="overview-title">A clear view of the business.</h1><p>Review cash activity, tie out transactions, and keep invoices moving.</p></div><button className={styles.addTransaction} type="button" onClick={() => openCreate("transaction")}><FiPlus aria-hidden="true" /> Add transaction</button></div>

            <div className={styles.overviewGrid}>
                <div className={styles.mainColumn}>
                    <section className={styles.cashPanel} aria-label="Monthly cash summary">
                        <div className={styles.cashTop}><span><i /> {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(now)} · BOOK MOVEMENT</span><span className={styles.cashNote}>Based on recorded activity</span></div>
                        <div className={styles.cashMain}><div><span>Net cash movement</span><strong className={net < 0 ? styles.negative : ""}>{net < 0 ? "−" : ""}{formatCurrency(Math.abs(net))}</strong><small>{net >= 0 ? "More money came in than went out" : "More money went out than came in"}</small></div><div className={styles.cashWatermark} aria-hidden="true">F</div></div>
                        <div className={styles.cashBottom}><div><span><FiArrowDownLeft aria-hidden="true" /> In</span><strong>{formatCurrency(monthIncome)}</strong></div><div><span><FiArrowUpRight aria-hidden="true" /> Out</span><strong>{formatCurrency(monthExpenses)}</strong></div><div><span><FiFileText aria-hidden="true" /> Invoices</span><strong>{invoices.length} <small>total</small></strong></div><Link to="/reports">View monthly report <FiArrowRight aria-hidden="true" /></Link></div>
                    </section>

                    <section className={styles.activityPanel} aria-labelledby="activity-title">
                        <div className={styles.sectionHead}><div><span className={styles.sectionKicker}>THE WEEK IN YOUR BOOKS</span><h2 id="activity-title">Cash flow</h2></div><Link to="/transactions">All transactions <FiArrowRight aria-hidden="true" /></Link></div>
                        <div className={styles.chartLegend}><span><i /> Money in</span><span><i /> Money out</span><span className={styles.weekTotal}>{monthTransactions.length} entries this month</span></div>
                        <div className={styles.weekChart} role="img" aria-label="Daily income and expenses over the last seven days">
                            <div className={styles.chartGrid}>{[0, 1, 2, 3].map((item) => <i key={item} />)}</div>
                            {dailyTotals.map((day) => <div className={styles.dayColumn} key={day.key} title={`${formatDate(day.key, { month: "long", day: "numeric" })}: ${formatCurrency(day.income)} received, ${formatCurrency(day.expenses)} spent`}><div className={styles.dayBars}><span className={styles.inBar} style={{ height: `${Math.max(day.income ? 5 : 0, day.income / maxDaily * 100)}%` }} /><span className={styles.outBar} style={{ height: `${Math.max(day.expenses ? 5 : 0, day.expenses / maxDaily * 100)}%` }} /></div><span>{day.label}</span></div>)}
                        </div>
                    </section>

                    <section className={styles.recentPanel} aria-labelledby="recent-title">
                        <div className={styles.sectionHead}><div><span className={styles.sectionKicker}>LATEST ENTRIES</span><h2 id="recent-title">Recent activity</h2></div><Link to="/transactions">Open ledger <FiArrowRight aria-hidden="true" /></Link></div>
                        {recentItems.length ? <div className={styles.recentList}>{recentItems.map((item) => <button className={styles.recentRow} type="button" key={item.id} onClick={() => openDetails("transaction", item)}><span className={`${styles.activityIcon} ${Number(item.amount) >= 0 ? styles.incomeIcon : ""}`}>{Number(item.amount) >= 0 ? <FiArrowDownLeft aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}</span><span className={styles.recentCopy}><strong>{item.description}</strong><small>{formatDate(item.date)} · {item.category}</small></span><span className={`${styles.recentAmount} ${Number(item.amount) >= 0 ? styles.incomeAmount : ""}`}>{Number(item.amount) >= 0 ? "+" : "−"}{formatCurrency(Math.abs(Number(item.amount)))}</span><FiChevronRight className={styles.rowChevron} aria-hidden="true" /></button>)}</div> : <div className={styles.emptyActivity}>No transactions recorded yet. Add one to start your ledger.</div>}
                    </section>
                </div>

                <aside className={styles.sideColumn}>
                    <section className={styles.reviewPanel} aria-labelledby="review-title">
                        <div className={styles.reviewHeading}><div><span className={styles.sectionKicker}>BANK RECONCILIATION</span><h2 id="review-title">Needs a look</h2></div><span className={styles.reviewCount}>{reviewItems.length}{transactions.filter((item) => item.status === "Needs review").length > reviewItems.length ? "+" : ""}</span></div>
                        <p className={styles.reviewIntro}>Match bank activity to keep the books up to date.</p>
                        {reviewItems.length ? <div className={styles.reviewList}>{reviewItems.map((item) => <div className={styles.reviewRow} key={item.id}><button type="button" className={styles.reviewDetails} onClick={() => openDetails("transaction", item)}><span><strong>{item.description}</strong><small>{formatDate(item.date)} · {item.category}</small></span><b className={Number(item.amount) >= 0 ? styles.credit : ""}>{Number(item.amount) >= 0 ? "+" : "−"}{formatCurrency(Math.abs(Number(item.amount)))}</b></button><button className={styles.matchButton} type="button" onClick={() => updateTransaction(item, "Matched")}><FiCheck aria-hidden="true" /> Mark matched</button></div>)}</div> : <div className={styles.allClear}><FiCheck aria-hidden="true" /><span>Everything is reconciled.</span></div>}
                        <Link className={styles.panelLink} to="/transactions">Review all activity <FiArrowRight aria-hidden="true" /></Link>
                    </section>

                    <section className={styles.invoicePanel} aria-labelledby="invoice-followup-title">
                        <div className={styles.invoiceHeading}><div><span className={styles.sectionKicker}>ACCOUNTS RECEIVABLE</span><h2 id="invoice-followup-title">Invoice follow-up</h2></div><Link to="/invoices" aria-label="View invoices"><FiArrowRight aria-hidden="true" /></Link></div>
                        {overdue.length > 0 && <div className={styles.overdueBox}><div className={styles.overdueTop}><FiClock aria-hidden="true" /><strong>{overdue.length} overdue</strong><span>{formatCurrency(overdue.reduce((sum, item) => sum + Number(item.amount), 0))}</span></div>{overdue.slice(0, 2).map((invoice) => <div className={styles.dueRow} key={invoice.id}><button type="button" onClick={() => openDetails("invoice", invoice)}><strong>{getClientName(clients, invoice.clientId)}</strong><small>{invoice.id} · due {formatDate(invoice.dueDate)}</small></button><button className={styles.recordButton} type="button" onClick={() => recordPayment(invoice)}>Record payment</button></div>)}</div>}
                        <div className={styles.dueSoonHeading}>{overdue.length ? "Coming due" : "Sent invoices"}<span>{dueSoon.length}</span></div>
                        {dueSoon.length ? <div className={styles.dueSoonList}>{dueSoon.map((invoice) => <button className={styles.dueSoonRow} type="button" key={invoice.id} onClick={() => openDetails("invoice", invoice)}><span><strong>{getClientName(clients, invoice.clientId)}</strong><small>{invoice.title}</small></span><b>{formatCurrency(invoice.amount)}<small>Due {formatDate(invoice.dueDate)}</small></b></button>)}</div> : !overdue.length && <div className={styles.invoiceEmpty}>No sent invoices are waiting for payment.</div>}
                        <Link className={styles.panelLink} to="/invoices">Open invoice register <FiArrowRight aria-hidden="true" /></Link>
                    </section>

                    <section className={styles.bookNote}><span className={styles.noteMark}>F</span><div><strong>Good books, clear mind.</strong><p>Every edit, match, and invoice lives in this page session. Reload to restore the sample books.</p></div><FiRefreshCw aria-hidden="true" /></section>
                </aside>
            </div>
            {transactions.length === 0 && <button className={styles.firstEntry} type="button" onClick={() => { openCreate("transaction"); showToast("Enter the first entry in your ledger.", "info"); }}><FiPlus aria-hidden="true" /> Add your first transaction</button>}
        </section>
    );
};

export default OverviewPage;
