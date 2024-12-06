// EmailPage.js
import React, { useEffect, useState } from 'react';
import DefualtFolder from './DefualtFolder.jsx';
import Compose from './Compose.jsx';
import { BrowserRouter as Router, Route, Routes, useLocation , Link,useNavigate} from "react-router-dom";

function EmailPage() {

    // When we login, we get the userName that was passed
    const location = useLocation()
    const navigate = useNavigate();
    const userName = location.state.userName

    return (
        <div className='container fullpage'>
            <div className="sidebar">
                <button onClick={()=> {navigate("/home/compose", {replace: true, state:{userName}})}} id='side-button'>Compose</button>
                <button  onClick={()=> {navigate("/home", {replace: true, state:{userName, folder:"inbox"}})}} id='side-button'>Inbox</button>
                <button  onClick={()=> {navigate("/home", {replace: true, state:{userName, folder:"sent"}})}} id='side-button'>Sent</button>
                <button  onClick={()=> {navigate("/home/drafts", {replace: true, state:{userName}})}} id='side-button'>Drafts</button>
                <button  onClick={()=> {navigate("/home", {replace: true, state:{userName, folder:"trash"}})}} id='side-button'>Trash</button>
                <button  onClick={()=> {navigate("/home/folders", {replace: true, state:{userName}})}} id='side-button'>Folders</button>
                <button  onClick={()=> {navigate("/home/contacts", {replace: true, state:{userName}})}} id='side-button'>Contacts</button>

                {/* Handle Log Out */}
                <button  onClick={()=> {navigate("/login", {replace: true, state:{userName}})}} id='side-button'>Log Out</button>
            </div>
                <div className="homepage" id='content'>
                    <Routes>
                        <Route path="/" element={<DefualtFolder/>} />
                        <Route path="compose" element={<Compose />} />
                        {/* 
                        <Route path="draft" element={<Draft />} />
                        <Route path="folders" element={<Folders />} />
                        <Route path="contacts" element={<Contacts />} /> */}
                    </Routes>
                </div>
        </div>
    );
}

export default EmailPage;
