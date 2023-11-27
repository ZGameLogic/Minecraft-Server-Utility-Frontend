import React from 'react';
import './style/Gradiant.css';
import {Route, Routes} from 'react-router-dom';
import Landing from './pages/Landing';
import NavBar from './components/NavBar';
import CreateServer from './pages/CreateServer';

function App() {
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/create" element={<CreateServer/>}/>
            </Routes>
        </>
    );
}

export default App;
