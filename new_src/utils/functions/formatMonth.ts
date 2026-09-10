export const formatMonth = (timestamp: number) => {
    const date = new Date(timestamp);

    const month = new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
    })
        .format(date)
        .slice(0, 3);

    const year = date.getFullYear().toString().slice(-2);

    return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
};