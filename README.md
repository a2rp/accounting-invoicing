![Folio Books overview showing monthly cash movement, reconciliation tasks, and invoice follow-up](./screenshot.png)

# Folio Books

Folio Books is a calm bookkeeping workspace for independent businesses. It brings client invoices, bank activity, reconciliation, and cash reports into one focused frontend.

**Live app:** [https://a2rp.github.io/accounting-invoicing/](https://a2rp.github.io/accounting-invoicing/)

## What is included

- **Overview:** Current-month cash movement, a seven-day chart, recent ledger entries, transactions awaiting reconciliation, and invoice follow-up.
- **Transactions:** Search and filter bank activity by category or match status. Add, edit, inspect, reconcile, undo a match, delete with confirmation, and export the current view as CSV.
- **Invoices:** Search and filter the invoice register by status. Create, edit, inspect, mark a draft as sent, record a payment, delete with confirmation, and export the current view as CSV.
- **Clients:** Search the client book, inspect client contact details and invoice history, create or edit a client, create an invoice for the selected client, and export the current directory.
- **Reports:** Choose a reporting period and switch between cash-flow and expense-category views. The report totals update from current transactions and can be exported as CSV.
- **Shared interface:** Responsive navigation, route scroll reset, accessible loading state, focused dialogs, validation feedback, custom notifications, and the Folio footer.

## How the demo behaves

Records use React state in the current page session. Creating, editing, deleting, recording payments, and reconciling transactions update the connected pages and report totals. Reloading the app restores the starter records. The app does not use browser storage, a backend, a bank feed, an email service, or a payment processor.

Marking an invoice as sent only changes its demo status; it does not send email. Recording payment updates the invoice and adds a linked transaction in the demo. CSV exports download from the browser. Deleting a client removes its invoices and keeps its bank transactions in the ledger without the client link. Deleting an invoice keeps its bank activity and clears the invoice link.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. With the configured base path it is usually `http://localhost:5173/accounting-invoicing/`.

```bash
npm run lint
npm run build
npm run deploy
```

`npm run deploy` builds the app, creates the GitHub Pages `404.html` fallback, and publishes `dist` to the `gh-pages` branch.

## Screenshots

The first image is the current desktop overview. The galleries below show every app route, the report's alternate view, the responsive route layouts, and each create, edit, detail, and delete-confirmation dialog.

### Desktop pages

| Page | Screenshot |
| --- | --- |
| Overview workbench | ![Desktop overview with cash movement and follow-up panels](./screenshots/pages/overview.png) |
| Transaction ledger | ![Desktop transactions page with account activity filters](./screenshots/pages/transactions.png) |
| Invoice register | ![Desktop invoice register with status filters and record actions](./screenshots/pages/invoices.png) |
| Client book | ![Desktop client directory and selected client account](./screenshots/pages/clients.png) |
| Financial report | ![Desktop cash-flow report and monthly summary](./screenshots/pages/reports.png) |
| Expense categories report | ![Desktop report with expenses grouped by category](./screenshots/pages/reports-categories.png) |

### Mobile pages

| Page | Screenshot |
| --- | --- |
| Overview | ![Mobile overview dashboard](./screenshots/pages/mobile-overview.png) |
| Transactions | ![Mobile transaction ledger with its own horizontal table scrolling](./screenshots/pages/mobile-transactions.png) |
| Invoices | ![Mobile invoice register with its own horizontal table scrolling](./screenshots/pages/mobile-invoices.png) |
| Clients | ![Mobile client book](./screenshots/pages/mobile-clients.png) |
| Reports | ![Mobile financial report](./screenshots/pages/mobile-reports.png) |

### Dialogs

| Dialog | Screenshot |
| --- | --- |
| New invoice | ![Invoice creation form with dates, client, amount, and notes](./screenshots/modals/invoice-create.png) |
| Edit invoice | ![Invoice edit form](./screenshots/modals/invoice-edit.png) |
| Invoice details | ![Invoice detail dialog](./screenshots/modals/invoice-details.png) |
| Delete invoice confirmation | ![Custom confirmation before deleting an invoice](./screenshots/modals/delete-confirmation.png) |
| New client | ![Client creation form](./screenshots/modals/client-create.png) |
| Edit client | ![Client edit form](./screenshots/modals/client-edit.png) |
| Client details | ![Client details dialog](./screenshots/modals/client-details.png) |
| Delete client confirmation | ![Confirmation explaining that invoices are removed and bank activity remains in the ledger](./screenshots/modals/client-delete-confirmation.png) |
| New transaction | ![Transaction creation form](./screenshots/modals/transaction-create.png) |
| Edit transaction | ![Transaction edit form](./screenshots/modals/transaction-edit.png) |
| Transaction details | ![Transaction details dialog](./screenshots/modals/transaction-details.png) |
| Delete transaction confirmation | ![Custom confirmation before deleting a bank transaction](./screenshots/modals/transaction-delete-confirmation.png) |

## Future improvements

These are service-side extensions; the current frontend workflow is implemented with demo records.

- Connect records to a shared API with team accounts and permission levels.
- Add authenticated bank feeds and scheduled transaction synchronization.
- Connect invoice delivery to an email provider and payment links to a payment processor.
- Add secure hosted storage for receipts and invoice attachments.
- Keep a server-side audit history for changes made by different team members.
- Add configurable tax rules, invoice numbering policies, and organization-specific report settings.

## Image credit

The bookkeeping desk image is by [FIN on Unsplash](https://unsplash.com/photos/a-calculator-sitting-on-top-of-a-pile-of-papers-741iShluYhk) and is served from the local `public/bookkeeping-ledger.webp` asset under the [Unsplash License](https://unsplash.com/license).

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
