import { InventoryStatusList } from '@/components/InventoryStatusList';

export default function TransitPage() {
    return (
        <InventoryStatusList
            status="Transit"
            title="Transit"
            description="Invoices currently in transit."
        />
    );
}
