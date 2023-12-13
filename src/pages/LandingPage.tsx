import React, {useEffect, useState} from 'react';
import {fetchServers} from '../services/MSU-Backend-Service';
import MinecraftServerCard from '../components/MinecraftServerCard';
import Container from 'react-bootstrap/Container';
import {Row} from 'react-bootstrap';
import {MinecraftServer} from '../constants/Types';

function LandingPage() {

    const [mcServers, setMcServers] = useState<MinecraftServer[]>([]);

    useEffect(() => {
        fetchServers().then((res) => {
            setMcServers(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return <>
        <Container>
            <Row>
                {mcServers.map((server: MinecraftServer) => {
                    return <MinecraftServerCard key={server.name} server={server}/>;
                })}
            </Row>
        </Container>
    </>;
}

export default LandingPage;