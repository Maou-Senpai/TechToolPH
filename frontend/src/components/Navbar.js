import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import GavelIcon from '@material-ui/icons/Gavel';
import InboxIcon from '@material-ui/icons/Inbox';
import SettingsIcon from '@material-ui/icons/Settings';
import AuthOptions from "../components/Auth/Auth";

export default class Navbar extends Component {

    render() {
        return(
            <ul id="sidebar" className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">

                <Link to="/news" className="sidebar-brand d-flex align-items-center justify-content-center">
                    <div className="sidebar-brand-text mx-3">TechToolPH</div>
                </Link>

                <hr className="sidebar-divider my-0" />

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
                        <span style={{margin: 30}}>My Builds</span>
                    </Link>
                </li>
                <li className="nav-item" style={{marginLeft: 10}}>
                    <Link to="/admin-settings" className="nav-link">
                        <SettingsIcon />
                        <span style={{margin: 30}}>Admin Settings</span>
                    </Link>
                </li>
                <AuthOptions/>
            </ul>
        )
    }
}