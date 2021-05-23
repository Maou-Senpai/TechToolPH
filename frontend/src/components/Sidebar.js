import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io'
import * as GiIcons from "react-icons/gi";



export const Sidebar = [
    {
        title: 'News',
        path: '/news',
        icon: <AiIcons.AiFillPieChart/>,
        cName: 'nav-text'
    },
    {
        title: 'Build a PC',
        path: '/build a pc',
        icon: <GiIcons.GiComputerFan/>,
        cName: 'nav-text'
    },
    {
        title: 'My Builds',
        path: '/my builds',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Admin Settings',
        path: '/admin settings',
        icon: <AiIcons.AiFillSetting />,
        cName: 'nav-text'
    }
];