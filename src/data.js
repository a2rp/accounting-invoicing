export const initialClients = [
    { id: "cl-101", company: "Willow & Thread", contact: "Mara Ellis", email: "mara@willowthread.co", sector: "Textile design", joined: "2026-02-14" },
    { id: "cl-102", company: "Juniper House", contact: "Owen Parker", email: "owen@juniperhouse.io", sector: "Interior design", joined: "2026-03-08" },
    { id: "cl-103", company: "Northline Studio", contact: "Priya Sen", email: "priya@northline.studio", sector: "Architecture", joined: "2026-05-20" },
    { id: "cl-104", company: "Common Ground", contact: "Eli Navarro", email: "eli@commonground.org", sector: "Community services", joined: "2026-06-02" },
    { id: "cl-105", company: "Brightwood Goods", contact: "Nia Harper", email: "nia@brightwoodgoods.com", sector: "Retail", joined: "2026-07-17" },
];

export const initialInvoices = [
    { id: "INV-2408", clientId: "cl-102", title: "Studio consultation", amount: 2850, issueDate: "2026-10-03", dueDate: "2026-10-17", status: "Sent", notes: "Phase one planning" },
    { id: "INV-2407", clientId: "cl-101", title: "Autumn collection artwork", amount: 4200, issueDate: "2026-10-01", dueDate: "2026-10-15", status: "Overdue", notes: "Final illustration set" },
    { id: "INV-2406", clientId: "cl-103", title: "Permit review", amount: 1750, issueDate: "2026-09-28", dueDate: "2026-10-12", status: "Sent", notes: "Northline renovation" },
    { id: "INV-2405", clientId: "cl-105", title: "Packaging design", amount: 3100, issueDate: "2026-09-21", dueDate: "2026-10-05", status: "Paid", notes: "Retail launch assets" },
    { id: "INV-2404", clientId: "cl-104", title: "Program materials", amount: 980, issueDate: "2026-09-18", dueDate: "2026-10-02", status: "Paid", notes: "Workshop print run" },
    { id: "INV-2403", clientId: "cl-102", title: "Space planning", amount: 2200, issueDate: "2026-09-10", dueDate: "2026-09-24", status: "Draft", notes: "Second floor layout" },
];

export const initialTransactions = [
    { id: "TX-8041", date: "2026-10-10", description: "Maple Street Print Co.", category: "Printing", account: "Operating account", amount: -284.75, status: "Needs review", invoiceId: "" },
    { id: "TX-8040", date: "2026-10-10", description: "Willow & Thread project deposit", category: "Client payment", account: "Operating account", amount: 4200, status: "Matched", invoiceId: "" },
    { id: "TX-8039", date: "2026-10-09", description: "October studio rent", category: "Rent", account: "Operating account", amount: -1450, status: "Matched", invoiceId: "" },
    { id: "TX-8038", date: "2026-10-08", description: "Juniper House retainer", category: "Client payment", account: "Operating account", amount: 1650, status: "Needs review", invoiceId: "" },
    { id: "TX-8037", date: "2026-10-07", description: "West End Supply", category: "Materials", account: "Business card", amount: -196.42, status: "Needs review", invoiceId: "" },
    { id: "TX-8036", date: "2026-10-06", description: "Cloudline software", category: "Software", account: "Business card", amount: -48, status: "Matched", invoiceId: "" },
    { id: "TX-8035", date: "2026-10-05", description: "Northline Studio deposit", category: "Client payment", account: "Operating account", amount: 2200, status: "Matched", invoiceId: "" },
    { id: "TX-8034", date: "2026-10-03", description: "Harbor Electric", category: "Utilities", account: "Operating account", amount: -132.6, status: "Matched", invoiceId: "" },
    { id: "TX-8033", date: "2026-10-01", description: "Brightwood Goods payment", category: "Client payment", account: "Operating account", amount: 3100, status: "Matched", invoiceId: "INV-2405" },
];

export const invoiceStatuses = ["Draft", "Sent", "Paid", "Overdue"];
export const transactionCategories = ["Client payment", "Materials", "Printing", "Rent", "Software", "Utilities", "Travel", "Other"];

export const makeId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;
