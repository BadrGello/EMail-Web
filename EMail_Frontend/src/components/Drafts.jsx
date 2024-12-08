import { useState } from "react";
import { useLocation } from 'react-router-dom';
import EmailToolBar from './EmailToolBar';
import ComposeModal from "./Compose";

const FormData = {
    id: null,
    sender: '',
    to: [''],
    subject: '',
    body: '',
    attachments: [],
    priority: 'Normal',
    date: '',
}

const Drafts = () => {
    const [drafts, setDrafts] = useState([{
        id: 1,
        sender: 'john.doe@example.com',
        to: ['jane.doe@example.com'],
        subject: 'Meeting Reminder',
        body: 'Just a reminder about the meeting tomorrow at 10 AM.',
        attachments: ['agenda.pdf', 'location-map.jpg'],
        priority: 'High',
        date: '2024-12-08T10:00:00Z'
      },
      {
        id: 2,
        sender: 'alice.smith@example.com',
        to: ['bob.jones@example.com'],
        subject: 'Project Update',
        body: 'Here’s the latest update on the project.',
        attachments: [],
        priority: 'Normal',
        date: '2024-12-07T14:30:00Z'
      },
      {
        id: 3,
        sender: 'mark.brown@example.com',
        to: ['linda.green@example.com', 'idk@idk', 'yesss'],
        subject: 'Invoice for Services Rendered',
        body: 'Please find attached the invoice for your recent project.',
        attachments: [{
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
    const [filterBy, setFilterBy] = useState('Subject');
    const [filterText, setFilterText] = useState('');

    const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
    
    const handleEditOrSend = () => {
        // In both, remove from drafts folder
        alert("Edited or Sent, Should Be Removed From Drafts Folder")
    }

    const handleSelectDraft = (draftId) => {
        setSelectedDrafts(prevSelected => 
            prevSelected.includes(draftId) 
                ? prevSelected.filter(id => id !== draftId) 
                : [...prevSelected, draftId]
        );
    };

    const handleRefresh = () => {
        console.log("Refresh");
        // Fetch drafts based on userName and currentFolder (inbox, trash, sent)
    };

    const handleMoveToFolder = () => {
        // console.log("Move To Folder", selectedDrafts);
        alert("Can't Move Drafts To Another Folder")
    };

    const handleDelete = () => {
        console.log("Delete", selectedDrafts);
        // Delete the selected drafts
        setDrafts(prevDrafts => prevDrafts.filter(draft => !selectedDrafts.includes(draft.id)));
    };

    const handleSort = () => {
        alert('Sort applied');
        console.log(sortType, sortOrder, filterText, filterBy);
    };

    const handleFilter = () => {
        alert('Filter applied');
    };

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
                onDeleteClick={handleDelete}
                onSortClick={handleSort}
                onFilterClick={handleFilter}
                onSortChange={(e) => setSortType(e.target.value)}  // Change sort type
                onOrderChange={(e) => setSortOrder(e.target.value)} // Change order type
                onFilterChange={(e) => setFilterBy(e.target.value)} // Change filter type
                onFilterTextChange={(e) => setFilterText(e.target.value)} // Filter Text field
                sortType={sortType}
                sortOrder={sortOrder}
                filterBy={filterBy}
                filterText={filterText}
            />

            <div>
                User is {userName} and Folder is {currentFolder}
            </div>

            {/* Draft List */}
            <div>
                <ul>
                    {drafts
                        .map((draft) => (
                            <li key={draft.id}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedDrafts.includes(draft.id)} 
                                    onChange={() => handleSelectDraft(draft.id)} 
                                />
                                <span onClick={() => handleDraftClick(draft)}>
                                    {draft.to} - {draft.subject} - {draft.date}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>

            {/* Compose Modal */}
            {modalOpen && <ComposeModal userName={userName} closeModal={() => setModalOpen(false)} initialFormData={currentDraft} onEditOrSend={handleEditOrSend}/>}
        </>
    );
};

export default Drafts;
