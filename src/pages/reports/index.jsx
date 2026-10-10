import { useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiDownload, FiFileText, FiTrendingUp } from "react-icons/fi";
import { downloadCsv, formatCurrency, formatDate, getClientName } from "../../utils.js";
import styles from "./styles.module.css";

const periods = ["This month", "Last 3 months", "Year to date", "All activity"];

const ReportsPage = ({ clients, invoices, transactions, showToast }) => {
    const [period, setPeriod] = useState("This month");
    const [view, setView] = useState("Cash flow");
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const startMonth = period === "This month" ? currentMonth : period === "Last 3 months" ? `${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, "0")}` : `${today.getFullYear()}-01`;

    const periodTransactions = useMemo(() => transactions.filter((transaction) => {
        const month = transaction.date.slice(0, 7);
        return period === "All activity" || month >= startMonth && month <= currentMonth;
    }), [transactions, period, startMonth, currentMonth]);

    const income = periodTransactions.reduce((sum, transaction) => sum + Math.max(Number(transaction.amount), 0), 0);
    const expenses = periodTransactions.reduce((sum, transaction) => sum + Math.abs(Math.min(Number(transaction.amount), 0)), 0);
    const net = income - expenses;
    const categories = useMemo(() => {
        const totals = periodTransactions.filter((item) => Number(item.amount) < 0).reduce((result, item) => {
            result[item.category] = (result[item.category] || 0) + Math.abs(Number(item.amount));
            return result;
        }, {});
        return Object.entries(totals).sort((a, b) => b[1] - a[1]);
    }, [periodTransactions]);

    const months = useMemo(() => {
        const result = [];
        for (let offset = 5; offset >= 0; offset -= 1) {
            const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const entries = periodTransactions.filter((item) => item.date.startsWith(key));
            result.push({ key, label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date), income: entries.reduce((sum, item) => sum + Math.max(Number(item.amount), 0), 0), expenses: entries.reduce((sum, item) => sum + Math.abs(Math.min(Number(item.amount), 0)), 0) });
        }
        return result;
    }, [periodTransactions, today]);
    const maxMonthly = Math.max(1, ...months.map((item) => Math.max(item.income, item.expenses)));
    const largestExpense = Math.max(1, ...categories.map(([, amount]) => amount));
    const outstanding = invoices.filter((invoice) => invoice.status !== "Paid" && invoice.status !== "Draft").reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid").length;

    const exportReport = () => {
        const rows = [["Folio Books · Income and expense report"], ["Period", period], ["Income", income], ["Expenses", expenses], ["Net", net], [], ["Date", "Description", "Client", "Category", "Account", "Amount"], ...periodTransactions.map((item) => [item.date, item.description, item.clientId ? getClientName(clients, item.clientId) : "", item.category, item.account, item.amount])];
        if (!downloadCsv("folio-financial-report.csv", rows)) showToast("No activity is available for this report period.", "info");
        else showToast("Financial report exported as CSV.");
    };

    return (
        <section className={styles.page} aria-labelledby="reports-title">
            <div className={styles.breadcrumb}><span>Books</span><span aria-hidden="true">/</span><strong>Reports</strong></div>
            <div className={styles.headingRow}><div><p className={styles.eyebrow}>THE MONTHLY STATEMENT</p><h1 id="reports-title">Reports & insights</h1><p className={styles.subtitle}>A straightforward picture of money moving through your business.</p></div><button className={styles.exportButton} type="button" onClick={exportReport}><FiDownload aria-hidden="true" /> Download CSV</button></div>

            <div className={styles.reportPaper}>
                <div className={styles.paperTop}><div className={styles.paperBrand}><span className={styles.brandMark}>F</span><div><strong>Folio Books</strong><span>SMALL BUSINESS STATEMENT</span></div></div><label className={styles.periodSelect}><span>REPORTING PERIOD</span><select value={period} onChange={(event) => setPeriod(event.target.value)}>{periods.map((item) => <option key={item}>{item}</option>)}</select></label></div>
                <div className={styles.statementTitle}><div><span>FINANCIAL SUMMARY</span><h2>{period}</h2></div><span className={styles.statementDate}>Prepared {formatDate(localToday, { month: "long", day: "numeric", year: "numeric" })}</span></div>

                <div className={styles.statementTotals}>
                    <div className={styles.totalItem}><span><FiArrowDownLeft aria-hidden="true" /> Total income</span><strong>{formatCurrency(income)}</strong><small>Recorded deposits and client payments</small></div>
                    <div className={styles.totalItem}><span><FiArrowUpRight aria-hidden="true" /> Total expenses</span><strong>{formatCurrency(expenses)}</strong><small>Recorded business outflows</small></div>
                    <div className={`${styles.totalItem} ${styles.netItem}`}><span><FiTrendingUp aria-hidden="true" /> Net cash movement</span><strong>{formatCurrency(net)}</strong><small>{net >= 0 ? "Income exceeded expenses" : "Expenses exceeded income"}</small></div>
                </div>

                <div className={styles.reportTabs} role="group" aria-label="Report view">
                    {["Cash flow", "Expense categories"].map((item) => <button type="button" key={item} onClick={() => setView(item)} className={view === item ? styles.activeTab : styles.tab} aria-pressed={view === item}>{item}</button>)}
                </div>

                {view === "Cash flow" ? <div className={styles.chartSection}>
                    <div className={styles.chartHeading}><div><h3>Cash flow over time</h3><p>Monthly recorded income and business expenses</p></div><div className={styles.legend}><span><i /> Income</span><span><i /> Expenses</span></div></div>
                    <div className={styles.chart} role="img" aria-label="Bar chart showing monthly income and expenses for the last six months">
                        <div className={styles.axisLabels}><span>{formatCurrency(maxMonthly)}</span><span>{formatCurrency(maxMonthly * .66)}</span><span>{formatCurrency(maxMonthly * .33)}</span><span>$0</span></div>
                        <div className={styles.plot}>{months.map((month) => <div className={styles.monthColumn} key={month.key} title={`${month.label}: ${formatCurrency(month.income)} income, ${formatCurrency(month.expenses)} expenses`}><div className={styles.bars}><span className={styles.incomeBar} style={{ height: `${Math.max(2, month.income / maxMonthly * 100)}%` }} /><span className={styles.expenseBar} style={{ height: `${Math.max(2, month.expenses / maxMonthly * 100)}%` }} /></div><span className={styles.monthLabel}>{month.label}</span></div>)}</div>
                    </div>
                    <div className={styles.chartFoot}><span>Each bar compares the entries recorded in the selected period.</span><span>All values in USD</span></div>
                </div> : <div className={styles.categorySection}>
                    <div className={styles.chartHeading}><div><h3>Where the money went</h3><p>Expenses grouped by category for {period.toLowerCase()}</p></div><span className={styles.categoryTotal}>{formatCurrency(expenses)} total expenses</span></div>
                    {categories.length ? <div className={styles.categoryList}>{categories.map(([name, amount]) => <div className={styles.categoryRow} key={name}><div className={styles.categoryLabel}><strong>{name}</strong><span>{formatCurrency(amount)} · {expenses ? Math.round(amount / expenses * 100) : 0}%</span></div><div className={styles.categoryTrack}><span style={{ width: `${amount / largestExpense * 100}%` }} /></div></div>)}</div> : <div className={styles.emptyReport}><FiFileText aria-hidden="true" /><strong>No expenses in this period</strong><span>Record a transaction to see your spending categories.</span></div>}
                </div>}

                <div className={styles.reportBottom}><div className={styles.bottomNote}><span>ACCOUNTS RECEIVABLE</span><strong>{formatCurrency(outstanding)} open balance</strong><small>Across invoices that are sent or overdue</small></div><div className={styles.bottomNote}><span>PAID INVOICES</span><strong>{paidInvoices} recorded</strong><small>Invoices currently marked paid</small></div><div className={styles.bottomNotice}>This report summarizes the sample activity currently in this browser session. Reloading restores the starter dataset.</div></div>
            </div>
        </section>
    );
};

export default ReportsPage;
