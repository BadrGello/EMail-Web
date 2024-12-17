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

    moveEmailsFromTrash: "http://localhost:8080/api" + '/moveEmailsFromTrash',

    getContactMail: "http://localhost:8080/api/contacts/getContactMails",
    deleteContactMail: "http://localhost:8080/api/contacts/deleteContactMails",

}

const PAGE_SIZE = 6; // Maximum emails per page

const DefualtFolder = () => {
    // If "sender" is userName, it'll display To: recipients
    const [emails, setEmails] = useState([
    ]);

    const location = useLocation()
    const userName = location.state.userName
    const currentFolder = location.state?.folder ?? 'inbox'; // Default to 'inbox' if folder is null or undefined
    const contactMailsMode = location.state?.contactMailsMode ?? false; // Default to 'inbox' if folder is null or undefined

    const [selectedEmails, setSelectedEmails] = useState([]);
    const [sortType, setSortType] = useState('Date');
    const [sortOrder, setSortOrder] = useState('Ascendingly');
    const [filterBy, setFilterBy] = useState('All');
    const [filterText, setFilterText] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1); // Pagination state

    useEffect(() => {
        handleRefresh();
    }, [userName, currentFolder]);
    
    const [selectAll, setSelectAll] = useState(false);

    // Function to handle the "Select All" checkbox change
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        // Select or deselect all emails based on the checkbox state
        if (!selectAll) {
            // Select all emails
            emails.forEach(email => {
                if (!selectedEmails.includes(email.date)) {
                    handleSelectEmail(email.date);
                }
            });
        } else {
            // Deselect all emails
            emails.forEach(email => {
                if (selectedEmails.includes(email.date)) {
                    handleSelectEmail(email.date);
                }
            });
        }
    };


    const [folders, setFolders] = useState([]); //List of custom folders
    // const [folders, setFolders] = useState([]); //List of custom folders

    const fetchFolders = async () => {
        console.log("Fetching folders..");
        try {
            const response = await axios.get(EndPoints.getFolders, { params: { userName: userName } });
            
            setFolders(response.data);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };


    const handleSelectEmail = (emailId) => {
        setSelectedEmails(prevSelected => 
            prevSelected.includes(emailId) 
                ? prevSelected.filter(date => date !== emailId) 
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
            let apiToSend = EndPoints.getEmails;
            if (contactMailsMode == true){
                apiToSend = EndPoints.getContactMail;
            }


            const response = await axios.get(apiToSend, {
                params: {
                    userName: userName,
                    folderName: currentFolder,

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
            });
            console.log("response of fetching=",response)
            // console.log("attachment",response.data[0].attachment[0])


            // Define the priority mapping
            const priorityMapping = {
                1: 'Urgent',
                2: 'High',
                3: 'Normal',
                4: 'Low',
            };

            // Assuming the response contains an array of email
            const updatedEmails = response.data.map(email => ({
                ...email,
                // Map the priority number to the corresponding string
                priority: priorityMapping[email.priority] || email.priority // Default to current value if no match
            }));

            // Set the state once with the updated email
            setEmails(updatedEmails);
            setCurrentPage(1); // Reset to the first page after refresh

        } catch (error) {
            console.error("Error fetching emails:", error);
        }

        fetchFolders();
    };

    // Done
    const handleMoveToFolder = async (folder) => {

        //If folder is trash
        if (currentFolder === "trash"){
            console.log("Move To Orginal Folders", " the following emails: ", selectedEmails)

            try {
                const response = await axios.post(EndPoints.moveEmailsFromTrash, null ,{
                    params:{
                    userName: userName,
                    folderName: currentFolder,
                    // newFolderName:folder,
                    dates: selectedEmails.toString(),  // Send the list of selected emails IDs to move
                    },
                });
                if (response.status === 200) {
                    handleRefresh();
                } else {
                    console.error("Error moving emails");
                }
            } catch (error) {
                console.error("Error moving emails:", error);
            }

            return
        }


        // Else; as noraml
        console.log("Move To Folder ", folder, " the following emails: ", selectedEmails)

        try {
            const response = await axios.post(EndPoints.moveEmails, null ,{
                params:{
                userName: userName,
                folderName: currentFolder,
                newFolderName:folder,
                dates: selectedEmails.toString(),  // Send the list of selected emails IDs to move
                },
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
        console.log("Delete", selectedEmails.toString())

        try {
            let apiToSend = EndPoints.deleteEmails;
            if (contactMailsMode === true){
                apiToSend = EndPoints.deleteContactMail;
            }

            const response = await axios.post(apiToSend, null,{
                params:{
                userName: userName,
                folderName: currentFolder,
    
                dates: selectedEmails.toString(),  // Send the list of selected draft IDs to delete
                }
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


    const totalPages = Math.ceil(emails.length / PAGE_SIZE);

    // Get emails for the current page
    const paginatedEmails = emails.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                currentFolder={currentFolder}

                contactMailsMode={contactMailsMode}
            />
            
            {/* <div>
                User is {userName} and Folder is {currentFolder}
            </div> */}

            {/* Pagination Controls */}
            <div className="pagination-container">
                    <button className="pagination-button"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        ←
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button className="pagination-button"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </button>
            </div>

            {/* Email List */}
            <div className='list'>
                <ul>

                    {/* Select All checkbox */}
                    <li>
                        <input 
                            type="checkbox" 
                            checked={selectAll} 
                            onChange={handleSelectAllChange} 
                        />
                        <span>Select All</span>
                    </li>

                    {paginatedEmails
                        // .filter(email => 
                        //     email[filterBy]?.toLowerCase().includes(filterText.toLowerCase())
                        // )
                        .map((email) => (
                            <>
                            <li key={email.date}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedEmails.includes(email.date)} 
                                    onChange={() => handleSelectEmail(email.date)} 
                                />
                                <span onClick={() => handleEmailClick(email)}>
                                    {email.subject} - {email.sender === userName ? "To: " + email.recipients.join(', ') : "From: " + email.sender} - {email.date}
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
