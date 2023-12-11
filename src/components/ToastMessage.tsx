import React, {useState} from 'react';
import {Toast} from 'react-bootstrap';

function ToastMessage(props: ToastProps){
    const [show, setShow] = useState(true);

    return <Toast show={show} onClose={() => setShow(false)} animation={true} bg={props.type} >
        <Toast.Header>
            <strong className="me-auto">{props.title}</strong>
        </Toast.Header>
        <Toast.Body>{props.description}</Toast.Body>
    </Toast>;
}

export interface ToastProps {
    title: string
    description: string
    type: string
}

export default ToastMessage;