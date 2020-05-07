import React from 'react';
import 'antd/dist/antd.css';
import { Button, Input, Modal, Space} from 'antd';
import {withRouter} from "react-router";
import '../styles/Chats.css';
import axios from 'axios'
import {grapghqlPath} from "../App";

class Login extends React.Component {

    state = {
        username: 'Ale',
        password: 'Gary',
        errMessage: ''
    };

    handleChangeUsername = e => {
        this.setState({
            username: e.target.value
        });
    };

    handleChangePassword = e => {
        this.setState({
            password: e.target.value
        });
    };

    handleClickLogin = e => {
        axios.post( grapghqlPath,
            {"query":"mutation{login(login: {email: \""+this.state.username+"\", password: \""+this.state.password+"\"}){user{username}, token}}"
            }).then(response => {
            console.log(response);
            if(response.data.errors != null){
                Modal.error({
                    centered: true,
                    title: 'Error',
                    content: response.data.errors[0].message,
                });
            } else {
                Modal.success({
                    centered: true,
                    title: 'Successful log in!',
                    content: "Welcome " + response.data.data.login.user.username+"!",
                })
            }
        });
    };

    render() {
        return (
            <div className="r-container" >
                <div className="img-logo-container">
                    <img className="img-logo" src={require('../images/LogoRentMate.png')} alt="" />
                </div>
                <div style={{ marginTop: 30, width: 400 }}>
                    <Input addonBefore="e-mail: " defaultValue="" onChange={this.handleChangeUsername} />
                </div>
                <div style={{ marginTop: 30, width: 400 }}>
                    <Input.Password addonBefore="Password: " onChange={this.handleChangePassword} />
                </div>
                <div style={{ marginTop: 30, width: 100 }}>
                    <Button block onClick={this.handleClickLogin}>Log in</Button>
                </div>
                <div style={{ marginTop: 30, width: 100 }}>
                    <Button block href="/signup">Sign up</Button>
                </div>
            </div>
        );
    }
}

export default withRouter(Login)