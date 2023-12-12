import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {reauthenticate} from '../services/DiscordService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(undefined);

    function hasPermission(server, permission){
        if(auth === undefined) return false;
        if(auth.permissions['General Permissions']?.includes('A')) return true;
        return !!auth.permissions[server]?.includes(permission);
    }

    useEffect(() => {
        if(auth === undefined) {
            const id = localStorage.getItem('id');
            if(id !== null) {
                console.log('re-authenticating');
                reauthenticate(id).then(res => {
                    setAuth(res.data);
                    const {id} = res.data;
                    localStorage.setItem('id', id);
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