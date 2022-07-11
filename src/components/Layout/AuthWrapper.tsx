import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const protectedRoute: string[] = ["/dashboard", "/user"];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <>
                <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-[#333] z-50">
                    <svg
                        className="w-20 h-auto"
                        width="45"
                        height="45"
                        viewBox="0 0 45 45"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#fff"
                    >
                        <g
                            fill="none"
                            fillRule="evenodd"
                            transform="translate(1 1)"
                            strokeWidth="2"
                        >
                            <circle cx="22" cy="22" r="6" strokeOpacity="0">
                                <animate
                                    attributeName="r"
                                    begin="1.5s"
                                    dur="3s"
                                    values="6;22"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-opacity"
                                    begin="1.5s"
                                    dur="3s"
                                    values="1;0"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-width"
                                    begin="1.5s"
                                    dur="3s"
                                    values="2;0"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle cx="22" cy="22" r="6" strokeOpacity="0">
                                <animate
                                    attributeName="r"
                                    begin="3s"
                                    dur="3s"
                                    values="6;22"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-opacity"
                                    begin="3s"
                                    dur="3s"
                                    values="1;0"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-width"
                                    begin="3s"
                                    dur="3s"
                                    values="2;0"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle cx="22" cy="22" r="8">
                                <animate
                                    attributeName="r"
                                    begin="0s"
                                    dur="1.5s"
                                    values="6;1;2;3;4;5;6"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </g>
                    </svg>
                </div>
                {children}
            </>
        );
    }

    if (protectedRoute.includes(router.pathname)) {
        return <ProtectedRoute>{children}</ProtectedRoute>;
    }

    return <>{children}</>;
};

export default AuthWrapper;
