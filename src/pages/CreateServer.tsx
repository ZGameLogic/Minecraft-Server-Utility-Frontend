import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {fetchServerVersions} from '../services/MSU-Backend-Service';
import {Card, Col, Row} from 'react-bootstrap';

function CreateServer() {

    const [serverVersionsApiData, setServerVersionsApiData] = useState({});

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedVersion, setSelectedVersion] = useState('');

    const [selectedCategoryVersions, setSelectedCategoryVersions] = useState([]);

    useEffect(() => {
        fetchServerVersions().then(res => {
            const {data} = res;
            const cat = Object.keys(data)[0];

            setServerVersionsApiData(data);
            setSelectedCategory(cat);
            setSelectedCategoryVersions(data[cat].sort(sortMCVersion));
            setSelectedVersion(data[cat].sort(sortMCVersion)[0]);
        });
    }, []);

    function sortMCVersion(a: string, b: string){
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

    function updateVersion(event){
        console.log(event);
    }    
    
    function updateCategory(event){
        setSelectedCategory(event.target.value);
        console.log('versions', serverVersionsApiData[event.target.value].sort(sortMCVersion));
        setSelectedCategoryVersions(serverVersionsApiData[event.target.value].sort(sortMCVersion));
    }

    return(<>
        <Card border='secondary' style={{ width: '50rem' }}>
            <Card.Body>
                <Card.Title>Create Server</Card.Title>
                <Card.Text>
                    <Form>
                        <Form.Group className='mb-3' controlId='formServerName'>
                            <Form.Label>Server name</Form.Label>
                            <Form.Control placeholder="ATM9" />
                        </Form.Group>
                        <Row className='mb-3'>
                            <Form.Group as={Col} controlId='formServerCategory'>
                                <Form.Label>Category</Form.Label>
                                <Form.Select defaultValue={selectedCategory} onChange={updateCategory}>
                                    {Object.keys(serverVersionsApiData).map((cat) => {
                                        return <option key={cat}>{cat}</option>;
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId='formServerVersion'>
                                <Form.Label>Version</Form.Label>
                                <Form.Select defaultValue={selectedVersion} onChange={updateVersion}>
                                    {selectedCategoryVersions.map((ver) => {
                                        return <option key={ver}>{ver}</option>;
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                    </Form>
                </Card.Text>
            </Card.Body>
        </Card>
    </>);
}

export default CreateServer;