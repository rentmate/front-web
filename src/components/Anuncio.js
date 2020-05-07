import React from 'react';

const Anuncio = (props) => (
    <div className="card" style={{'width': '100%', 'marginTop': '10px'}}>
        <div className="card-body">
            <h5 className="card-title">{props.anuncio.name}</h5>
            <p className="card-text">{props.anuncio.description}</p>
            <h6 className="card-subtitle mb-2 text-muted">$ {props.anuncio.price}</h6>
        </div>
    </div>
);

export default Anuncio;