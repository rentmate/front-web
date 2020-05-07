import React from 'react';
import 'antd/dist/antd.css';
import {Button, Input, DatePicker, Modal} from 'antd';
import {withRouter} from "react-router";
import '../styles/Register.css';
import axios from 'axios'
import {grapghqlPath} from "../App";

const dateFormat = 'YYYY/MM/DD';

class Register extends React.Component {
    state = {
        email: '',
        username: '',
        password: '',
        birthDate: '',
    };

    handleChangeEmail = e => {
        this.setState({
            email: e.target.value
        });
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


    handleChangeBirthDate = e => {
        this.setState({
            birthDate: e.target.value
        });
    };

    handleClickSignup = e => {
        axios.post( grapghqlPath,
            {"query":"mutation{addUser( user: { username: \""+this.state.username+"\", email: \""+this.state.username+"\", password: \""+this.state.password+"\"}){success}}"
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
                    title: 'Successful sign up!',
                    content: "Welcome " + this.state.username+"!",
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
                    <Input addonBefore="e-mail: " defaultValue="" onBlur={this.handleChangeEmail} />
                </div>
                <div style={{ marginTop: 30, width: 400 }}>
                    <Input addonBefore="Username: " defaultValue="" onBlur={this.handleChangeUsername} />
                </div>
                <div style={{ marginTop: 30, width: 400 }}>
                    <Input.Password addonBefore="Password: " defaultValue="" onBlur={this.handleChangePassword} />
                </div>
                <div style={{ marginTop: 30 }}>
                    <DatePicker style={{width: 300 }} placeholder="Birth Date: " defaultValue="" onBlur={this.handleChangeBirthDate} />
                </div>
                <div style={{ marginTop: 30, width: 100 }}>
                    <Button block onClick={this.handleClickSignup}>Sign up</Button>
                </div>
                <div style={{ marginTop: 30, width: 100 }}>
                    <Button block href="/login">Log in</Button>
                </div>
            </div>
        );
    }
}

export default withRouter(Register)