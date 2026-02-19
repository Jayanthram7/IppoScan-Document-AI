import { AnomalyList } from '@/components/AnomalyList';

export default function AnomaliesPage() {
    return (
        <AnomalyList
            title="Anomalies"
            description="Invoices flagged as Potential Fraud or requiring review."
        />
    );
}
