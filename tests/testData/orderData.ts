export type OrderInfo = {
    name: string;
    country: string;
    city: string;
    creditCard: string;
    month: string;
    year: string;
};

export function buildOrderInfo(): OrderInfo {
    return {
        name: `Yurima_${Date.now()}`,
        country: 'US',
        city: 'CA',
        creditCard: '4688182952119973',
        month: '02',
        year: '2032',
    };
}
