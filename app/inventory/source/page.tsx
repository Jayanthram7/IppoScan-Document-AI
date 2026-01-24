import { InventoryStatusList } from '@/components/InventoryStatusList';

export default function SourcePage() {
    return (
        <InventoryStatusList
            status="Source"
            title="Source - Purchase Orders"
            description="Invoices classified as Purchase Orders are tracked here as source inventory."
        />
    );
}
