import React from 'react';
import './style/Gradiant.css';
import {Route, Routes} from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import ServerDetailPage from './pages/ServerDetailPage';
import {WebSocketProvider} from './hooks/WebSocketContext';
import CreateServerPage from './pages/CreateServerPage';
import CallbackPage from './pages/CallbackPage';
import {AuthProvider} from './hooks/AuthContext';
import {ToastProvider} from './hooks/ToastContext';
import UserManagementPage from './pages/UserManagementPage';

function App() {
    return (
        <ToastProvider>
            <WebSocketProvider>
                <AuthProvider>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<LandingPage/>}/>
                        <Route path="/login/callback" element={<CallbackPage/>}/>
                        <Route path="/create" element={<CreateServerPage/>}/>
                        <Route path="/view/:server" element={<ServerDetailPage/>}/>
                        <Route path="/users" element={<UserManagementPage/>}/>
                    </Routes>
                </AuthProvider>
            </WebSocketProvider>
        </ToastProvider>
    );
}

export default App;
