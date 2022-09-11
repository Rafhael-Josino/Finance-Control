interface IDateProvider {
    formatDateCustom(date: Date): string;
    addDays(days: number): string;
}

export { IDateProvider }