import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Anuncio from './Anuncio';

const Anuncios = () => (
    <Query query={gql`
        {
            getAnuncios {
                idAnuncio
                name
                description
                photo
                price
                idOwner
            }
        }
    `}
    >
        {({loading, error, data}) => {
            if (loading) return <p>Loading ...</p>;
            if (error) return <p>Error :(</p>;
            
            return data.getAnuncios.map((currentAnuncio) => (
                <Anuncio anuncio={currentAnuncio} />
            ));
        }}
    </Query>
);

export default Anuncios;