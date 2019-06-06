import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = props => {
  return (
    <div>
      <Navbar bg='light' variant='light'>
        <Navbar.Brand as={Link} to='/'>
          Steam Stats
        </Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to='/profile'>
            Profile
          </Nav.Link>
          <Nav.Link as={Link} to='/compare'>
            Compare Profiles
          </Nav.Link>
        </Nav>
      </Navbar>
      {props.children}
    </div>
  );
};

export default Navigation;
