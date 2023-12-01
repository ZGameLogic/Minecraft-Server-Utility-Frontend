import React, {createContext, useContext, useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import PropTypes from 'prop-types';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const socket = new SockJS(`${process.env.REACT_APP_BACKEND_API_URL}/ws`);
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            setWebSocket(stompClient);
        }, error => {
            console.error(error);
        });

        return () => {
            socket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={webSocket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

WebSocketProvider.propTypes = {
    children: PropTypes.any
};