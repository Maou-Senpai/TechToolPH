import React,{Component} from 'react';

import { Link} from "react-router-dom";
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import checkLoggedIn from "./auth/UserAuth";

const Build = props => {
    return(
        <tr>
            <td>{props.build.build_name}</td>
            <td>{props.build.updatedAt}</td>
            <td className="text-center">
                <Link to={'/my-builds/'+props.build._id} className="btn btn-sm btn-danger" style={{marginRight: "0.2rem"}}>View</Link>
                <Link to={'/build-pc/'+props.build._id} className="btn btn-sm btn-info" style={{marginRight: "0.2rem"}}>Edit</Link>
                <a href="#" onClick={()=>{props.deletebuild(props.build._id)}} className="btn btn-sm btn-primary" style={{marginRight: "0.2rem"}}>Delete</a>
            </td>
        </tr>
    )
};

export default class MyBuild extends Component {
    constructor(props) {
        super(props);

        this.state = {build:[]};
        this.deletebuild = this.deletebuild.bind(this);
    }

    baseURL = process.env.REACT_APP_API || "http://localhost:5000";

    componentDidMount() {
        (async()=>{
            const data = await checkLoggedIn();
            console.log(data);

            if(data.token !== "") {
                axios.get(this.baseURL + '/user/builds/' + data.user.id)
                    .then(res => {
                        this.setState({build: res.data})
                        console.log(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })();

    }

    deletebuild(id){

        axios.delete(this.baseURL + '/build/delete/'+id)
            .then(res=>alert(res.data))
            this.setState({
                build: this.state.build.filter(el=>el._id !== id)
            })

    }

    builds(){
        return this.state.build.map(curBuild =>{
            return <Build build = {curBuild} deletebuild={this.deletebuild} key={curBuild._id}/>
        })
    }

    render(){
        const token = localStorage.getItem("auth-token");
        let data = true;
        if(token==="" || token===null){
            data = false;
        }
        return (
            <div className='MyBuilds text-center' style={{marginLeft: "14rem", marginTop: 30, width: "100%"}}>
                {data?(<div>
                <h1 style={{marginBottom: 40}}>MY BUILDS</h1>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <table className="table table-bordered table-hover" style={{width: "80%"}}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Build Name</th>
                                <th>Last Modified</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.builds()}
                        </tbody>
                    </table>
                </div></div>):(
                    <>
                    <h2>Log In to Access Saved Builds!</h2>
                    </>)}
            </div>

        );
    }
}

