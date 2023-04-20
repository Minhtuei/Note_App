import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = React.useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged((user) => {
            console.log("[From AuthProvider]", { user });
            if (user?.uid) {
                setUser(user);
                if (user.accessToken !== localStorage.getItem("accessToken")) {
                    window.location.reload();
                    localStorage.setItem("accessToken", user.accessToken);
                }
                setIsLoading(false);
                return;
            }
            setUser({});
            setIsLoading(false);
            localStorage.clear();
            navigate("/login");
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {isLoading ? <CircularProgress /> : children}
        </AuthContext.Provider>
    );
}
