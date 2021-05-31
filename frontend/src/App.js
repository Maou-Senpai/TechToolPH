import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Axios from "axios";
import UserContext from "../src/components/context/UserContext";
import 'semantic-ui-css/semantic.min.css';

import Navbar from './components/Navbar';
import News from './components/News';
import BuildAPC from "./components/BuildAPC";
import MyBuilds from './components/MyBuilds';
import ViewMyBuild from './components/ViewMyBuild';
import Admin from './components/Admin';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import UserBuilds from './components/admin/UserBuilds';


import './resources/sb-admin-2.css';

function App() {
    const [userData, setUserData] = useState({
            token: undefined,
            user: undefined,
        }
    );

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post(
                "http://localhost:5000/user/tokenIsValid",
                null,
                { headers: { "x-auth-token": token } }
            );
            if (tokenRes.data) {
                const userRes = await Axios.get("http://localhost:5000/user/", {
                    headers: { "x-auth-token": token },
                });
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        };

        checkLoggedIn();
    }, []);

    return (
        <Router>
            <UserContext.Provider value={{userData,setUserData}}>
            <div style={{display: "flex"}}>
                <Navbar />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/news" component={News} />
                <Route path={['/build-pc/:id','/build-pc']} component={BuildAPC} />
                <Route path='/my-builds' component={MyBuilds} />
                <Route path='/my-builds/:id' component={ViewMyBuild} />

                <Route path='/admin-settings' component={Admin} />
                <Route path='/view/:id' component={UserBuilds} />


            </div>
            </UserContext.Provider>
        </Router>
    );
}

export default App;