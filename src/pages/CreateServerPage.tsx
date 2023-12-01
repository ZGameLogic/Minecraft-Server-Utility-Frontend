import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {createServer, fetchServerVersions, validateServerCreation} from '../services/MSU-Backend-Service';
import {Button, Card, Col, Row} from 'react-bootstrap';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useNavigate} from 'react-router-dom';

function CreateServerPage() {

    const navigate = useNavigate();

    const [serverVersionsApiData, setServerVersionsApiData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryVersions, setSelectedCategoryVersions] = useState([]);

    const [apiDataLoaded, setApiDataLoaded] = useState(false);

    const [serverValidationLoading, setServerValidationLoading] = useState(false);
    const [serverValid, setServerValid] = useState(false);

    useEffect(() => {
        fetchServerVersions().then(res => {
            const {data} = res;
            const cat = 'vanilla';

            setServerVersionsApiData(data);
            setSelectedCategory(cat);
            setSelectedCategoryVersions(data[cat].sort(sortMCVersion));
            setApiDataLoaded(true);
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
        setSelectedCategory(value);
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
                navigate(`/view/${values.name}`);
            });
        }).catch(reason => {
            const conflictData = reason.response.data.data;
            setErrors(conflictData);
            setServerValidationLoading(false);
        });
    }

    const schema = yup.object().shape({
        name: yup.string().required('Server name is required'),
        port: yup.number()
            .min(25500, 'Must be bigger than 25000')
            .max(29999, 'Must be smaller than 29999')
            .required('Server port is required'),
        startCommand: yup.string().required('Start command is required'),
        updateScript: yup.string().required('Update script is required')
    });

    return apiDataLoaded && <Card border='secondary' style={{ width: '50rem' }}>
            <Card.Body>
                <Card.Title>Create Server</Card.Title>
                <Formik
                    validationSchema={schema}
                    onSubmit={submitForm}
                    initialValues={{
                        name: '',
                        port: 25565,
                        startCommand: 'java -jar server.jar nogui',
                        category: selectedCategory,
                        version: '1.20.2',
                        updateScript: '',
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
                                />
                                <Form.Control.Feedback type="invalid">
                                    <>{errors.port}</>
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId='formServerCategory'>
                                <Form.Label>Category</Form.Label>
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
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId='formServerVersion'>
                                <Form.Label>Version</Form.Label>
                                <Form.Select
                                    name="version"
                                    value={values.version}
                                    onChange={handleChange}
                                >
                                    {selectedCategoryVersions.map((ver) => {
                                        return <option key={ver}>{ver}</option>;
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Form.Check
                            type="switch"
                            name="autoStart"
                            value={values.autoStart}
                            onChange={handleChange}
                            label="Auto start"
                            inline
                        />
                        <Form.Check
                            type="switch"
                            name="autoUpdate"
                            value={values.autoUpdate}
                            onChange={handleChange}
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
                            />
                            <Form.Control.Feedback type="invalid">
                                <>{errors.startCommand}</>
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="serverUpdateScript">
                            <Form.Label>Update script</Form.Label>
                            <Form.Control
                                type="text"
                                name="updateScript"
                                value={values.updateScript}
                                onChange={handleChange}
                                isInvalid={!!errors.updateScript}
                            />
                            <Form.Control.Feedback type="invalid">
                                <>{errors.updateScript}</>
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                            type="submit"
                            disabled={serverValidationLoading || serverValid}
                        >
                            {serverValid ? 'Creating...' : serverValidationLoading ? 'Validating...' : 'Create Server'}
                        </Button>
                    </Form>
                )}
                </Formik>
            </Card.Body>
        </Card>;
}

export default CreateServerPage;