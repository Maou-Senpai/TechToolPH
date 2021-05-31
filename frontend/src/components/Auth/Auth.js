import React, { useContext } from "react";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../context/UserContext";
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function AuthOptions() {
    const { userData, setUserData } = useContext(UserContext);

    const history = useHistory();

    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const logout = () => {
        history.push("/news")
        setUserData({
            token: undefined,
            user: undefined,
        });
        localStorage.setItem("auth-token", "");
        localStorage.setItem("user", "");
    };

    function loggedIn() {
        let components = [];

        if (userData.user.username === "admin") components.push(
            <li className="nav-item" style={{marginLeft: 10}}>
                <Link to="/admin-settings" className="nav-link">
                    <SettingsIcon />
                    <span style={{margin: 30}}>Admin Settings</span>
                </Link>
            </li>
        );

        components.push(
            <hr className="sidebar-divider my-2" style={{color: "white", height: 3}}/>
        );

        components.push(
            <li className="nav-item" style={{marginLeft: 10}}>
                <div style={{cursor: "pointer"}} className="nav-link" onClick={logout}>
                    <ExitToAppIcon />
                    <span style={{margin: 30}}>Log Out</span>
                </div>
            </li>
        );

        return components
    }

    let rtn = [];

    if (userData.user) rtn.push(loggedIn());
    else {
        rtn.push(
            <hr className="sidebar-divider my-2" style={{color: "white", height: 3}}/>
        );
        rtn.push(
            <li className="nav-item" style={{marginLeft: 10}}>
                <div style={{cursor: "pointer"}} className="nav-link" onClick={register}>
                    <ExitToAppIcon />
                    <span style={{margin: 30}}>Register</span>
                </div>
            </li>
        );
        rtn.push(
            <li className="nav-item" style={{marginLeft: 10}}>
                <div style={{cursor: "pointer"}} className="nav-link" onClick={login}>
                    <ExitToAppIcon />
                    <span style={{margin: 30}}>Log In</span>
                </div>
            </li>
        )
    }

    return rtn;
}