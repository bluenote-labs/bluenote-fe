import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/HomePage";
import { LandingPage } from "../pages/LandingPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PatternsPage } from "../pages/PatternsPage";
import { RecordDetailPage } from "../pages/RecordDetailPage";
import { RecordsPage } from "../pages/RecordsPage";
import { RecordRefinePage } from "../pages/RecordRefinePage";
import { KakaoCallbackPage } from "../pages/KakaoCallbackPage";
import { GuestOnlyRoute } from "../components/auth/GuestOnlyRoute";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { RecordWritePage } from "../pages/RecordWritePage";

export const router = createBrowserRouter([
    {
        element: <GuestOnlyRoute />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
        ],
    },
    {
        path: "auth/kakao/callback",
        element: <KakaoCallbackPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: "/home",
                        element: <HomePage />,
                    },
                    {
                        path: "/write",
                        element: <RecordWritePage />,
                    },
                    {
                        path: "/write/refine",
                        element: <RecordRefinePage />,
                    },
                    {
                        path: "/records",
                        element: <RecordsPage />,
                    },
                    {
                        path: "/records/:recordId",
                        element: <RecordDetailPage />,
                    },
                    {
                        path: "/patterns",
                        element: <PatternsPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
