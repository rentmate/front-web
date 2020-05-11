import React from 'react';
import 'antd/dist/antd.css';
import { Comment, Typography, Button, List, Input, Layout, PageHeader } from 'antd';
import moment from 'moment';
import {withRouter} from "react-router";
import '../styles/Chats.css';
import axios from 'axios'
import {grapghqlPath} from '../App';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

const CommentList = ({ comments }) => (
    <List
        style={{
            display: 'block',
            position: 'relative'
        }}
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props =>
            <div
                style={{
                    display: 'flex',
                    justifyContent: (props.author != 'You'? 'flex-end' : '')
                }}>
                <Comment
                    style={{
                        background: 'white',
                        display: 'inline-block',
                        borderRadius: '1.5em',
                        margin: '0.5em 1em',
                        padding: '0 1em'
                    }} {...props}
                />
            </div>}
    />
);

class Chats extends React.Component {
    state = {
        comments: [],
        creating: true,
        value: '',
        from: '...',
        to: '',
        subject: '',
        chats : []
    };

    constructor(props) {
        super(props);
        let fromp = (props.history.location.state.from != null )? props.history.location.state.from : "...";
        this.setState({
            from: (fromp != null )? fromp : ""
        });
        console.log("Props: "+JSON.stringify(props.history.location.state.from));
        console.log("State: "+JSON.stringify(this.state));

        axios.post( grapghqlPath,
            {"query":"query{chatsByUser(username: \""+ fromp +"\"){user, subject}}"
            }).then(response => {
            console.log(response);
            if(response.data.data != null) {
                let chats = response.data.data.chatsByUser;
                this.setState({
                    chats: chats
                })
            }
        }).then(response => {
            this.setState({
                from: (fromp != null )? fromp : ""
            })
        });
    }

    getComments = () => {
        console.log("From: "+this.state.from);
        console.log("To: "+this.state.to);
        console.log("Subject: "+this.state.subject);
        axios.post( grapghqlPath,
            {"query":"query {"+
                    "\nmessageByChat(user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\") {"+
                    "\nuser1, content, date"+
                    "\n}"+
                    "\n}"
            }).then(response => {
            console.log(response.data.data["messageByChat"]);
            setTimeout(() => {
                if(response.data.data != null) {
                    let data = response.data.data.messageByChat;
                    let messages = [];

                    for (let i = 0; i < data.length; i++) {
                        messages.push({
                            author: (data[i].user1 == this.state.from) ? "You" : data[i].user1,
                            content: data[i].content,
                            datetime: moment(parseInt(data[i].date)).fromNow()
                        })
                    }
                    setTimeout(() => {
                        this.setState({
                            comments: messages
                        });
                    }, 1000);
                }
        });
    })};

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

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
        let res = '';
        axios.post(grapghqlPath,
            {"query":"mutation {"+
                                        "\ncreateMessage(message: {user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\", content: \""+this.state.value+"\", date: \""+(new Date().getTime())+"\"}) {"+
                                            "\n user1, user2, content, date}}"

        }).then(response => {
            console.log(response);
        });
    };

    handleCreateMessage = e => {
        this.handleSubmit();
        setTimeout(() => {
            this.setState({
                creating: false,
            });
            this.getComments();
        }, 1000);
    };

    handleChangeMessage = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleClickChat = e => {
        this.setState({
            creating: false,
            subject: e.subject,
            to: e.user,
        });
        this.getComments();
    };

    handleChangeSubject = e => {
        this.setState({
            subject: e.target.value,
        });
    };

    handleChangeTo = e => {
        this.setState({
            to: e.target.value,
        });
    };

    handleClickCreateMessage = e => {
        this.handleSubmit();
        axios.post( grapghqlPath,
            {"query":"query{chatsByUser(username: \""+ this.state.from +"\"){user, subject}}"
            }).then(response => {
            console.log(response.data.data["chatsByUser"]);
            if(response.data.data != null) {
                let chats = response.data.data.chatsByUser;
                this.setState({
                    creating: true,
                    chats: chats
                })
            }
        });
    };

    render() {
        const { comments, chats, value, creating } = this.state;

        return (
            <div>
                <Layout className='c-container'>
                    <Sider>
                        <div>
                            <Button block
                                style={{borderWidth: "1px 0", borderColor:'#f0f0f0', height: '6em'}}
                                    onClick={this.handleClickCreateMessage}
                            >
                                <Text strong>New message</Text>
                            </Button>
                            {chats.length > 0 &&
                            <List
                                itemLayout="horizontal"
                                dataSource={chats}
                                renderItem={item => (
                                    <Button
                                        onClick={() => this.handleClickChat(item)}
                                        style={{
                                            borderWidth: "1px 0",
                                            borderColor:'#f0f0f0',
                                            height: '5em',
                                            textAlign: 'left'
                                        }}
                                        block>
                                        <Text strong>{item.user}</Text>
                                        <br />
                                        {item.subject}
                                    </Button>
                                )}
                            />
                            }
                        </div>
                    </Sider>
                    <Layout>
                        <Header>
                            <PageHeader className='c-header blue3'
                                ghost={false}
                                title={this.state.to + ": "}
                                subTitle={this.state.subject}
                            />
                        </Header>
                        {creating?
                            <Content className='c-creation'>
                                <Input addonBefore="Asunto: " placeholder="Producto a negociar" onChange={this.handleChangeSubject} />
                                <Input addonBefore="Para: " placeholder="username" onChange={this.handleChangeTo} />
                                    <TextArea
                                        style={{padding: "1em", resize : "none", borderRadius: "1em"}}
                                        onChange={this.handleChangeMessage}
                                        value={value}
                                    />
                                    <Button
                                        onClick={this.handleCreateMessage}
                                        size = "large"
                                    >
                                        Enviar
                                    </Button>
                            </Content>
                        :
                            <Content style={{ position: "relative"}}>
                                <div style={{ clear: "both", display:'flex', flexDirection: 'column'}}>
                                    {comments.length > 0 && <CommentList comments={comments} />}
                                    <Comment/>
                                </div>
                                <div className = 'c-editor blue3'>
                                    <TextArea
                                        style={{padding: "1em", marginRight: "1em", resize : "none", borderRadius: "1em"}}
                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                        onChange={this.handleChangeMessage}
                                        value={value}
                                    />
                                    <Button
                                        shape="circle"
                                        icon={<SendOutlined />}
                                        onClick={this.handleSubmit}
                                        size = "large"
                                    />
                                </div>
                            </Content>
                        }
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default withRouter(Chats)