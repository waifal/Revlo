export default function formatCurrency(amount = 0.00, locales = "en-US", currency = "USD") {
    if(typeof amount !== "number") {
        throw new TypeError(`${amount} has an invalid data type! Expected 'number'`);
    }

    const format = new Intl.NumberFormat(locales, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return format.format(amount);
}