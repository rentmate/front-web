import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Chats from './components/Chats.js'
import Login from './components/Login.js'
import Register from "./components/Register";
import {Button} from "antd";


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/Login" component={Login} exact />
          <Route path="/signup" component={Register} exact />
          <Route path="/chats" component={Chats} exact />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
