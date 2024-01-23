import React from 'react';
import {fetchServers} from '../services/MSU-Backend-Service';
import MinecraftServerCard from '../components/MinecraftServerCard';
import Container from 'react-bootstrap/Container';
import {Row} from 'react-bootstrap';
import {MinecraftServer} from '../constants/Types';
import {useQuery} from 'react-query';

function LandingPage() {

    const {isLoading, data} = useQuery(['servers'], fetchServers);

    if(isLoading) return <></>;

    return <>
        <Container>
            <Row>
                {data && data.map((server: MinecraftServer) => {
                    return <MinecraftServerCard key={server.name} server={server}/>;
                })}
            </Row>
        </Container>
    </>;
}

export default LandingPage;