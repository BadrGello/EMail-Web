import React, { useEffect, useState } from 'react';
import { fetchEmails } from './api';
import Pagination from './Pagination';

const Inbox = () => {
    const [emails, setEmails] = useState([]);

    return (
            <div>
                Inbox
            </div>
    );
};

export default Inbox;
