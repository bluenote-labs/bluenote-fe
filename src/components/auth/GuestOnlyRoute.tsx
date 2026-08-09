import { Navigate, Outlet } from "react-router-dom";

import { tokenStorage } from "../../utils/tokenStorage";

export const GuestOnlyRoute = () => {
    const accessToken = tokenStorage.get();

    if (accessToken) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};
