import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Tab, Table, Tabs} from 'react-bootstrap';
import {fetchServer, fetchServerLog} from '../services/MSU-Backend-Service';
import {useWebSocket} from '../hooks/WebSocketContext';
import Stomp from 'stompjs';

function ServerDetailPage() {
    const {server} = useParams();

    const [status, setStatus] = useState('Unknown');
    const [log, setLog] = useState([]);
    const stompClient:Stomp.Client = useWebSocket();

    useEffect(() => {
        fetchServer(server).then((res) => {
            const {status} = res.data[0] ?? 'Unknown';
            setStatus(status);
        }).catch((err) => {
            console.log(err);
        });
        if(status === 'Online') fetchServerLog(server).then((res) => {
            const log = res.data[server].log ?? '';
            log.split('\r\n').map(addToLog);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        stompClient?.subscribe(`/server/${server}`, (message) => {
            const body = JSON.parse(message.body);
            if(body.messageType === 'status'){
                setStatus(body.message);
            } else if(body.messageType === 'log') {
                addToLog(body.message);
            }
        });

        return () => {
            stompClient?.unsubscribe(`/server/${server}`);
        };
    }, [stompClient]);

    useEffect(() => {
        if(status === 'Starting'){
            setLog([]);
        }
    }, [status]);

    function sendMessage(message: object){
        stompClient?.send(`/app/server/${server}`, {}, JSON.stringify(message));
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
            prevState.push(message);
            return prevState;
        });
    }

    return <>
        <p>{server} {status} </p>
        <button onClick={stopServer}>Stop Server</button>
        <button onClick={startServer}>Start Server</button>
        <Tabs
            defaultActiveKey="log"
            id="uncontrolled-tab-example"
            className="mb-3"
            justify
        >
            <Tab eventKey="log" title="Server Log">
                <Table striped bordered hover variant="dark">
                    <tbody key="server-log">
                    {log.map((line, index) => {
                        return <>
                            <tr key={index}>
                                <td key={index + 'line'}>{line}</td>
                            </tr>
                        </>;
                    })}
                    </tbody>
                </Table>
            </Tab>
            <Tab eventKey="chat" title="Chat Log">
                Tab content for Profile
            </Tab>
        </Tabs>
    </>;
}

export default ServerDetailPage;