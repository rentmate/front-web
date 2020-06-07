import React from 'react';
import 'antd/dist/antd.css';
import { Comment, Typography, Button, List, Input, Layout, Cascader, PageHeader } from 'antd';
import moment from 'moment';
import {withRouter} from "react-router";
import '../styles/Chats.css';
import axios from 'axios'
import {grapghqlPath} from '../App';
import { SendOutlined, TranslationOutlined } from '@ant-design/icons';
import translate from 'google-translate-open-api';

const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

const CommentList = ({ comments, me }) => (
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
                    justifyContent: (props.author != me? 'flex-end' : '')
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

const options= [{value: 'en', label: 'Inglés'},
                {value: 'es', label: 'Español'},
                {value: 'cn', label: 'Chino'},
                {value: 'fr', label: 'Francés'},
                {value: 'de', label: 'Alemán'},
                {value: 'it', label: 'Italiano'},
                {value: 'ja', label: 'Japonés'},
                {value: 'ko', label: 'Coreano'}
               ];

Array.prototype.orderByNumber=function(property,sortOrder){
    // Primero se verifica que la propiedad sortOrder tenga un dato válido.
    if (sortOrder!=-1 && sortOrder!=1) sortOrder=1;
    this.sort(function(a,b){
        // La función de ordenamiento devuelve la comparación entre property de a y b.
        // El resultado será afectado por sortOrder.
        return (a[property]-b[property])*sortOrder;
    })
}

class Chats extends React.Component {
    state = {
        comments: [],
        creating: true,
        value: '',
        from: '-',
        to: '',
        subject: '',
        chats : [],
        langFrom : '',
        langTo : '',
        me: 'You'
    };



    constructor(props) {
        super(props);
        console.log(props);
        let fromp = (props.history.location.state != undefined )? props.history.location.state.from : "...";
        axios.post( grapghqlPath,
            {"query":"query{chatsByUser(username: \""+ fromp +"\"){user, subject}}"
            }).then(response => {
            console.log(response);
            if(response.data.data != null) {
                let chats = response.data.data.chatsByUser;
                this.setState({
                    chats: chats,
                        from: (props.history.location.state != undefined )? props.history.location.state.from : "..."

        })}});
        console.log("Banderita " + JSON.stringify(this.state));
    }

    translate2 = () => {
        let oldComments = this.state.comments;
        console.log(this.state);
        translate(this.state.me, {
            to: this.state.langTo,
        }).then(result => {
            console.log("Result 1:" + JSON.stringify(result.data[0]));
            let me = result.data[0];
            this.setState({me: me});
            console.log('Empezara a traducir');
            for (let i = 0; i < oldComments.length; i++) {
                console.log("Fuente: "+JSON.stringify(oldComments[i].content));
                translate([ oldComments[i].author, oldComments[i].content, oldComments[i].datetime], {
                    to: this.state.langTo,
                }).then(result => {
                    console.log(result.data[0]);
                    console.log(oldComments[i].author+" - "+result.data[0][0][0]+" - "+this.state.me);
                    oldComments[i] = {  author : (result.data[0][0][0] == this.state.me)?result.data[0][0][0] : oldComments[i].author,
                                        content : result.data[0][1][0],
                                        datetime : result.data[0][2][0]
                    };
                    this.setState({comments: oldComments})
                });
            }
            console.log(this.state);
        });
    };

    translate3 = () => {
        axios.post( grapghqlPath,
            {"query":"query {"+
                    "\nmessageByChat(user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\") {"+
                    "\nuser1, content, date"+
                    "\n}"+
                    "\n}"}).
        then(response => {
            let data = response.data.data.messageByChat;
            let messages = [];
            data.orderByNumber('date',1);
            console.log("Result 1:" + JSON.stringify(data));
            translate('You', {
                to: this.state.langTo,
            }).then(res => {
                this.setState({me: res.data[0]});
                for (let i = 0; i < data.length; i++) {
                    translate([ data[i].content, moment(parseInt(data[i].date)).fromNow()], {
                        to: this.state.langTo,
                    }).then(result => {
                        console.log("Result "+i+":" + JSON.stringify(result));
                        console.log(data[i].content +" ----- "+ JSON.stringify(result.data[0][0][0]));

                        messages.push({
                            author: (data[i].user1 == this.state.from) ? this.state.me : data[i].user1,
                            content: result.data[0][0][0],
                            datetime:  result.data[0][1][0]
                        })
                    });
                    this.setState({comments: messages})
                }
                this.setState({comments: messages})
            })
        }).then(r => {
            console.log(this.state)
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
            if(response.data.data != null) {
                let data = response.data.data.messageByChat;
                let messages = [];
                data.orderByNumber('date',1);
                for (let i = 0; i < data.length; i++) {
                    messages.push({
                        author: (data[i].user1 == this.state.from) ? this.state.me : data[i].user1,
                        content: data[i].content,
                        datetime: moment(parseInt(data[i].date)).fromNow()
                    })
                }
                this.setState({
                    comments: messages
                });
            }}).then(r=> {
                console.log(this.state)
        })
    };

    handleSubmit = () => {
        console.log(this.state);
        if (!this.state.value) {
            return;
        }

            this.setState({
                submitting: false,
                value: '',
                comments: [
                    ...this.state.comments,
                    {
                        author: this.state.me,
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                ],
            });
        console.log(this.state);
        console.log("mutation {"+
            "createMessage(message: {user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\", content: \""+this.state.value+"\", date: \""+(new Date().getTime())+"\"}) {"+
            "user1, user2, content, date}}");
        axios.post(grapghqlPath,
            {"query":"mutation {createMessage(message: {user1: \""+ this.state.from+"\", user2: \""+this.state.to+"\", subject: \""+this.state.subject+"\", content: \""+this.state.value+"\", date: \""+(new Date().getTime())+"\"}) {"+
                                            "user1, user2, content, date}}"

        }).then(response => {
            console.log(response);
        });
    };

    handleCreateMessage = e => {
        this.handleSubmit();
        this.setState({
            creating: false,
        });
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
            me: 'You'
        });
        setTimeout(() => {
            this.getComments();
        }, 500);
    };

    handleChangeSubject = e => {
        this.setState({
            subject: e.target.value,
        });
    };

    handleLanguageFrom = (value) => {
        this.setState({
            langFrom : value[0],
        });
    };

    handleLanguageTo = (value) => {
        this.setState({
            langTo : value[0],
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
                console.log(response);
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
        const { comments, chats, value, creating, me } = this.state;

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
                                title={/*(this.state.creating)? "Inicia un nuevo chat " : */this.state.to + ": "}
                                subTitle={/*!this.state.creating && */this.state.subject}
                                extra={!this.state.creating && [
                                    <span style={{fontSize: "1.5em"}}
                                          key = "0"
                                    >
                                        Traducir
                                    </span>,
                                    <Cascader options={options}
                                              onChange={this.handleLanguageTo}
                                              style={{maxWidth: "10em"}}
                                              placeholder="To"
                                              key = "1"
                                    />,
                                    <Button className="c-header-button"
                                            icon={<TranslationOutlined />}
                                            type="primary"
                                            shape="circle"
                                            onClick={this.translate2}
                                            key = "2"
                                    />
                                ]}
                            >
                            </PageHeader>
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
                                    {comments.length > 0 && <CommentList comments={comments} me = {me} />}
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