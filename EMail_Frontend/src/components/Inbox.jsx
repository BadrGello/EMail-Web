import React, { useEffect, useState } from 'react';
import { fetchEmails } from './api';

const Inbox = () => {
    const [emails, setEmails] = useState([]);

    return (
            <div>
                Inbox
            </div>
    );
};

export default Inbox;
