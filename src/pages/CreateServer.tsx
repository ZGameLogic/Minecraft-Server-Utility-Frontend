import React, {useEffect, useState} from 'react';
import {fetchServerVersions} from '../services/MSU-Backend-Service';
import {Card} from 'react-bootstrap';

function CreateServer() {

    const [serverVersionsApiData, setServerVersionsApiData] = useState({});

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedVersion, setSelectedVersion] = useState('');

    const [selectedCategoryVersions, setSelectedCategoryVersions] = useState([]);

    useEffect(() => {
        fetchServerVersions().then(res => {
            const {data} = res;
            setServerVersionsApiData(data);
            setSelectedCategory(Object.keys(data)[0]);
            setSelectedCategoryVersions(data[Object.keys(data)[0]].sort(sortMCVersion));
            setSelectedVersion(data[Object.keys(data)[0]].sort(sortMCVersion)[0]);
        });
    }, []);

    function sortMCVersion(a, b){
        const aSplit = a.split('.');
        const aRelease = parseInt(aSplit[0], 10);
        const aUpdate = parseInt(aSplit[1], 10) ?? 0;
        const aVersion = parseInt(aSplit[2], 10) ?? 0;

        const bSplit = b.split('.');
        const bRelease = parseInt(bSplit[0], 10);
        const bUpdate = parseInt(bSplit[1], 10) ?? 0;
        const bVersion = parseInt(bSplit[2], 10) ?? 0;

        return aRelease === bRelease ?
            aUpdate === bUpdate ?
                aVersion < bVersion
                : aUpdate < bUpdate
            : aRelease < bRelease;
    }

    return(<>
        <Card border="secondary" style={{ width: '33rem' }}>
            <Card.Body>
                <Card.Title>Create Server</Card.Title>
                <Card.Text>
                    <p>{selectedCategory}</p>
                    <p>{selectedVersion}</p>
                </Card.Text>
            </Card.Body>
        </Card>
    </>);
}

export default CreateServer;