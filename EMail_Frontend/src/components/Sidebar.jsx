import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
    <div className="sidebar">
        
            <Link to="/home/compose">Compose</Link>
            <Link to="/home/inbox">Inbox</Link>
            <Link to="/home/sent">Sent</Link>
            <Link to="/home/drafts">Drafts</Link>
            <Link to="/home/trash">Trash</Link>
            <Link to="/home/folders">Folders</Link>
            <Link to="/home/contacts">Contacts</Link>
    </div>
);

export default Sidebar;
