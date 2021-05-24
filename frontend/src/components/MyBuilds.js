import React,{useContext} from 'react';
import UserContext from "../components/context/UserContext";
import {Link} from "react-router-dom";

function MyBuilds() {
    const { userData } = useContext(UserContext);

    return (
        <div className='MyBuilds'>
            <center>      {userData.user ? (
                <h1>Welcome {userData.user.username}</h1>
            ) : (
                <>
                    <h2>You are not logged in</h2>
                    <Link to="/login">Log in</Link>
                </>
            )}</center>
        </div>
    );
}

export default MyBuilds;