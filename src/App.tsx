import React from 'react';
import './style/Gradiant.css';
import {Route, Routes} from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import CreateServerPage from './pages/CreateServerPage';
import ServerDetailPage from './pages/ServerDetailPage';
import {WebSocketProvider} from './hooks/WebSocketContext';

function App() {
    return (
        <WebSocketProvider>
            <NavBar/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/create" element={<CreateServerPage/>}/>
                <Route path="/view/:server" element={<ServerDetailPage/>}/>
            </Routes>
        </WebSocketProvider>
    );
}

export default App;
