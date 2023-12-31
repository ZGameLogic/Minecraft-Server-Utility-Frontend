import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../style/Navbar.css';
import {LinkContainer} from 'react-router-bootstrap';
import {useAuth} from '../hooks/AuthContext';
import {NavDropdown, Stack} from 'react-bootstrap';

function NavScrollExample() {
    const [auth, setAuth, hasPermission] = useAuth();

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
                        {hasPermission('General Permissions', 'C') &&
                            <LinkContainer to='/create'>
                                <Nav.Link className="msu-navbar-item">Create Server</Nav.Link>
                            </LinkContainer>
                        }
                        {hasPermission('General Permissions', 'U') &&
                            <LinkContainer to='/users'>
                                <Nav.Link className="msu-navbar-item">User Management</Nav.Link>
                            </LinkContainer>
                        }
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    {auth && auth.username ?
                        <div className="msu-user-item">
                            <Stack gap={2} direction={'horizontal'}>
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${auth.id}/${auth.avatar}.png`}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top discord-img"
                                    alt="React Bootstrap logo"
                                />
                                <NavDropdown
                                    title={auth.username}
                                    id="username-nav-dropdown"
                                >
                                    <NavDropdown.Item
                                        onClick={() => {
                                            setAuth(undefined);
                                            localStorage.removeItem('id');
                                        }}
                                        className="msu-dropdown-item"
                                    >
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Stack>
                        </div>:
                        <Nav.Link
                            className="msu-navbar-item msu-login-item"
                            href={process.env.REACT_APP_AUTH_URL}
                        >
                            Login
                        </Nav.Link>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavScrollExample;