export function formatCurrencyVND(amount: number): string {
    if (isNaN(amount)) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}
