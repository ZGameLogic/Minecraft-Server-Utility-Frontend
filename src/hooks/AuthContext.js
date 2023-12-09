import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUserData, reauthenticate} from '../services/DiscordService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(undefined);
    const[user, setUser] = useState(undefined);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        if(auth === undefined && user === undefined) {
            console.log('re-authenticating');
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refresh_token');

            reauthenticate(token, refreshToken).then(res => {
                setAuth(res.data);
            }).catch(() => {});
        }
    }, []);

    useEffect(() => {
        console.log(auth);
        if(auth !== undefined) {
            getUserData(auth.access_token, auth.refresh_token).then(res => {
                setUser(res.data);
                localStorage.setItem('token', auth.access_token);
                localStorage.setItem('refresh_token', auth.refresh_token);
            }).catch(er => {
                console.error(er);
            });
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={[auth, setAuth, user, setUser, permissions, setPermissions]}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

AuthProvider.propTypes = {
    auth: PropTypes.shape({
        token_type: PropTypes.string,
        access_token: PropTypes.string,
        expires_in: PropTypes.number,
        refresh_token: PropTypes.string,
        scope: PropTypes.string
    }),
    user:PropTypes.shape({
        locale: PropTypes.string,
        username: PropTypes.string,
        global_name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.string,
        id: PropTypes.string,
        verified: PropTypes.bool
    }),
    setAuth: PropTypes.func,
    setUser: PropTypes.func,
    setPermissions: PropTypes.func,
    children: PropTypes.any
};