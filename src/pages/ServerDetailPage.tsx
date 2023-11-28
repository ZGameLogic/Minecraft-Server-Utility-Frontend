import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function ServerDetailPage() {
    const {server} = useParams();
    const socket = new SockJS(`${process.env.REACT_APP_BACKEND_API_URL}/ws`);
    const stompClient = Stomp.over(socket);

    const [message, setMessage] = useState('Waiting for a message');

    stompClient.connect({}, () => {
        // stompClient.subscribe(`/app/server/${server}`, (message) => {
        stompClient.subscribe('/**', (message) => {
            console.log(message);
            setMessage(message);
        });
    }, (error) => {
        console.error('Stomp connection error:', error);
    });

    function sendMessage(message: object){
        stompClient.send(`/app/server/${server}`, {}, JSON.stringify(message));
    }

    return <>
        {server}
        <button onClick={() => {
            console.log('Stomp connection state:', stompClient.connected);
            sendMessage({
                action: 'none',
                data: {}
            });
        }}>Test</button>
        <p>{message}</p>
    </>;
}

export default ServerDetailPage;