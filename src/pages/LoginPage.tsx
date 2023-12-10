import React, {useEffect} from 'react';

function LoginPage(){

    useEffect(() => {
        window.location.href = `${process.env.REACT_AUTH_URL}`;
    }, []);

    return <></>;
}

export default LoginPage;