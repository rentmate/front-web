import React from 'react';
import 'antd/dist/antd.css';
import { Button, Input, DatePicker} from 'antd';
import {withRouter} from "react-router";
import '../styles/Chats.css';
import axios from 'axios'

const dateFormat = 'YYYY/MM/DD';

class Login extends React.Component {
    state = {
        username: 'Ale',
        password: 'Gary'
    };

    handleChangeUsername = e => {
        this.setState({
            username: e.getValue()
        });
    };

    handleChangePassword = e => {
        this.setState({
            username: e.getValue()
        });
    };

    handleClickLogin = e => {
        //axios.
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