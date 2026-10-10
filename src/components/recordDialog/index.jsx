import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { transactionCategories } from "../../data.js";
import { formatCurrency, formatDate, getClientName } from "../../utils.js";
import styles from "./styles.module.css";

const titleByEntity = { invoice: "invoice", client: "client", transaction: "transaction" };

const today = () => new Date().toISOString().slice(0, 10);

const createDefaults = (entity, clients) => {
    if (entity === "invoice") return { title: "", clientId: clients[0]?.id || "", amount: "", issueDate: today(), dueDate: today(), status: "Draft", notes: "" };
    if (entity === "client") return { company: "", contact: "", email: "", sector: "" };
    return { description: "", amount: "", date: today(), category: "Other", account: "Operating account", status: "Needs review" };
};

const RecordDialog = ({ entity, mode = "create", record, clients = [], onClose, onSave }) => {
    const [values, setValues] = useState(() => ({ ...createDefaults(entity, clients), ...(record || {}) }));
    const [error, setError] = useState("");
    const firstFieldRef = useRef(null);
    const closeRef = useRef(null);
    const dialogRef = useRef(null);
    const isDetails = mode === "details";
    const verb = mode === "edit" ? "Edit" : "New";

    useEffect(() => {
        if (firstFieldRef.current) firstFieldRef.current.focus();
        else closeRef.current?.focus();
        const handleKeys = (event) => {
            if (event.key === "Escape") onClose();
            if (event.key !== "Tab" || !dialogRef.current) return;
            const items = [...dialogRef.current.querySelectorAll("button, input, select, textarea, a[href]")].filter((item) => !item.disabled);
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        document.addEventListener("keydown", handleKeys);
        return () => document.removeEventListener("keydown", handleKeys);
    }, [onClose]);

    const setField = (event) => {
        setError("");
        setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const submit = (event) => {
        event.preventDefault();
        if ((entity === "invoice" || entity === "transaction") && Number(values.amount) <= 0 && !(entity === "transaction" && Number(values.amount) < 0)) {
            setError(entity === "invoice" ? "Enter an invoice amount greater than zero." : "Enter a transaction amount. Use a minus sign for an expense.");
            return;
        }
        if (entity === "invoice" && values.dueDate < values.issueDate) {
            setError("The due date must be the same as or later than the issue date.");
            return;
        }
        onSave(entity, {
            ...values,
            amount: entity === "invoice" || entity === "transaction" ? Number(values.amount) : values.amount,
        });
    };

    const details = entity === "invoice"
        ? [["Invoice", record?.id], ["Client", getClientName(clients, record?.clientId)], ["Amount", formatCurrency(record?.amount)], ["Status", record?.status], ["Issued", formatDate(record?.issueDate, { month: "long", day: "numeric", year: "numeric" })], ["Due", formatDate(record?.dueDate, { month: "long", day: "numeric", year: "numeric" })], ["Notes", record?.notes || "No notes"]]
        : entity === "client"
          ? [["Company", record?.company], ["Contact", record?.contact], ["Email", record?.email], ["Sector", record?.sector], ["Added", formatDate(record?.joined, { month: "long", day: "numeric", year: "numeric" })]]
          : [["Transaction", record?.description], ["Date", formatDate(record?.date, { month: "long", day: "numeric", year: "numeric" })], ["Category", record?.category], ["Account", record?.account], ["Amount", formatCurrency(record?.amount)], ["Status", record?.status]];

    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="record-title" aria-describedby="record-description">
                <div className={styles.dialogHeader}>
                    <div>
                        <h2 id="record-title">{isDetails ? `${entity === "client" ? "Client" : entity === "invoice" ? "Invoice" : "Transaction"} details` : `${verb} ${titleByEntity[entity]}`}</h2>
                        <p id="record-description">{isDetails ? "Review this record in your books." : "Update your books with the details below."}</p>
                    </div>
                    <button ref={closeRef} className={styles.close} type="button" onClick={onClose} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
                </div>

                {isDetails ? (
                    <dl className={styles.details}>
                        {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "-"}</dd></div>)}
                    </dl>
                ) : (
                    <form className={styles.form} onSubmit={submit}>
                        {entity === "client" && <>
                            <label className={styles.field}>Business name<input ref={firstFieldRef} name="company" value={values.company} onChange={setField} placeholder="Willow & Thread" required maxLength={90} /></label>
                            <div className={styles.row}>
                                <label className={styles.field}>Contact name<input name="contact" value={values.contact} onChange={setField} placeholder="Mara Ellis" required maxLength={80} /></label>
                                <label className={styles.field}>Email<input name="email" type="email" value={values.email} onChange={setField} placeholder="name@company.com" required /></label>
                            </div>
                            <label className={styles.field}>Business type<input name="sector" value={values.sector} onChange={setField} placeholder="Design studio" maxLength={70} /></label>
                        </>}

                        {entity === "invoice" && <>
                            <label className={styles.field}>Invoice title<input ref={firstFieldRef} name="title" value={values.title} onChange={setField} placeholder="Project or service" required maxLength={100} /></label>
                            <div className={styles.row}>
                                <label className={styles.field}>Client<select name="clientId" value={values.clientId} onChange={setField} required>{clients.map((client) => <option key={client.id} value={client.id}>{client.company}</option>)}</select></label>
                                <label className={styles.field}>Amount<input name="amount" type="number" min="0.01" step="0.01" value={values.amount} onChange={setField} placeholder="0.00" required /></label>
                            </div>
                            <div className={styles.row}>
                                <label className={styles.field}>Issue date<input name="issueDate" type="date" value={values.issueDate} onChange={setField} required /></label>
                                <label className={styles.field}>Due date<input name="dueDate" type="date" value={values.dueDate} onChange={setField} required /></label>
                            </div>
                            <label className={styles.field}>Status<select name="status" value={values.status} onChange={setField}>{["Draft", "Sent", "Paid", "Overdue"].map((status) => <option key={status}>{status}</option>)}</select></label>
                            <label className={styles.field}>Notes<textarea name="notes" value={values.notes} onChange={setField} placeholder="Optional note for this invoice" rows="3" maxLength={240} /></label>
                        </>}

                        {entity === "transaction" && <>
                            <label className={styles.field}>Description<input ref={firstFieldRef} name="description" value={values.description} onChange={setField} placeholder="Supplier or payment details" required maxLength={100} /></label>
                            <div className={styles.row}>
                                <label className={styles.field}>Amount<input name="amount" type="number" step="0.01" value={values.amount} onChange={setField} placeholder="Positive income, negative expense" required /></label>
                                <label className={styles.field}>Date<input name="date" type="date" value={values.date} onChange={setField} required /></label>
                            </div>
                            <div className={styles.row}>
                                <label className={styles.field}>Category<select name="category" value={values.category} onChange={setField}>{transactionCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
                                <label className={styles.field}>Account<select name="account" value={values.account} onChange={setField}>{["Operating account", "Business card", "Savings account"].map((account) => <option key={account}>{account}</option>)}</select></label>
                            </div>
                            <p className={styles.helperText}>Use a negative amount for expenses and a positive amount for incoming funds.</p>
                        </>}

                        {error && <p className={styles.error} role="alert">{error}</p>}
                        <div className={styles.actions}>
                            <button className={styles.cancel} type="button" onClick={onClose}>Cancel</button>
                            <button className={styles.save} type="submit">{mode === "edit" ? "Save changes" : `Create ${titleByEntity[entity]}`}</button>
                        </div>
                    </form>
                )}
                {isDetails && <div className={styles.actions}><button className={styles.save} type="button" onClick={onClose}>Done</button></div>}
            </section>
        </div>
    );
};

export default RecordDialog;
