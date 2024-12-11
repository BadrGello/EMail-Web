import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EmailToolBar from './EmailToolBar';
import EmailModal from './EmailModal';

const DefualtFolder = () => {
    // If "sender" is userName, it'll display To: recipients
    const [emails, setEmails] = useState([
        {
            id: 1,
            sender: 'badr',
            to: ['bobly@ex.com', 'whoa@no.com'],
            subject: 'Meeting Reminder',
            date: '2024-12-05',
            body: 'Don\'t forget our meeting tomorrow at 10 AM.',
            priority: 'Normal',
            folder: 'inbox',
            attachments: [],
        },
        {
            id: 2,
            sender: 'bob@example.com',
            to: null,
            subject: 'Urgent: Submit Documents',
            date: '2024-12-04',
            body: 'Please submit the required documents by EOD.',
            priority: 'Urgent',
            folder: 'inbox',
            attachments: ['doc1.pdf', 'doc2.pdf', 'pic.png'],
        },
        {
            id: 3,
            sender: 'carol@example.com',
            to: null,
            subject: 'Invoice #12345',
            date: '2024-12-03',
            body: 'Here is your invoice for the recent transaction.',
            priority: 'Normal',
            folder: 'sent',
            attachments: ['invoice12345.pdf'],
        },
        {
            id: 4,
            sender: 'dave@example.com',
            to: null,
            subject: 'Party Invitation',
            date: '2024-12-01',
            body: 'You are invited to a party at my place!',
            priority: 'Low',
            folder: 'drafts',
            attachments: [],
        },
        {
            id: 5,
            sender: 'eve@example.com',
            to: null,
            subject: 'Black Friday Deals!',
            date: '2024-11-29',
            body: 'Check out our exclusive Black Friday deals.',
            priority: 'Normal',
            folder: 'trash',
            attachments: [],
        },
        {
            id: 6,
            sender: 'frank@example.com',
            to: null,
            subject: 'Re: Project Updates',
            date: '2024-12-02',
            body: 'Here are the updates on the project status.',
            priority: 'High',
            folder: 'inbox',
            attachments: ['update.docx'],
        },
    ]);

    const location = useLocation()
    const userName = location.state.userName
    const currentFolder = location.state?.folder ?? 'inbox'; // Default to 'inbox' if folder is null or undefined

    const [selectedEmails, setSelectedEmails] = useState([]);
    const [sortType, setSortType] = useState('Date');
    const [sortOrder, setSortOrder] = useState('Ascendingly');
    const [filterBy, setFilterBy] = useState('Subject');
    const [filterText, setFilterText] = useState('');

    // useEffect(() => {
    //     const loadEmails = async () => {
    //         const emailsData = await fetchEmails(userName);
    //         setEmails(emailsData);
    //     };
    //     loadEmails();
    // }, [userName]);

    const handleSelectEmail = (emailId) => {
        setSelectedEmails(prevSelected => 
            prevSelected.includes(emailId) 
                ? prevSelected.filter(id => id !== emailId) 
                : [...prevSelected, emailId]
        );
    };

    const handleRefresh = () => {
        console.log("Refresh")
        // Fetch emails based on userName and currentFolder (inbox, trash, sent)
    }

    const handleMoveToFolder = () => {
        console.log("Move To Folder", selectedEmails)
    }

    const handleDelete = () => {
        console.log("Delete", selectedEmails)
    }   

    const handleSort = () => {
        alert('Sort applied');
        console.log(sortType, sortOrder, filterText, filterBy)
    };

    const handleFilter = () => {
        alert('Filter applied');
    };

    const handleClearFilter = () => {
        setFilterText('')
        alert('Clear Filter')
    };

    const [currentEmail, setCurrentEmail] = useState(null); // Email to show in modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    const handleEmailClick = (email) => {
        setCurrentEmail(email); // Set current email
        setIsModalOpen(true);   // Open modal
    };

    const handleModalClose = () => {
        setCurrentEmail(null);  // Reset email
        setIsModalOpen(false);  // Close modal
    };


    return (
        <>
            
            <EmailToolBar 

                onRefreshClick={handleRefresh}
                onMoveClick={handleMoveToFolder}
                onDeleteClick={handleDelete}
                onSortClick={handleSort}
                onFilterClick={handleFilter}
                onClearFilterClick={handleClearFilter}

                onSortChange={(e) => setSortType(e.target.value)} //Change sort type
                onOrderChange={(e) => setSortOrder(e.target.value)} //Change order type 
                onFilterChange={(e) => setFilterBy(e.target.value)} //Change filter type
                onFilterTextChange={(e) => setFilterText(e.target.value)} //Filter Text field
                sortType={sortType}
                sortOrder={sortOrder}
                filterBy={filterBy}
                filterText={filterText}
            />
            
            <div>
                User is {userName} and Folder is {currentFolder}
            </div>

            {/* Email List */}
            <div>
                <ul>
                    {emails
                        // .filter(email => 
                        //     email[filterBy]?.toLowerCase().includes(filterText.toLowerCase())
                        // )
                        .map((email) => (
                            <li key={email.id}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedEmails.includes(email.id)} 
                                    onChange={() => handleSelectEmail(email.id)} 
                                />
                                <span onClick={() => handleEmailClick(email)}>
                                    {email.subject} - {email.sender === userName ? "To: " + email.to.join(', ') : "From: " + email.sender} - {email.date}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>

            <EmailModal 
                email={currentEmail} 
                isOpen={isModalOpen} 
                onClose={handleModalClose} 
                userName={userName}
            />
        </>
    );
};

export default DefualtFolder;
