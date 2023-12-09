import React, {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [permissions, setPermissions] = useState({});

    return (
        <AuthContext.Provider value={[auth, setAuth, permissions, setPermissions]}>
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
    setAuth: PropTypes.func,
    children: PropTypes.any
};