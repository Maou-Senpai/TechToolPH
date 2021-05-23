import React, {useState} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyBuilds from './pages/MyBuilds';
import News from './pages/News';
import BuildAPC from './pages/BuildAPC';
import Admin from './pages/Admin';
import Register from './components/Auth/Register';
import UserContext from "./components/context/UserContext";

function App() {
    const [userData, setUserData] = useState({
            token: undefined,
            user: undefined,
        }
    );

    return (
        <>
            <Router>
                <UserContext.Provider value={{userData,setUserData}}>
                    <Switch>
                        <Route path='/' exact component={Register} />
                        <Route path='/my builds' exact component={MyBuilds} />
                        <Route path='/news' component={News} />
                        <Route path='/build a pc' component={BuildAPC} />
                        <Route path='/admin settings' component={Admin}/>
                    </Switch>
                </UserContext.Provider>

            </Router>
        </>
    );
}

export default App;