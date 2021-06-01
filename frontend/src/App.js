import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Axios from "axios";
import UserContext from "../src/components/context/UserContext";
import 'semantic-ui-css/semantic.min.css';

import Navbar from './components/Navbar';
import News from './components/News';
import BuildAPC from './components/BuildAPC';
import MyBuilds from './components/MyBuilds';
import Admin from './components/Admin';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import './resources/sb-admin-2.css';
import ViewMyBuild from "./components/ViewMyBuild";
import UserBuilds from "./components/admin/UserBuilds";
import Account from './components/auth/Account';
import Delete from './components/auth/Delete';

function App() {
    const [userData, setUserData] = useState({
            token: undefined,
            user: undefined,
        }
    );

    const baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post(
                baseURL + "/user/tokenIsValid",
                null,
                { headers: { "x-auth-token": token } }
            );
            if (tokenRes.data) {
                const userRes = await Axios.get(baseURL + "/user/", {
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
                <Route path="/" exact={true} component={News} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/news" component={News} />
                <Route path={['/build-pc/:id','/build-pc']} component={BuildAPC} />
                <Route path='/my-builds' component={MyBuilds} />
                <Route path='/my-builds/:id' component={ViewMyBuild} />
                <Route path='/admin-settings' component={Admin} />
                <Route path='/view/:id' component={UserBuilds} />
                <Route path='/account/:id' component={Account} />
                <Route path='/account/delete/:id' component={Delete}/>
            </div>
            </UserContext.Provider>
        </Router>
    );
}

export default App;