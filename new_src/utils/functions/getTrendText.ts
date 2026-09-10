export const getTrendText = (percent: number): string => {
    if (percent > 0) {
        return `+${percent.toFixed(1)}% к пред. мес.`;
    }

    if (percent < 0) {
        return `${percent.toFixed(1)}% к пред. мес.`;
    }

    return "Без изменений";
}