import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button, Card, Col, InputGroup, ListGroup, Row, Tab, Tabs} from 'react-bootstrap';
import {fetchServer, fetchServerLog} from '../services/MSU-Backend-Service';
import {useWebSocket} from '../hooks/WebSocketContext';
import Stomp from 'stompjs';
import Container from 'react-bootstrap/Container';
import {useAuth} from '../hooks/AuthContext';
import '../style/server-detail.css';
import Form from 'react-bootstrap/Form';

function ServerDetailPage() {
    const {server} = useParams();

    const [status, setStatus] = useState('Unknown');
    const [log, setLog] = useState([]);
    const [command, setCommand] = useState('');
    const [chat, setChat] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
    const [autoScrollChat, setAutoScrollChat] = useState(true);
    const stompClient:Stomp.Client = useWebSocket();
    const containerRef = useRef();
    const [auth] = useAuth();

    useEffect(() => {
        fetchServer(server).then((res) => {
            const {status} = res.data[0] ?? 'Unknown';
            setStatus(status);
            fetchServerLog(server, auth.id).then((res) => {
                const log = res.data.log;
                log.split('\r\n').map(addToLog);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }, [auth]);

    useEffect(() => {
        stompClient?.subscribe(`/server/${server}`, (message) => {
            const body = JSON.parse(message.body);
            if(body.messageType === 'status'){
                setStatus(body.message);
            } else if(body.messageType === 'log') {
                addToLog(body.message);
            } else {
                console.log(message.body);
            }
        });

        return () => {
            stompClient?.unsubscribe(`/server/${server}`);
        };
    }, [stompClient]);

    useEffect(() => {
        if (autoScroll && containerRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [log, autoScroll]);

    function sendChatMessage(event) {
        event.preventDefault();
        sendMessage({
            action: 'command',
            data: {
                'command': `tellraw @a ["",{"text":"<"},{"text":"${auth.username}","color":"dark_purple"},{"text":"> ${chat}"}]`
            }
        });
        setChat('');
    }

    function sendConsoleCommand(event){
        event.preventDefault();
        sendMessage({
            action: 'command',
            data: {
                'command': command
            }
        });
        setCommand('');
    }

    function sendMessage(message: object){
        stompClient?.send(`/app/server/${server}`, {}, JSON.stringify({...message, userId: auth.id}));
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
    
    function addToLog(message: string){
        setLog((prevState) => {
            return [...prevState, message];
        });
    }

    return <>
        <p>{server} {status} </p>
        <button onClick={stopServer}>Stop Server</button>
        <button onClick={startServer}>Start Server</button>
        <Container className="log-container">
            <Card
                bg="dark"
                text="white"
                border="success"
            >
                <Card.Title className="text-center">Logs</Card.Title>
                <Card.Body>
                    <Tabs
                        defaultActiveKey="log"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        justify
                    >
                        <Tab
                            eventKey="log"
                            title="Server Log"
                        >
                            <ListGroup horizontal>
                                <ListGroup.Item>
                                    <InputGroup.Text id="auto-scroll-checkbox">Auto Scroll</InputGroup.Text>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <InputGroup.Checkbox
                                        checked={autoScroll}
                                        onChange={() => setAutoScroll(!autoScroll)}
                                    />
                                </ListGroup.Item>
                            </ListGroup>
                            <div
                                ref={containerRef}
                                style={{
                                    maxHeight: '400px', // Set your desired maximum height here
                                    overflowY: 'auto',
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                }}>
                                {log.map((message, index) => (
                                    <div key={index}>{message}</div>
                                ))}
                            </div>
                            <Form className="console-form" onSubmit={sendConsoleCommand}>
                                <Row className="align-items-center">
                                    <Form.Group controlId="formCommand" as={Col}>
                                        <Form.Control
                                            type="text"
                                            value={command}
                                            onChange={(event) => setCommand(event.target.value)}
                                            disabled={status !== 'Online'}
                                        />
                                    </Form.Group>
                                    <Col xs="auto">
                                        <Button
                                            variant="outline-success"
                                            type="submit"
                                            disabled={status !== 'Online'}
                                        >
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Tab>
                        <Tab eventKey="chat" title="Chat Log">
                            <ListGroup horizontal>
                                <ListGroup.Item>
                                    <InputGroup.Text id="auto-scroll-checkbox-chat">Auto Scroll</InputGroup.Text>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <InputGroup.Checkbox
                                        checked={autoScrollChat}
                                        onChange={() => setAutoScrollChat(!autoScrollChat)}
                                    />
                                </ListGroup.Item>
                            </ListGroup>
                            <div
                                ref={containerRef}
                                style={{
                                    maxHeight: '400px', // Set your desired maximum height here
                                    overflowY: 'auto',
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                }}>
                                {log.map((message, index) => (
                                    <div key={index}>{message}</div>
                                ))}
                            </div>
                            <Form className="console-form" onSubmit={sendChatMessage}>
                                <Row className="align-items-center">
                                    <Form.Group controlId="formChat" as={Col}>
                                        <Form.Control
                                            type="text"
                                            value={chat}
                                            onChange={(event) => setChat(event.target.value)}
                                            disabled={status !== 'Online'}
                                        />
                                    </Form.Group>
                                    <Col xs="auto">
                                        <Button
                                            variant="outline-success"
                                            type="submit"
                                            disabled={status !== 'Online'}
                                        >
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    </>;
}

export default ServerDetailPage;