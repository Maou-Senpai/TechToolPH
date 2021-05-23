import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyBuilds from './pages/MyBuilds';
import News from './pages/News';
import BuildAPC from './pages/BuildAPC';
import Admin from './pages/Admin';

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Switch>
                    <Route path='/my builds' exact component={MyBuilds} />
                    <Route path='/news' component={News} />
                    <Route path='/build a pc' component={BuildAPC} />
                    <Route path='/admin settings' component={Admin}/>
                </Switch>
            </Router>
        </>
    );
}

export default App;
