import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Anuncios from './Anuncios';
import {grapghqlPath} from "../App";

const client = new ApolloClient({
  uri: 'http://192.168.99.100:3030/graphql'
});

const Advertisements = () => (
  <ApolloProvider client={client}>
    <div className="container">
      <nav className="navbar navbar-dark bg-primary">
        <a className="navbar-brand" href="#">Rentmate - Anuncios de renta</a>
      </nav>
      <div>
        <Anuncios />
      </div>
    </div>
  </ApolloProvider>
)


export default Advertisements;