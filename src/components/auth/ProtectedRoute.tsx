import { Navigate, Outlet } from "react-router-dom";

import { tokenStorage } from "../../utils/tokenStorage";

export const ProtectedRoute = () => {
    const accessToken = tokenStorage.get();

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
