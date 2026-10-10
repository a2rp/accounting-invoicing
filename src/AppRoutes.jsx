import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";

const OverviewPage = lazy(() => import("./pages/overview/index.jsx"));
const TransactionsPage = lazy(() => import("./pages/transactions/index.jsx"));
const InvoicesPage = lazy(() => import("./pages/invoices/index.jsx"));
const ClientsPage = lazy(() => import("./pages/clients/index.jsx"));
const ReportsPage = lazy(() => import("./pages/reports/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = (props) => {
    const location = useLocation();

    return (
        <Suspense key={location.pathname} fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<OverviewPage {...props} />} />
                <Route path="/transactions" element={<TransactionsPage {...props} />} />
                <Route path="/invoices" element={<InvoicesPage {...props} />} />
                <Route path="/clients" element={<ClientsPage {...props} />} />
                <Route path="/reports" element={<ReportsPage {...props} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
