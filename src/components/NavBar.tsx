import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../style/Navbar.css';
import {LinkContainer} from 'react-router-bootstrap';

function NavScrollExample() {
    return (
        <Navbar bg="dark" data-bs-theme="dark" sticky="top" expand="lg" className="bg-body-tertiary msu-navbar">
            <Container fluid>
                <Navbar.Brand>Minecraft Server Utility</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <LinkContainer to='/'>
                            <Nav.Link className="msu-navbar-item">Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/create'>
                            <Nav.Link className="msu-navbar-item">Create Server</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavScrollExample;