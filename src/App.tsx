import React from 'react';
import './style/App.css';
import './style/Gradiant.css';
import {Route, Routes} from 'react-router-dom';
import Landing from './pages/Landing';
import NavBar from "./components/NavBar";

function App() {
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Landing/>}/>
            </Routes>
        </>
    );
}

export default App;
