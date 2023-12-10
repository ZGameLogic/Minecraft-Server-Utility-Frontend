import React, {useEffect} from 'react';

function LoginPage(){

    useEffect(() => {
        window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=1182184476269363230&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fcallback&scope=identify+email';
    }, []);

    return <></>;
}

export default LoginPage;