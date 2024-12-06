import React, { useEffect, useState } from 'react';
import { fetchEmails } from './api';
import { useLocation } from 'react-router-dom';

const Inbox = () => {
    const [emails, setEmails] = useState([]);
    const location = useLocation()
    const userName = location.state.userName

    return (
            <div>
                Inbox of {userName}
            </div>
    );
};

export default Inbox;
