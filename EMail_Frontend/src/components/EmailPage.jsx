// EmailPage.js
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Inbox from './Inbox.jsx';
import Compose from './Compose.jsx';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function EmailPage() {

    useEffect(() => {
        const fetchData = async () => {
            try {
                
            } 
            catch (error) {
                console.error('Error fetching data');
            }
        };

        fetchData();
    }, []);

    return (
        <div className='container fullpage'>
            <Sidebar></Sidebar>
                <div className="homepage">
                    <Routes>
                        <Route path="inbox" element={<Inbox />} />
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
