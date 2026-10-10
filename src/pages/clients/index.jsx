import { useMemo, useState } from "react";
import { FiArrowUpRight, FiBriefcase, FiEdit2, FiMail, FiPlus, FiSearch, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import { downloadCsv, formatCurrency, formatDate } from "../../utils.js";
import styles from "./styles.module.css";

const ClientsPage = ({ clients, invoices, openCreate, openEdit, openDetails, requestDelete, showToast }) => {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(clients[0]?.id || "");

    const filteredClients = useMemo(() => clients.filter((client) => `${client.company} ${client.contact} ${client.email} ${client.sector}`.toLowerCase().includes(query.toLowerCase())), [clients, query]);
    const selected = filteredClients.find((client) => client.id === selectedId) || filteredClients[0] || null;
    const selectedInvoices = selected ? invoices.filter((invoice) => invoice.clientId === selected.id).sort((a, b) => b.issueDate.localeCompare(a.issueDate)) : [];
    const lifetimeBilled = selectedInvoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const openBalance = selectedInvoices.filter((invoice) => invoice.status !== "Paid" && invoice.status !== "Draft").reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    const exportClients = () => {
        const rows = [["Business", "Contact", "Email", "Business type", "Added"], ...filteredClients.map((client) => [client.company, client.contact, client.email, client.sector, client.joined])];
        if (!downloadCsv("folio-clients.csv", rows)) showToast("There are no clients to export.", "info");
        else showToast("Client list exported as CSV.");
    };

    return (
        <section className={styles.page} aria-labelledby="clients-title">
            <div className={styles.breadcrumb}><span>Books</span><span aria-hidden="true">/</span><strong>Clients</strong></div>
            <div className={styles.heading}>
                <div><p className={styles.eyebrow}>PEOPLE & ACCOUNTS</p><h1 id="clients-title">Client book</h1><p className={styles.subtitle}>A clear record of the people and businesses behind your work.</p></div>
                <div className={styles.actions}><button className={styles.exportButton} type="button" onClick={exportClients}>Export client list</button><button className={styles.addButton} type="button" onClick={() => openCreate("client")}><FiPlus aria-hidden="true" /> Add a client</button></div>
            </div>

            <div className={styles.contactDesk}>
                <aside className={styles.directory} aria-label="Client directory">
                    <div className={styles.directoryHead}><div><span className={styles.directoryLabel}>DIRECTORY</span><h2><FiUsers aria-hidden="true" /> Clients <span>{clients.length}</span></h2></div><button className={styles.addSmall} type="button" onClick={() => openCreate("client")} aria-label="Add client"><FiPlus aria-hidden="true" /></button></div>
                    <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.visuallyHidden}>Search client book</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a business or person" /></label>
                    <div className={styles.clientList}>
                        {filteredClients.map((client, index) => {
                            const count = invoices.filter((invoice) => invoice.clientId === client.id).length;
                            return <button type="button" key={client.id} className={selected?.id === client.id ? styles.selectedClient : styles.clientCard} onClick={() => setSelectedId(client.id)} aria-pressed={selected?.id === client.id}>
                                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                                <span className={styles.clientIdentity}><strong>{client.company}</strong><small>{client.contact} · {client.sector || "Business client"}</small></span>
                                <span className={styles.invoiceCount}>{count}<small>{count === 1 ? "invoice" : "invoices"}</small></span>
                            </button>;
                        })}
                        {filteredClients.length === 0 && <div className={styles.emptyList}><FiUser aria-hidden="true" /><strong>No clients found</strong><span>Try a different search.</span><button type="button" onClick={() => setQuery("")}>Clear search</button></div>}
                    </div>
                    <div className={styles.directoryFoot}>Private client details stay in this session.</div>
                </aside>

                {selected ? <article className={styles.profile}>
                    <div className={styles.profileTop}><span className={styles.profileType}><FiBriefcase aria-hidden="true" /> CLIENT ACCOUNT</span><div className={styles.profileActions}><button type="button" onClick={() => openEdit("client", selected)} aria-label={`Edit ${selected.company}`} title="Edit client"><FiEdit2 aria-hidden="true" /></button><button className={styles.deleteButton} type="button" onClick={() => requestDelete("client", selected)} aria-label={`Delete ${selected.company}`} title="Delete client"><FiTrash2 aria-hidden="true" /></button></div></div>
                    <div className={styles.nameBlock}><div className={styles.monogram}>{selected.company.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><h2>{selected.company}</h2><p>{selected.sector || "Independent business"}</p></div></div>
                    <div className={styles.contactLine}><div className={styles.contactIcon}><FiUser aria-hidden="true" /></div><div><span>Primary contact</span><strong>{selected.contact}</strong></div></div>
                    <a className={styles.emailLine} href={`mailto:${selected.email}`}><div className={styles.contactIcon}><FiMail aria-hidden="true" /></div><div><span>Email address</span><strong>{selected.email}</strong></div><FiArrowUpRight aria-hidden="true" /></a>
                    <div className={styles.accountStats}><div><span>Lifetime billed</span><strong>{formatCurrency(lifetimeBilled)}</strong></div><div><span>Open balance</span><strong>{formatCurrency(openBalance)}</strong></div><div><span>Client since</span><strong>{formatDate(selected.joined, { month: "short", year: "numeric" })}</strong></div></div>

                    <div className={styles.invoiceSection}><div className={styles.invoiceHeading}><div><span className={styles.directoryLabel}>ACCOUNT HISTORY</span><h3>Invoices <span>{selectedInvoices.length}</span></h3></div><button type="button" onClick={() => openCreate("invoice", { clientId: selected.id })}><FiPlus aria-hidden="true" /> Create invoice</button></div>
                        {selectedInvoices.length ? <div className={styles.invoiceList}>{selectedInvoices.map((invoice) => <div className={styles.invoiceRow} key={invoice.id}><button className={styles.invoiceName} type="button" onClick={() => openDetails("invoice", invoice)}><strong>{invoice.title}</strong><span>{invoice.id} · due {formatDate(invoice.dueDate)}</span></button><div className={styles.invoiceAmount}><strong>{formatCurrency(invoice.amount)}</strong><span className={styles[invoice.status.toLowerCase()]}>{invoice.status}</span></div></div>)}</div> : <div className={styles.noInvoices}>No invoices for this client yet. Create one to begin their account history.</div>}
                    </div>
                    <div className={styles.profileFoot}>Added to the client book {formatDate(selected.joined, { month: "long", day: "numeric", year: "numeric" })}<button type="button" onClick={() => openDetails("client", selected)}>View full client details <FiArrowUpRight aria-hidden="true" /></button></div>
                </article> : <article className={styles.noSelection}><FiUsers aria-hidden="true" /><h2>Your client book is ready</h2><p>Add a client to create an account record and connect invoices.</p><button className={styles.addButton} type="button" onClick={() => openCreate("client")}><FiPlus aria-hidden="true" /> Add a client</button></article>}
            </div>
        </section>
    );
};

export default ClientsPage;
