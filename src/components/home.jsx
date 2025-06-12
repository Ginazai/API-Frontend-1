import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import HomeImg from '../assets/images/home.png';

export default function Home({ token }) {
	return (
	  <Container className="p-0" fluid>
	    <div
	      style={{
	        position: 'relative',
	        width: '100%',
	        height: '60vh',
	        minHeight: 300,
	        maxHeight: 600,
	        overflow: 'hidden'
	      }}
	      className="mb-4 shadow"
	    >
	      <img
	        src={HomeImg}
	        alt="Home"
	        style={{
	          width: '100%',
	          height: '100%',
	          objectFit: 'cover',
	          objectPosition: 'center'
	        }}
	      />
	      <div
	        style={{
	          position: 'absolute',
	          top: 0,
	          left: 0,
	          width: '100%',
	          height: '100%',

	          display: 'flex',
	          flexDirection: 'column',
	          justifyContent: 'center',
	          alignItems: 'flex-start',
	          padding: '2rem'
	        }}
	      >
	        <h2 className="text-dark mb-2">¡Bienvenido al administrador de inventario!</h2>
	        {token ? (<p className="text-secondary fs-5 mb-0">Aquí puedes gestionar los productos y categorías.</p>)
			: (<p className="text-secondary fs-5 mb-0">Para empezar, por favor inicia sesión.</p>
             )}
	      </div>
	    </div>
	  </Container>
	);
}
