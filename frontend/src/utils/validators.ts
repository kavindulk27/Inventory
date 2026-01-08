export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};
