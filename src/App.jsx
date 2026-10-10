import { useCallback, useState } from "react";
import AppRoutes from "./AppRoutes.jsx";
import ConfirmDialog from "./components/confirmDialog/index.jsx";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import RecordDialog from "./components/recordDialog/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";
import Toast from "./components/toast/index.jsx";
import { initialClients, initialInvoices, initialTransactions, makeId } from "./data.js";
import styles from "./App.module.css";

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getNextInvoiceNumber = (invoices) => {
    const largest = invoices.reduce((max, invoice) => Math.max(max, Number(invoice.id.replace("INV-", "")) || 2400), 2400);
    return `INV-${largest + 1}`;
};

const App = () => {
    const [clients, setClients] = useState(initialClients);
    const [invoices, setInvoices] = useState(initialInvoices);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [dialog, setDialog] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, tone = "success") => {
        setToast({ id: Date.now(), message, tone });
    }, []);

    const openCreate = useCallback((entity, initialValues = {}) => {
        if (entity === "invoice" && clients.length === 0) {
            showToast("Add a client before creating an invoice.", "warning");
            setDialog({ entity: "client", mode: "create" });
            return;
        }
        setDialog({ entity, mode: "create", record: initialValues });
    }, [clients.length, showToast]);

    const openEdit = useCallback((entity, record) => setDialog({ entity, mode: "edit", record }), []);
    const openDetails = useCallback((entity, record) => setDialog({ entity, mode: "details", record }), []);
    const closeDialog = useCallback(() => setDialog(null), []);
    const dismissToast = useCallback(() => setToast(null), []);

    const saveRecord = useCallback((entity, values) => {
        const editing = Boolean(values.id);
        if (entity === "client") {
            const next = { ...values, id: values.id || makeId("CL"), joined: values.joined || today() };
            setClients((current) => editing ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
        }
        if (entity === "invoice") {
            const next = { ...values, id: values.id || getNextInvoiceNumber(invoices), amount: Number(values.amount) };
            setInvoices((current) => editing ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
        }
        if (entity === "transaction") {
            const next = { ...values, id: values.id || makeId("TX"), amount: Number(values.amount), status: values.status || "Needs review" };
            setTransactions((current) => editing ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
        }
        setDialog(null);
        showToast(`${entity[0].toUpperCase()}${entity.slice(1)} ${editing ? "updated" : "created"}.`);
    }, [invoices, showToast]);

    const requestDelete = useCallback((entity, record) => {
        const relatedInvoices = entity === "client" ? invoices.filter((invoice) => invoice.clientId === record.id) : [];
        const title = entity === "client" ? "Delete this client?" : entity === "invoice" ? "Delete this invoice?" : "Delete this transaction?";
        const name = entity === "client" ? record.company : entity === "invoice" ? record.id : record.description;
        const message = entity === "client"
            ? `Delete ${name} and remove its ${relatedInvoices.length} invoice record${relatedInvoices.length === 1 ? "" : "s"}?`
            : entity === "invoice"
              ? `Delete ${record.id} for ${record.title}? Related bank activity will stay in your books.`
              : `Delete the transaction “${name}” from your books?`;
        setDialog(null);
        setConfirmation({ entity, record, title, message, note: "This action cannot be undone in this demo workspace.", confirmLabel: `Delete ${entity}` });
    }, [invoices]);

    const confirmDelete = useCallback(() => {
        if (!confirmation) return;
        const { entity, record } = confirmation;
        if (entity === "client") {
            setClients((current) => current.filter((item) => item.id !== record.id));
            setInvoices((current) => current.filter((item) => item.clientId !== record.id));
            setTransactions((current) => current.filter((item) => item.clientId !== record.id));
        } else if (entity === "invoice") {
            setInvoices((current) => current.filter((item) => item.id !== record.id));
        } else {
            setTransactions((current) => current.filter((item) => item.id !== record.id));
        }
        setConfirmation(null);
        showToast(`${entity[0].toUpperCase()}${entity.slice(1)} deleted.`);
    }, [confirmation, showToast]);

    const markInvoiceSent = useCallback((invoice) => {
        setInvoices((current) => current.map((item) => item.id === invoice.id ? { ...item, status: "Sent" } : item));
        showToast(`${invoice.id} marked as sent. No email was sent.` , "info");
    }, [showToast]);

    const recordPayment = useCallback((invoice) => {
        if (invoice.status === "Paid") {
            showToast(`${invoice.id} is already marked as paid.`, "info");
            return;
        }
        const payment = {
            id: makeId("TX"),
            date: today(),
            description: `${invoice.id} payment`,
            category: "Client payment",
            account: "Operating account",
            amount: Number(invoice.amount),
            status: "Matched",
            invoiceId: invoice.id,
            clientId: invoice.clientId,
        };
        setInvoices((current) => current.map((item) => item.id === invoice.id ? { ...item, status: "Paid" } : item));
        setTransactions((current) => [payment, ...current]);
        showToast(`Payment recorded for ${invoice.id} and added to transactions.`);
    }, [showToast]);

    const updateTransaction = useCallback((transaction, nextStatus) => {
        setTransactions((current) => current.map((item) => item.id === transaction.id ? { ...item, status: nextStatus } : item));
        if (nextStatus === "Matched" && transaction.invoiceId) {
            setInvoices((current) => current.map((item) => item.id === transaction.invoiceId ? { ...item, status: "Paid" } : item));
        }
        showToast(nextStatus === "Matched" ? `${transaction.description} reconciled.` : `${transaction.description} returned to review.`, "success");
    }, [showToast]);

    return (
        <div className={styles.appShell}>
            <Header onNewInvoice={() => openCreate("invoice")} />
            <main className={styles.mainContent} id="main-content">
                <AppRoutes
                    clients={clients}
                    invoices={invoices}
                    transactions={transactions}
                    openCreate={openCreate}
                    openEdit={openEdit}
                    openDetails={openDetails}
                    requestDelete={requestDelete}
                    markInvoiceSent={markInvoiceSent}
                    recordPayment={recordPayment}
                    updateTransaction={updateTransaction}
                    showToast={showToast}
                />
            </main>
            <Footer />
            <ScrollToTop />
            <Toast toast={toast} onDismiss={dismissToast} />
            {dialog && <RecordDialog entity={dialog.entity} mode={dialog.mode} record={dialog.record} clients={clients} onClose={closeDialog} onSave={saveRecord} />}
            {confirmation && <ConfirmDialog {...confirmation} onCancel={() => setConfirmation(null)} onConfirm={confirmDelete} />}
        </div>
    );
};

export default App;
