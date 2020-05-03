import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Chats from './components/Chats.js'
import Login from './components/Login.js'


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/chats" component={Chats} exact />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
