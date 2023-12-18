import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Card, Stack} from 'react-bootstrap';
import '../style/server-card.css';
import {LinkContainer} from 'react-router-bootstrap';
import Stomp from 'stompjs';
import {useWebSocket} from '../hooks/WebSocketContext';
import MinecraftPlayerLine from '../components/MinecraftPlayerLine';
import {useAuth} from '../hooks/AuthContext';
import {ServerCardProps} from '../constants/Types';

function MinecraftServerCard(props: ServerCardProps){
    const {server} = props;

    const [status, setStatus] = useState('Unknown');
    const [players, setPlayers] = useState([]);
    const [auth,,hasPermission] = useAuth();

    const webSocket:Stomp.Client = useWebSocket();

    useEffect(() => {
        setStatus(server.status);
        setPlayers(server.online);
        webSocket?.subscribe(`/server/${server.name}`, (message) => {
            const body = JSON.parse(message.body);
            if (body.messageType === 'status') {
                setStatus(body.message);
            } else if(body.messageType === 'player'){
                setPlayers(body.message.players);
            }
        });

        return () => {
            webSocket?.unsubscribe(`/server/${server.name}`);
        };
    }, [webSocket]);

    function sendMessage(message: object){
        webSocket?.send(`/app/server/${server.name}`, {}, JSON.stringify({...message, userId: auth.id}));
    }

    function stopServer(){
        sendMessage({
            action: 'stop'
        });
    }

    function startServer(){
        sendMessage({
            action: 'start'
        });
    }

    return <>
        <Card
            className="text-center msu-server-card"
            bg="dark"
            text="white"
            border="success"
            style={{ width: '18rem' }}
        >
            <Card.Header>
                <Card.Title>
                    {server.name}
                    <span className={`dot ${status}`}></span>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Stack gap={2}>
                    <Card.Text className={'playerList'}>
                        Online: {players.length}
                    </Card.Text>
                    {players.map(player => {
                        return <MinecraftPlayerLine key={player} player={player}/>;
                    })}
                    {hasPermission(server.name, 's') &&
                        <ButtonGroup>
                            <Button
                                variant="success"
                                onClick={startServer}
                                disabled={status !== 'Offline' && status !== 'Crashed'}
                            >Start</Button>
                            <Button
                                variant="danger"
                                onClick={stopServer}
                                disabled={status !== 'Online'}
                            >Stop</Button>
                        </ButtonGroup>
                    }
                    {hasPermission(server.name, 'c') &&
                        <LinkContainer to={`/view/${server.name}`}>
                            <Button variant="outline-success">Detail View</Button>
                        </LinkContainer>
                    }
                </Stack>
            </Card.Body>
        </Card>
        <br />
    </>;
}

export default MinecraftServerCard;