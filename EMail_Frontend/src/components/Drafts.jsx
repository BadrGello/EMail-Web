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

const PAGE_SIZE = 6; // Maximum emails per page

const Drafts = () => {
    const [drafts, setDrafts] = useState([]);  // Initialize with an empty array

    const location = useLocation();
    const userName = location.state.userName;
    const currentFolder = location.state?.folder ?? 'inbox'; // Default to 'inbox' if folder is null or undefined

    const [selectedDrafts, setSelectedDrafts] = useState([]);
    const [sortType, setSortType] = useState('Date');
    const [sortOrder, setSortOrder] = useState('Ascendingly');
    const [filterBy, setFilterBy] = useState('All');
    const [filterText, setFilterText] = useState('');

    const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
    
    const [currentPage, setCurrentPage] = useState(1); // Pagination state

    useEffect(() => {
        handleRefresh();
    }, [userName]);

    const [folders, setFolders] = useState(null); //List of custom folders

    const [selectAll, setSelectAll] = useState(false);

    // Function to handle the "Select All" checkbox change
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        // Select or deselect all drafts based on the checkbox state
        if (!selectAll) {
            // Select all drafts
            drafts.forEach(draft => {
                if (!selectedDrafts.includes(draft.date)) {
                    handleSelectDraft(draft.date);
                }
            });
        } else {
            // Deselect all drafts
            drafts.forEach(draft => {
                if (selectedDrafts.includes(draft.date)) {
                    handleSelectDraft(draft.date);
                }
            });
        }
    };

    
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
                    userName: userName,
                    folderName: currentFolder,

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
        )

        try {
            const response = await axios.get(EndPoints.getDrafts, {
                params: {
                    userName: userName,
                    folderName: "draft",

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
            });
            console.log("response of fetching=",response)

            // Define the priority mapping
            const priorityMapping = {
                1: 'Urgent',
                2: 'High',
                3: 'Normal',
                4: 'Low',
            };

            // Assuming the response contains an array of drafts
            const updatedDrafts = response.data.map(draft => ({
                ...draft,
                // Map the priority number to the corresponding string
                priority: priorityMapping[draft.priority] || draft.priority // Default to current value if no match
            }));

            // Set the state once with the updated drafts
            setDrafts(updatedDrafts);
            setCurrentPage(1); // Reset to the first page after refresh

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
            const response = await axios.post(EndPoints.deleteDrafts, null,{
                params:{
                userName: userName,
                folderName: "draft",
    
                dates: drafts.toString(),  // Send the list of selected draft IDs to delete
                }
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


    const totalPages = Math.ceil(drafts.length / PAGE_SIZE);

    // Get emails for the current page
    const paginatedDrafts = drafts.slice(
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
                currentFolder={currentFolder}

                contactMailsMode={false}
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

            {/* Draft List */}
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

                    {paginatedDrafts
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
