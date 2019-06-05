import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Navigation = props => {
  return (
    <div>
      <Navbar bg='light' variant='light'>
        <Navbar.Brand>Steam Stats</Navbar.Brand>
        <Nav>
          <Nav.Link>Games</Nav.Link>
          <Nav.Link>Friends</Nav.Link>
          <Nav.Link>Something</Nav.Link>
        </Nav>
      </Navbar>
      {props.children}
    </div>
  );
};

export default Navigation;
