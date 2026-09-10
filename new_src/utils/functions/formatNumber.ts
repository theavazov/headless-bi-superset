export const formatAmount = (value: number): string => {
    const abs = Math.abs(value);

    const format = (num: number) => {
        return Number.isInteger(num)
            ? num.toString()
            : num.toFixed(1).replace('.', ',');
    };

    if (abs >= 1_000_000_000) {
        return `${format(value / 1_000_000_000)} млрд`;
    }

    if (abs >= 1_000_000) {
        return `${format(value / 1_000_000)} млн`;
    }

    if (abs >= 1_000) {
        return `${format(value / 1_000)} тыс`;
    }

    return value.toLocaleString('ru-RU');
};