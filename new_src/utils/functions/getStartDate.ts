// if no year given -> it will take current year

export const getStartDate = (year?: number) => {
    if (year) return new Date(year, 0, 1).getTime()

    return new Date(new Date().getFullYear(), 0, 1).getTime()
}