import React, {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {ToastContainer} from 'react-bootstrap';
import ToastMessage from '../components/ToastMessage';
import {ToastType} from '../constants/Types';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {

    const [toasts, setToasts] = useState([]);

    function addToast(toast: ToastType){
        setToasts((prevState) => {
            return [...prevState, toast];
        });
    }

    return (
        <ToastContext.Provider value={addToast}>
        <ToastContainer position={'top-center'} className='fetchToastError'>
            {toasts.map(toastProps => {
                return <ToastMessage
                    key={toastProps.title}
                    title={toastProps.title}
                    description={toastProps.description}
                    type={toastProps.type}
                />;
            })}
        </ToastContainer>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};

ToastProvider.propTypes = {
    children: PropTypes.any
};