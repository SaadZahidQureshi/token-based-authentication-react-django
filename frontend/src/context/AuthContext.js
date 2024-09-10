import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode"; // Corrected import
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null);
    let [user, setUser] = useState(() => authTokens ? jwtDecode(authTokens.access) : null);
    let navigate = useNavigate();
    let [loading, setLoading] = useState(true)
    let fourMinutes = 1000 * 60 * 4;


    useEffect(() => {
        if (!loading && authTokens) {
            setUser(jwtDecode(authTokens.access));
            let interval = setInterval(() => {
                updateToken();
            }, fourMinutes);
    
            return () => clearInterval(interval);
        } else if (!authTokens) {
            setUser(null);
            navigate("/login");
        } else if (loading) {
            updateToken();
            setLoading(false);
        }
    }, [authTokens, navigate, loading]);
    

    let loginUser = async (e) => {
        e.preventDefault();
        let data = {
            "username": e.target.username.value,
            "password": e.target.password.value,
        };
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let response_data = await response.json();
        if (response.status === 200) {
            setAuthTokens(response_data);
            setUser(jwtDecode(response_data.access));
            localStorage.setItem("authTokens", JSON.stringify(response_data));
            navigate("/");
        } else {
            alert("Error", response);
        }
    };

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
    };

    let updateToken = async () => {
        console.log("update token called");
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refresh: authTokens?.refresh})
        });

        let response_data = await response.json();
        if (response.status === 200) {
            setAuthTokens(response_data);
            setUser(jwtDecode(response_data.access));
            localStorage.setItem("authTokens", JSON.stringify(response_data));
        } else {
            logoutUser();
        }

        if (loading){
            setLoading(false)
        }
    };

    let contextData = {
        user: user,
        authTokens:authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
