 export const ConvertTimeStamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toUTCString();
};
