// EmailPage.js
import React, { useEffect, useState } from 'react';
import Inbox from './Inbox.jsx';
import Compose from './Compose.jsx';
import { BrowserRouter as Router, Route, Routes, useLocation , Link,useNavigate} from "react-router-dom";

function EmailPage() {

    // When we login, we get the userName that was passed
    const location = useLocation()
    const navigate = useNavigate();
    const userName = location.state.userName
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
                
    //         } 
    //         catch (error) {
    //             console.error('Error fetching data');
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <div className='container fullpage'>
            <div className="sidebar">
                <button onClick={()=> {navigate("/home/compose", {replace: true, state:{userName}})}} id='side-button'>Compose</button>
                <button  onClick={()=> {navigate("/home/inbox", {replace: true, state:{userName}})}} id='side-button'>Inbox</button>
                <button  onClick={()=> {navigate("/home/sent", {replace: true, state:{userName}})}} id='side-button'>Sent</button>
                <button  onClick={()=> {navigate("/home/drafts", {replace: true, state:{userName}})}} id='side-button'>Drafts</button>
                <button  onClick={()=> {navigate("/home/trash", {replace: true, state:{userName}})}} id='side-button'>Trash</button>
                <button  onClick={()=> {navigate("/home/folders", {replace: true, state:{userName}})}} id='side-button'>Folders</button>
                <button  onClick={()=> {navigate("/home/contacts", {replace: true, state:{userName}})}} id='side-button'>Contacts</button>
            </div>
                <div className="homepage" id='content'>
                    <div className='welcome'>Welcome {userName}</div>
                    <Routes>
                        <Route path="inbox" element={<Inbox/>} />
                        {/* <Route path="compose" element={<Compose />} /> */}
                        {/* <Route path="sent" element={<Sent />} />
                        <Route path="draft" element={<Draft />} />
                        <Route path="trash" element={<Trash />} />
                        <Route path="folders" element={<Folders />} />
                        <Route path="contacts" element={<Contacts />} /> */}
                    </Routes>
                </div>
        </div>
    );
}

export default EmailPage;
