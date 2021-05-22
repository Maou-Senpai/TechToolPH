import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './Navbar.css';
import { IconContext } from 'react-icons';
import * as FaIcons from "react-icons/fa"

function Navbar() {
    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <nav className='logo'>
                <h1>
                    <FaIcons.FaAdjust/>
                    <span>TechToolsPh</span>
                </h1>
            </nav>
            <nav className='nav-menu'>
                <ul className='nav-menu-items' >
                    {Sidebar.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
    );
}

export default Navbar;