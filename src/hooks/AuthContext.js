import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {reauthenticate} from '../services/DiscordService';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(undefined);

    function hasPermission(server, permission){
        if(auth === undefined) return false;
        return !!auth?.permissions[server]?.includes(permission);
    }

    useEffect(() => {
        if(auth === undefined) {
            const refreshToken = localStorage.getItem('refresh_token');
            if(refreshToken !== null) {
                console.log('re-authenticating');
                reauthenticate(refreshToken).then(res => {
                    setAuth(res.data);
                    const {refresh_token, id} = res.data;
                    localStorage.setItem('refresh_token', refresh_token);
                    Cookies.set('user', id, {expires: 7, path: '/'});
                }).catch(() => {});
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={[auth, setAuth, hasPermission]}>
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