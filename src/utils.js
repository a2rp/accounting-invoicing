export const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

export const formatDate = (value, options = { month: "short", day: "numeric" }) => {
    if (!value) return "-";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime())
        ? "-"
        : new Intl.DateTimeFormat("en-US", options).format(date);
};

export const getClient = (clients, id) => clients.find((client) => client.id === id);

export const getClientName = (clients, id) => getClient(clients, id)?.company ?? "Former client";

export const downloadCsv = (filename, rows) => {
    if (!rows.length) return false;
    const content = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    return true;
};

export const startOfMonth = (value) => {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
};
