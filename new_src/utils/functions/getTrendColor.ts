export const getTrendColor = (percent: number, dir: 'normal' | 'reversal'): string => {
    if (dir === 'normal') {
        if (percent > 0) {
            return "#A8B86A";
        }

        if (percent < 0) {
            return "#C96A4A";
        }
    }

    if (dir === 'reversal') {
        if (percent > 0) {
            return "#C96A4A";
        }

        if (percent < 0) {
            return "#A8B86A";
        }
    }

    return "#7E7460";
}