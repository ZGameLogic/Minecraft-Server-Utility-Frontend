import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card} from 'react-bootstrap';
import '../style/server-card.css';
import {LinkContainer} from 'react-router-bootstrap';

function MinecraftServerCard(props){
    const {server} = props;
    return <>
        <Card
            className="text-center msu-server-card"
            bg="dark"
            text="white"
            border="success"
            style={{ width: '18rem' }}
        >
            <Card.Header>{server.name}</Card.Header>
            <Card.Body>
                <Card.Title>{server.status}</Card.Title>
                <Card.Text>
                    {server.playersOnline}
                    {server.online}
                </Card.Text>
                <LinkContainer to={`/view/${server.name}`}>
                    <Button variant="success">Detail View</Button>
                </LinkContainer>
            </Card.Body>
        </Card>
        <br />
    </>;
}

MinecraftServerCard.propTypes = {
    server: PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
        online: PropTypes.arrayOf(PropTypes.string),
        playersOnline: PropTypes.number
    })
};

export default MinecraftServerCard;