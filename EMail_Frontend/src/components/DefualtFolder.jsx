import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EmailToolBar from './EmailToolBar';
import EmailModal from './EmailModal';
import axios from 'axios';

const EndPoints = {
    Base: "http://localhost:8080/api",
    deleteEmails: "http://localhost:8080/api" + '/deleteEmails',
    getEmails: "http://localhost:8080/api" + '/getEmails', //refresh, sort and filter
    moveEmails: "http://localhost:8080/api" + '/moveEmails',

    getFolders: "http://localhost:8080/api/folders",
}

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
    const [filterBy, setFilterBy] = useState('All');
    const [filterText, setFilterText] = useState('');
    
    useEffect(() => {
        handleRefresh();
    }, [userName, currentFolder]);
    
    const [folders, setFolders] = useState(['college', 'games', 'important']); //List of custom folders
    // const [folders, setFolders] = useState([]); //List of custom folders

    const fetchFolders = async () => {
        console.log("Fetching folders..");
        try {
            const response = await axios.get(EndPoints.getFolders, { params: { userName: userName } });
            console.log(response)
            setFolders(response.data);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };


    const handleSelectEmail = (emailId) => {
        setSelectedEmails(prevSelected => 
            prevSelected.includes(emailId) 
                ? prevSelected.filter(id => id !== emailId) 
                : [...prevSelected, emailId]
        );
    };

    // Done
    const handleRefresh = async () => {
        console.log("Fetching emails...");

        console.log(
                {
                    user: userName,
                    folder: currentFolder,

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
        )

        try {
            const response = await axios.get(EndPoints.getEmails, {
                params: {
                    userName: userName,
                    folderName: currentFolder,

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
            });
            setEmails(response.data.emails);  // Assuming response contains an array of emails
        } catch (error) {
            console.error("Error fetching emails:", error);
        }

        fetchFolders();
    };

    // Done
    const handleMoveToFolder = async (folder) => {
        console.log("Move To Folder ", folder, " the following emails: ", selectedEmails)

        try {
            const response = await axios.post(EndPoints.moveEmails, {
                user: userName,
                folder: currentFolder,
    
                emailIds: selectedEmails,  // Send the list of selected emails IDs to move
            });
            if (response.status === 200) {
                handleRefresh();
            } else {
                console.error("Error moving emails");
            }
        } catch (error) {
            console.error("Error moving emails:", error);
        }

    }

    // Done
    const handleDelete = async () => {
        console.log("Delete", selectedEmails)

        try {
            const response = await axios.post(EndPoints.deleteEmails, {
                user: userName,
                folder: currentFolder,
    
                emailIds: selectedEmails,  // Send the list of selected draft IDs to delete
            });
            if (response.status === 200) {
                handleRefresh();
            } else {
                console.error("Error deleting emails");
            }
        } catch (error) {
            console.error("Error deleting emails:", error);
        }
    }   

    // Done
    const handleSort = () => {
        alert('Sort applied');
        handleRefresh()
        console.log(sortType, sortOrder, filterText, filterBy)
    };

    // Done
    const handleFilter = () => {
        alert('Filter applied');
        handleRefresh()
    };

    // Done
    const [triggerNextAction, setTriggerNextAction] = useState(false);
    const handleClearFilter = () => {
        setFilterText('')
        setTriggerNextAction(true);
        
    };
    // This useEffect to handle issues of sync of setFilterText(''), so it clears the text first then it refresh
    useEffect(() => {
        if (triggerNextAction) {
            handleRefresh()
            setTriggerNextAction(false);
        }
    }, [filterText, triggerNextAction]);

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

                folders={folders}
            />
            
            <div>
                User is {userName} and Folder is {currentFolder}
            </div>

            {/* Email List */}
            <div className='list'>
                <ul>
                    {emails
                        // .filter(email => 
                        //     email[filterBy]?.toLowerCase().includes(filterText.toLowerCase())
                        // )
                        .map((email) => (
                            <>
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
                            <div id='list-seperator'></div>
                            </>
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
