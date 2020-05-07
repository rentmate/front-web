import React from 'react';
import 'antd/dist/antd.css';
import { Comment, Avatar, Form, Button, List, Input, Select  } from 'antd';
import moment from 'moment';
import {withRouter} from "react-router";
import '../styles/Chats.css';
import axios from 'axios'


const { TextArea } = Input;


const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Enviar
            </Button>
        </Form.Item>
    </div>
);

class Chats extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
        from: 'Ale',
        to: 'Gary',
        subject: 'Producto a negociar',
    };

    getComments = () => {

        console.log("From: "+this.state.from);
        console.log("To: "+this.state.to);
        console.log("Subject: "+this.state.subject);
        axios.post('http://192.168.99.100:3030/graphql',
            {"query":"query {"+
                    "\nmessageByChat(user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\") {"+
                    "\nuser1, content, date"+
                    "\n}"+
                    "\n}"
            }).then(response => {
                let data = response.data.data.messageByChat;
            console.log(response.data.data["messageByChat"]);
            let messages = [];

            for (let i = 0; i <data.length; i++) {
                messages.push({ author: (data[i].user1 == this.state.from)? "You" : data[i].user1 ,
                                content: data[i].content,
                                datetime: moment(parseInt(data[i].date)).fromNow()
                              })
            }
            this.setState({
                comments : messages
            })

        });
        return []
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    ...this.state.comments,
                    {
                        author: "You",
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                ],
            });
        }, 1000);
        axios.post('http://192.168.99.100:3030/graphql',
            {"query":"mutation {"+
                                        "\ncreateMessage(message: {user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\", content: \""+this.state.value+"\", date: \""+(new Date().getTime())+"\"}) {"+
                                            "\n user1, user2, content, date}}"

        }).then(response => {
            console.log(response)
        });
    };

    handleChangeMessage = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleChangeFrom = e => {
        this.setState({
            from: e.target.value,
        });
        this.state.comments = this.getComments();

    };

    handleChangeSubject = e => {
        this.setState({
            subject: e.target.value,
        });
        this.state.comments = this.getComments();
    };

    handleChangeTo = e => {
        this.setState({
            to: e.target.value,
        });
        this.state.comments = this.getComments();
    };



    render() {
        const { comments, submitting, value } = this.state;

        return (
            <div className="c-container" >
                <div style={{ marginTop: 16 }}>
                    <Input addonBefore="Asunto: " placeholder="Producto a negociar" onBlur={this.handleChangeSubject} />
                </div>
                <div>
                    <div style={{ marginTop: 16 , width: "15em", float: "left"}}>
                        <Input addonBefore="De: " placeholder="username" onBlur={this.handleChangeFrom} />
                    </div>
                    <div style={{ marginTop: 16 , width: "15em", float: "right"}}>
                        <Input addonBefore="Para: " placeholder="username" onBlur={this.handleChangeTo} />
                    </div>
                </div>
                <div style={{ clear: "both"}}>
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    content={
                        <Editor
                            onChange={this.handleChangeMessage}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
                </div>
            </div>
        );
    }
}

export default withRouter(Chats)