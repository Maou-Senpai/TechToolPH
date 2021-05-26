import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
import './form.css';

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { username, password };
            const loginRes = await Axios.post(
                "http://localhost:5000/user/login",
                loginUser
            );
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            localStorage.setItem("user", loginRes.data.user);
            console.log("hello")
            history.push("/news");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };
    return (
        <div className="page" style={{marginLeft: "20rem",marginTop:"5rem"}}>
            <h2>Log in</h2>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} />
            )}
            <form className="form" onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="login-username">Username</label>
                    <input id="login-username"
                           type="username"
                           className="form-control"
                           placeholder="Enter username"
                           onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password"
                           type="password"
                           className="form-control"
                           placeholder="Enter password"
                           onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <input type="submit" className="btn btn-dark btn-lg btn-block" value="Log in" />
            </form>

        </div>

    );
}