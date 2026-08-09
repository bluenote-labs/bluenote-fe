const ACCESS_TOKEN_KEY = "accessToken";

export const tokenStorage = {
    get: () => localStorage.getItem(ACCESS_TOKEN_KEY),

    set: (accessToken: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    },

    remove: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};
