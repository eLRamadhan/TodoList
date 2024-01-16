import React, { useState } from 'react';
import { Container, Tabs, Tab, Button, Row, Col, FormControl, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ onLogin }) => {
    const [activeKey, setActiveKey] = useState('tab1');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleTabClick = (key) => {
        if (key === activeKey) {
            return;
        }

        setActiveKey(key);
    };

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://94.74.86.174:8080/api/login', {
                username: username,
                password: password
            });

            const token = response.data.data.token;
            localStorage.setItem('token', token);

            onLogin(token);

            navigate('/todo');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const handleSignUp = async () => {
        try {
            await axios.post('http://94.74.86.174:8080/api/register', {
                email: username,
                username: username,
                password: password
            });

            Swal.fire({
                icon: 'success',
                title: 'Pendaftaran Berhasil!',
                text: 'Silahkan Login.',
            });
        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    return (
        <Container className="p-3 my-5 d-flex flex-column">
            <Tabs
                id="controlled-tabs"
                activeKey={activeKey}
                onSelect={(k) => handleTabClick(k)}
                justify
                className='mb-3 d-flex flex-row justify-content-between'
            >
                <Tab eventKey="tab1" title="Login">
                    <Form className='mb-4'>
                        <FormControl
                            placeholder='Username'
                            type='text'
                            className='mb-2'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FormControl
                            placeholder='Password'
                            type='password'
                            className='mb-2'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Row>
                            <Col className="text-center mt-3" lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={12}>
                                <Button className="w-100" onClick={handleSignIn}>Sign in</Button>
                            </Col>
                        </Row>
                    </Form>
                </Tab>
                <Tab eventKey="tab2" title="Register">
                    {/* Content for Tab 2 */}
                    <Form className='mb-4'>
                        <FormControl placeholder='Email' type='email' className='mb-2' />
                        <FormControl placeholder='Username' type='text' className='mb-2' />
                        <FormControl placeholder='Password' type='password' className='mb-2' />
                        <Row>
                            <Col className="text-center mt-3" lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={12}>
                                <Button className="w-100" onClick={handleSignUp}>Sign up</Button>
                            </Col>
                        </Row>
                    </Form>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Login;
