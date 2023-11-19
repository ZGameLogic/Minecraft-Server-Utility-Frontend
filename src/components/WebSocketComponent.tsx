import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function WebSocketComponent() {

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        stompClient.subscribe('/server/message', (message) => {
            console.log(message);
        });
    });

    const sendMessage = () => {
        const message = {
            server: 'AMT9'
        };


        // Send the message to the server
        stompClient.send('/app/hello', {}, JSON.stringify(message));
    };


    return (
        <div>
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
}

export default WebSocketComponent;
