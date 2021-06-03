import React, { useState, useContext } from "react";
import {Link, useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";
import Axios from "axios";
import ErrorNotice from "./ErrorNotice";
import checkLoggedIn from "./UserAuth";
import {Button} from 'semantic-ui-react';

export default function Account(props) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [error, setError] = useState();

    const { userData, setUserData } = useContext(UserContext);

    const baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    const submit =async (e) => {
        e.preventDefault();

        try {
            const newUser = { username, password, passwordCheck };
            console.log(newUser)

            await Axios.post(baseURL + "/user/update/"+props.match.params.id, newUser);

            const data = await checkLoggedIn();
            setUserData({
                token: data.token,
                user: data.user
            })

            console.log(userData)
            alert("Account updated!")
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page" style={{marginLeft: "20rem",marginTop:"5rem"}}>
            <form className="form" onSubmit={submit}>
                <h3>Edit Credentials</h3>
                {error && (
                    <ErrorNotice message={error} clearError={() => setError(undefined)} />
                )}
                <div className="form-group">
                    <label htmlFor="edit-username">Username </label>
                    <input id="edit-username" type="username" className="form-control" placeholder={userData.user?(userData.user.username):("Username")}
                           onChange={(e) => setUsername(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="edit-password">Password</label>
                    <input type="password" className="form-control" placeholder="Enter new password"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="form-group">
                    <input htmlFor="edit-password"  id="edit-password" type="password" className="form-control" placeholder="Verify password"
                           onChange={(e) => setPasswordCheck(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-dark btn-lg btn-block">Change</button>
            </form>
            <label className="page" style={{marginTop: "2rem"}}>*Leave the fields you dont want to change</label>
            <div style={{marginTop:"2rem"}}>
            <Link to={"/account/delete/"+props.match.params.id}><Button>Delete Account</Button></Link>
            </div>
        </div>
    );
}