import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const useWebSocket = () => {
    const [webSocket, setWebSocket] = useState<Stomp.Client>null;

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

    return webSocket;
};

export default useWebSocket;