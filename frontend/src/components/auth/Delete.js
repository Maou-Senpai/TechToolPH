import {Button, Modal} from 'semantic-ui-react';
import axios from 'axios';
import '../../resources/Modal.css';
import {Link, useHistory} from "react-router-dom";
import React, { useContext } from "react";
import UserContext from "../context/UserContext";

export default function Delete(props){
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    const deleteAccount = async () =>{
        try{
            await axios.delete(baseURL + '/user/delete/' + props.match.params.id);
            setUserData({
                token: undefined,
                user: undefined,
            });
            localStorage.setItem("auth-token", "");
            localStorage.setItem("user", "");

            history.push('/news');
        }
        catch (err){
            console.log(err)
        }
    }

    return (
        <Modal open dimmer="blurring" className='modal' >

            <Modal.Header>Delete Account</Modal.Header>
            <Modal.Content scrolling style={{width: "100%", marginLeft:"0rem", marginTop:"0rem"}}>
                This will delete your account including all your builds
            </Modal.Content>
            <Modal.Actions>
                <Link to={"/account/"+props.match.params.id}><Button>Cancel</Button></Link>
                <Button type="button" onClick={deleteAccount}>Delete</Button>
            </Modal.Actions>
        </Modal>
    );
}