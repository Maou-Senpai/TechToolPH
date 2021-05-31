import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import GavelIcon from '@material-ui/icons/Gavel';
import InboxIcon from '@material-ui/icons/Inbox';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import AuthOptions from "./auth/Auth";
import UserContext from "../components/context/UserContext";

export default function Navbar(){
    const { userData } = useContext(UserContext);

    return(
        <ul id="sidebar" className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">

            <Link to="/news" className="sidebar-brand d-flex align-items-center justify-content-center">
                <div className="sidebar-brand-text mx-3">TechToolPH</div>
            </Link>

            <hr className="sidebar-divider my-2" style={{color: "white", height: 3}}/>

            <li className="nav-item" style={{marginLeft: 10}}>
                <Link to="/news" className="nav-link">
                    <LibraryBooksIcon />
                    <span style={{margin: 30}}>News</span>
                </Link>
            </li>
            <li className="nav-item" style={{marginLeft: 10}}>
                <Link to="/build-pc" className="nav-link">
                    <GavelIcon />
                    <span style={{margin: 30}}>Build a PC</span>
                </Link>
            </li>
            <li className="nav-item" style={{marginLeft: 10}}>
                <Link to="/my-builds" className="nav-link">
                    <InboxIcon />
                    <span style={{margin: 30}} >My Builds</span>
                </Link>
            </li>
            <AuthOptions/>

            <hr className="sidebar-divider my-2" style={{color: "white", height: 3}}/>

            <li className="nav-item" style={{marginLeft: 10, marginTop:10}}>
            {userData.user?(
                <>
                <AccountCircleRoundedIcon style={{marginLeft: 20}} />
                <span className="sidebar-brand-text mx-3" style={{color:'white'}} >{userData.user.username}</span>
                </>
            ):(
                <>
                    <h2 className="sidebar-brand-text mx-3" style={{color:'white'}}>Welcome Guest!</h2>
                </>
            )}
            </li>

        </ul>
    )
}