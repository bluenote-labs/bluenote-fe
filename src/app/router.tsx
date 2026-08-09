import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "../pages/HomePage";
import { LandingPage } from "../pages/LandingPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PatternsPage } from "../pages/PatternsPage";
import { RecordDetailPage } from "../pages/RecordDetailPage";
import { RecordsPage } from "../pages/RecordsPage";
import { RefinePage } from "../pages/RefinePage";
import { WritePage } from "../pages/WritePage";
import { KakaoCallbackPage } from "../pages/KakaoCallbackPage";
import { GuestOnlyRoute } from "../components/auth/GuestOnlyRoute";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

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
                        element: <WritePage />,
                    },
                    {
                        path: "/write/refine",
                        element: <RefinePage />,
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
