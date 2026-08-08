import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
    {
        label: "홈",
        to: "/home",
        end: true,
    },
    {
        label: "나의 글",
        to: "/records",
        end: false,
    },
    {
        label: "나의 패턴",
        to: "/patterns",
        end: false,
    },
];

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-background text-body">
            <header className="border-b border-divider">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-8">
                    <NavLink
                        to="/home"
                        end
                        className="text-lg font-semibold text-foreground"
                    >
                        BLUE NOTE
                    </NavLink>

                    <nav aria-label="주요 메뉴">
                        <ul className="flex items-center gap-1 sm:gap-3">
                            {navigationItems.map((item) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            [
                                                "inline-flex rounded-button px-3 py-2 text-sm transition-colors",
                                                isActive
                                                    ? "bg-primary-subtle font-semibold text-primary-hover"
                                                    : "font-medium text-muted hover:bg-surface-hover hover:text-foreground",
                                            ].join(" ")
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};
