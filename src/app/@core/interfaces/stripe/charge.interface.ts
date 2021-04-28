export interface ICharge {
    id: string;
    card: string;
    customer: string;
    created: string;
    status: string;
    receiptUrl: string;
    receiptEmail: string;
    typeOrder: string;
    paid: boolean;
    amount: number;
}