import React, {useEffect} from 'react';
import {authenticate} from '../services/DiscordService';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useAuth} from '../hooks/AuthContext';
import Cookies from 'js-cookie';

function CallbackPage(){
    const [searchParams, ] = useSearchParams();
    const [, setAuth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        authenticate(searchParams.get('code')).then((res) => {
            setAuth(res.data);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            Cookies.set('user', res.data.id, {expires: 7, path: '/'});
            navigate('/');
        }).catch(er => {
            console.error(er);
        });
    }, []);

    return <>
        <p>{searchParams.get('code')}</p>
    </>;
}

export default CallbackPage;
