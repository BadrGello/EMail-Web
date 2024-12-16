import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import EmailToolBar from './EmailToolBar';
import ComposeModal from "./Compose";
import axios from "axios";

const FormData = {
    id: null,
    sender: '',
    recipients: [''],
    subject: '',
    body: '',
    attachment: [],
    priority: 'Normal',
    date: '',
}

const EndPoints = {
    Base: "http://localhost:8080/api",
    deleteDrafts: "http://localhost:8080/api" + '/deleteEmails',
    getDrafts: "http://localhost:8080/api" + '/getEmails', //refresh, sort and filter

    getFolders: "http://localhost:8080/api/folders",
}


const Drafts = () => {
    const [drafts, setDrafts] = useState([{
        id: '2024-12-08T10:00:00Z',
        sender: 'john.doe@example.com',
        recipients: ['jane.doe@example.com'],
        subject: 'Meeting Reminder',
        body: 'Just a reminder about the meeting tomorrow at 10 AM.',
        attachment: ['agenda.pdf', 'location-map.jpg'],
        priority: 'High',
        date: '2024-12-08T10:00:00Z'
      },
      {
        id: '2024-12-07T14:30:00Z',
        sender: 'alice.smith@example.com',
        recipients: ['bob.jones@example.com'],
        subject: 'Project Update',
        body: 'Here’s the latest update on the project.',
        attachment: [],
        priority: 'Normal',
        date: '2024-12-07T14:30:00Z'
      },
      {
        id: '2024-12-06T09:15:00Z',
        sender: 'mark.brown@example.com',
        recipients: ['linda.green@example.com', 'idk@idk', 'yesss'],
        subject: 'Invoice for Services Rendered',
        body: 'Please find attached the invoice for your recent project.',
        attachment: [{
            "name": "file1.txt",
            "size": 1024,
            "type": "text/plain",
            "lastModified": 1618457890000,
            "lastModifiedDate": "Mon, 15 Mar 2021 17:24:50 GMT",
            "webkitRelativePath": ""
          },
          {
            "name": "file2.jpg",
            "size": 2048,
            "type": "image/jpeg",
            "lastModified": 1618457891000,
            "lastModifiedDate": "Mon, 15 Mar 2021 17:25:00 GMT",
            "webkitRelativePath": ""
          }],
        priority: 'Normal',
        date: '2024-12-06T09:15:00Z'
      },]);  // Initialize with an empty array

    const location = useLocation();
    const userName = location.state.userName;
    const currentFolder = location.state?.folder ?? 'inbox'; // Default to 'inbox' if folder is null or undefined

    const [selectedDrafts, setSelectedDrafts] = useState([]);
    const [sortType, setSortType] = useState('Date');
    const [sortOrder, setSortOrder] = useState('Ascendingly');
    const [filterBy, setFilterBy] = useState('All');
    const [filterText, setFilterText] = useState('');

    const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
    
    useEffect(() => {
        handleRefresh();
    }, [userName]);

    const [folders, setFolders] = useState(null); //List of custom folders

    // const fetchFolders = async () => {
    //     console.log("Fetching folders..");
    //     try {
    //         const response = await axios.get(EndPoints.getFolders, { params: { user: userName } });
    //         setFolders(response.data.folders);
    //     } catch (error) {
    //         console.error("Error fetching folders:", error);
    //     }
    // };

    // Done
    const handleEditOrSend = () => {
        // In both, remove from drafts folder
        // send to back to delete the draft that was just sent/edited. (The rest of details should be already handled by Compose.jsx itself)

        alert("Edited or Sent, Should Be Removed From Drafts Folder")
        console.log(currentDraft)
        handleDelete([currentDraft.date])
    }

    const handleSelectDraft = (draftId) => {
        setSelectedDrafts(prevSelected => 
            prevSelected.includes(draftId) 
                ? prevSelected.filter(date => date !== draftId) 
                : [...prevSelected, draftId]
        );
    };

    // Fetch drafts based on userName and currentFolder (inbox, trash, sent)
    // Done
    const handleRefresh = async () => {
        console.log("Fetching drafts...");

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
            const response = await axios.get(EndPoints.getDrafts, {
                params: {
                    user: userName,
                    folder: currentFolder,

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
            });
            setDrafts(response.data.emails);  // Assuming response contains an array of drafts
        } catch (error) {
            console.error("Error fetching drafts:", error);
        }

        // fetchFolders();
    };

    const handleMoveToFolder = (folder) => {
        alert("Can't move drafts to another folder")
    };

    // Done
    const handleDelete = async (drafts) => {
        console.log("Deleting.. ", drafts);
        
        try {
            const response = await axios.post(EndPoints.deleteDrafts, {
                user: userName,
                folder: currentFolder,
    
                emailIds: drafts,  // Send the list of selected draft IDs to delete
            });
            if (response.status === 200) {
                handleRefresh();
            } else {
                console.error("Error deleting drafts");
            }
        } catch (error) {
            console.error("Error deleting drafts:", error);
        }
    };

    // Done
    const handleSort = () => {
        alert('Sort applied');
        handleRefresh()
        console.log(sortType, sortOrder, filterText, filterBy);
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

    const [currentDraft, setCurrentDraft] = useState(null); // Draft to show in modal
    const handleDraftClick = (draft) => {
        setCurrentDraft(draft); // Set current draft
        setModalOpen(true);     // Open modal
    };

    return (
        <>
            <EmailToolBar 
                onRefreshClick={handleRefresh}
                onMoveClick={handleMoveToFolder}
                onDeleteClick={() => {handleDelete(selectedDrafts)}}
                onSortClick={handleSort}
                onFilterClick={handleFilter}
                onClearFilterClick={handleClearFilter}
                onSortChange={(e) => setSortType(e.target.value)}  // Change sort type
                onOrderChange={(e) => setSortOrder(e.target.value)} // Change order type
                onFilterChange={(e) => setFilterBy(e.target.value)} // Change filter type
                onFilterTextChange={(e) => setFilterText(e.target.value)} // Filter Text field
                sortType={sortType}
                sortOrder={sortOrder}
                filterBy={filterBy}
                filterText={filterText}

                folders={folders}
            />

            <div>
                User is {userName} and Folder is {currentFolder}
            </div>

            {/* Draft List */}
            <div className='list'>
                <ul>
                    {drafts
                        .map((draft) => (
                            <>
                            <li key={draft.date}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedDrafts.includes(draft.date)} 
                                    onChange={() => handleSelectDraft(draft.date)} 
                                />
                                <span onClick={() => handleDraftClick(draft)}>
                                    {draft.recipients} - {draft.subject} - {draft.date}
                                </span>
                            </li>
                            <div id='list-seperator'></div>
                            </>
                        ))}
                </ul>
            </div>

            {/* Compose Modal */}
            {modalOpen && <ComposeModal userName={userName} closeModal={() => setModalOpen(false)} initialFormData={currentDraft} onEditOrSend={handleEditOrSend}/>}
        </>
    );
};

export default Drafts;
