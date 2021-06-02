import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";
import Axios from "axios";
import ErrorNotice from "./ErrorNotice";

export default function Register() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    const submit = async (e) => {
        e.preventDefault();

        try {
            const newUser = { username, password, passwordCheck };
            await Axios.post(baseURL + "/user/signup", newUser);
            const loginRes = await Axios.post(baseURL + "/user/login", {
                username,
                password,
            });
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            history.push("/");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page" style={{marginLeft: "20rem",marginTop:"5rem"}}>
            <form className="form" onSubmit={submit}>
                <h3>Register</h3>
                {error && (
                    <ErrorNotice message={error} clearError={() => setError(undefined)} />
                )}
                <div className="form-group">
                    <label htmlFor="register-username">Username</label>
                    <input id="register-username" type="usename" className="form-control" placeholder="Enter username"
                           onChange={(e) => setUsername(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input type="password" className="form-control" placeholder="Enter password"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="form-group">
                    <input htmlFor="register-password"  id="register-password" type="password" className="form-control" placeholder="Verify password"
                           onChange={(e) => setPasswordCheck(e.target.value)}/>
                </div>


                <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
            </form>
        </div>
    );
}