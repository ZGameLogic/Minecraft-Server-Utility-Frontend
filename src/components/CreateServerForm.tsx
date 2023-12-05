import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {createServer, fetchServerVersions, validateServerCreation} from '../services/MSU-Backend-Service';
import {Button, Card, Col, Placeholder, Row, Toast, ToastContainer} from 'react-bootstrap';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useNavigate} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import '../style/create-server.css';
import Stomp from 'stompjs';
import {useWebSocket} from '../hooks/WebSocketContext';

function CreateServerForm() {
    const navigate = useNavigate();

    const [serverVersionsApiData, setServerVersionsApiData] = useState({});
    const [selectedCategoryVersions, setSelectedCategoryVersions] = useState([]);

    const [apiDataLoaded, setApiDataLoaded] = useState(false);

    const [serverValidationLoading, setServerValidationLoading] = useState(false);
    const [serverValid, setServerValid] = useState(false);
    const [showError, setShowError] = useState(false);

    const webSocket:Stomp.Client = useWebSocket();

    useEffect(() => {
        fetchServerVersions().then(res => {
            const {data} = res;
            const cat = 'vanilla';

            setServerVersionsApiData(data);
            setSelectedCategoryVersions(data[cat].sort(sortMCVersion));
            setApiDataLoaded(true);
        }, (error) => {
            setShowError(true);
            console.error(error);
        });
    }, []);

    function sortMCVersion(a: string, b: string){
        const aSplit = a.split('.');
        const aRelease = parseInt(aSplit[0], 10);
        const aUpdate = parseInt(aSplit[1] ?? '0', 10);
        const aVersion = parseInt(aSplit[2] ?? '0', 10);

        const bSplit = b.split('.');
        const bRelease = parseInt(bSplit[0], 10);
        const bUpdate = parseInt(bSplit[1] ?? '0', 10);
        const bVersion = parseInt(bSplit[2] ?? '0', 10);

        return aRelease === bRelease ?
            aUpdate === bUpdate ?
                aVersion < bVersion
                : aUpdate < bUpdate
            : aRelease < bRelease;
    }

    function updateCategory(event, setFieldValue){
        const {value} = event.target;
        setSelectedCategoryVersions(
            value === 'vanilla' ? serverVersionsApiData[value].sort(sortMCVersion) : serverVersionsApiData[value]
        );
        setFieldValue('version', value === 'vanilla' ? serverVersionsApiData[value].sort(sortMCVersion)[0] : serverVersionsApiData[value][0]);
    }

    function submitForm(values, {setErrors}){
        setServerValid(false);
        setServerValidationLoading(true);
        validateServerCreation(values).then(() => {
            setServerValid(true);
            setServerValidationLoading(false);
            createServer(values).then(()=> {
                webSocket?.subscribe(`/server/${values.name}`, (message) => {
                    const body = JSON.parse(message.body);
                    if(body.server === values.name) {
                        if (body.messageType === 'install') {
                            console.log(body);
                            if(body.message === 'Installed'){
                                webSocket?.unsubscribe(`/server/${values.name}`);
                                navigate(`/view/${values.name}`);
                            }
                        }
                    }
                });
            });
        }).catch(reason => {
            const conflictData = reason.response.data.data;
            setErrors(conflictData);
            setServerValidationLoading(false);
        });
    }

    function clearError(){
        setShowError(false);
    }

    const schema = yup.object().shape({
        name: yup.string().required('Server name is required'),
        port: yup.number()
            .min(25500, 'Must be bigger than 25000')
            .max(29999, 'Must be smaller than 29999')
            .required('Server port is required'),
        startCommand: yup.string().required('Start command is required')
    });

    return <>
        <ToastContainer position={'top-center'} className='fetchToastError'>
            <Toast show={showError} onClose={clearError} animation={true} bg={'danger'} >
                <Toast.Header>
                    <strong className="me-auto">Error loading some key information</strong>
                </Toast.Header>
                <Toast.Body>Unable to load server categories and versions</Toast.Body>
            </Toast>
        </ToastContainer>
        <Container className='createServerFormContainer'>
            <Card border='secondary' style={{ width: '50rem' }}>
                <Card.Body>
                    <Card.Title>Create Server</Card.Title>
                    <Formik
                        validationSchema={schema}
                        onSubmit={submitForm}
                        initialValues={{
                            name: '',
                            port: 25565,
                            startCommand: 'java -jar server.jar nogui',
                            category: 'vanilla',
                            autoStart: false,
                            autoUpdate: false
                        }}
                    >{({ handleSubmit, handleChange, errors, values, setFieldValue}) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="serverName">
                                    <Form.Label>Server name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder={'ATM9'}
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                        disabled={!apiDataLoaded}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <>{errors.name}</>
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="serverPort">
                                    <Form.Label>Server port</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="port"
                                        value={values.port}
                                        onChange={handleChange}
                                        isInvalid={!!errors.port}
                                        disabled={!apiDataLoaded}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        <>{errors.port}</>
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId='formServerCategory'>
                                    <Form.Label>Category</Form.Label>
                                    {apiDataLoaded ?
                                        <Form.Select
                                            name="category"
                                            value={values.category}
                                            onChange={event => {
                                                handleChange(event);
                                                updateCategory(event, setFieldValue);
                                            }}
                                        >
                                            {Object.keys(serverVersionsApiData).map((cat) => {
                                                return <option key={cat}>{cat}</option>;
                                            })}
                                        </Form.Select>:
                                        <Placeholder as={Form.Select}/>
                                    }
                                </Form.Group>
                                <Form.Group as={Col} controlId='formServerVersion'>
                                    <Form.Label>Version</Form.Label>
                                    {apiDataLoaded ?
                                        <Form.Select
                                            name="version"
                                            value={values.version}
                                            onChange={handleChange}
                                        >
                                            {selectedCategoryVersions.map((ver) => {
                                                return <option key={ver}>{ver}</option>;
                                            })}
                                        </Form.Select>:
                                        <Placeholder as={Form.Select}/>
                                    }
                                </Form.Group>
                            </Row>
                            <Form.Check
                                type="switch"
                                name="autoStart"
                                value={values.autoStart}
                                onChange={handleChange}
                                disabled={!apiDataLoaded}
                                label="Auto start"
                                inline
                            />
                            <Form.Check
                                type="switch"
                                name="autoUpdate"
                                value={values.autoUpdate}
                                onChange={handleChange}
                                disabled={!apiDataLoaded}
                                label="Auto update"
                                inline
                            />
                            <Form.Group as={Col} controlId="serverStartCommand">
                                <Form.Label>Start command</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="startCommand"
                                    value={values.startCommand}
                                    onChange={handleChange}
                                    isInvalid={!!errors.startCommand}
                                    disabled={!apiDataLoaded}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <>{errors.startCommand}</>
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button
                                type="submit"
                                disabled={serverValidationLoading || serverValid || !apiDataLoaded}
                            >
                                {serverValid ? 'Creating...' : serverValidationLoading ? 'Validating...' : 'Create Server'}
                            </Button>
                        </Form>
                    )}
                    </Formik>
                </Card.Body>
            </Card>
        </Container>
    </>;
}

export default CreateServerForm;