import React, {useEffect, useState} from 'react';
import {fetchServers} from '../services/MSU-Backend-Service';
import MinecraftServerCard from '../components/MinecraftServerCard';

function Landing() {

    const [mcServers, setMcServers] = useState([]);

    useEffect(() => {
        console.log(process.env.REACT_APP_BACKEND_API_URL);
        fetchServers().then((res) => {
            setMcServers(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return(
        <>
            {
                mcServers.map(server => {
                    return <MinecraftServerCard key={server.name} server={server}/>;
                })
            }
        </>
    );
}

export default Landing;