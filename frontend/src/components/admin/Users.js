import React,{Component} from 'react';
import { Link} from "react-router-dom";
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import TableScrollbar from 'react-table-scrollbar';

import '../../resources/Users.css';

const User = props => {
    return(
        <tr>
            <td>{props.user.username}</td>
            <td>{props.user.updatedAt}</td>
            <td className="text-center">
                <Link to={{pathname:'/view/'+ props.user._id,state:{username: props.user.username}}}  className="btn btn-sm btn-danger">View</Link>
            </td>
        </tr>
    )
};


/*
state format:

builds {
    _id
    build_name
}
username
_id

 */

export default class MyBuild extends Component {
    constructor(props) {
        super(props);

        this.state = {users:[]};
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    componentDidMount() {
        axios.get(this.baseURL + "/user/users")
            .then(res=>{
                this.setState({
                    users: res.data
                })
                console.log("below this")
                console.log(this.state.users)
            })
            .catch(err=>console.log(err));
    }

    users() {
        return this.state.users.map(curUser =>{
            if(curUser.username !== 'admin') {
                return <User user={curUser} key={curUser._id}
                />
            }
        })
    }

    render() {
        return (
            <div className='MyBuilds text-center' style={{marginTop: 50, marginBottom: 30, width:"70%"}}>
                <h1>USERS</h1>
                    <TableScrollbar rows={10}>
                        <table className="table table-bordered table-hover" style={{width: "100%"}} >
                            <thead className="thead-dark" >
                            <tr>
                                <th>Username</th>
                                <th>Date Created</th>
                                <th className="text-center">Builds</th>
                            </tr>
                            </thead>
                            <tbody >
                            {this.users()}
                            </tbody>
                        </table>
                    </TableScrollbar>
            </div>

        );
    }
}

