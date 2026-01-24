import { InventoryStatusList } from '@/components/InventoryStatusList';

export default function DeliveredPage() {
    return (
        <InventoryStatusList
            status="Delivered"
            title="Delivered - Sales Invoices"
            description="Invoices classified as Sales Invoices are tracked here as delivered inventory."
        />
    );
}
