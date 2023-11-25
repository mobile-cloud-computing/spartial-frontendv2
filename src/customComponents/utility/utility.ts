export const Utility = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toUTCString();
};
