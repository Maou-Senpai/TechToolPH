import React, {useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import News from './components/News';
import BuildAPC from './components/BuildAPC';
import MyBuilds from './components/MyBuilds';
import Admin from './components/Admin';

import './resources/sb-admin-2.css';

function App() {
    const [userData, setUserData] = useState({
            token: undefined,
            user: undefined,
        }
    );

    return (
        <Router>
            {/*<UserContext.Provider value={{userData,setUserData}}>*/}
            <Redirect from='/' to='news' />
            <div style={{display: "flex"}}>
                <Navbar />
                {/*<Route path='/' exact component={Register} />*/}
                <Route path='/news' component={News} />
                <Route path='/build-pc' component={BuildAPC} />
                <Route path='/my-builds' component={MyBuilds} />
                <Route path='/admin-settings' component={Admin} />
            </div>
            {/*</UserContext.Provider>*/}
        </Router>
    );
}

export default App;