import React, { useEffect, useState } from 'react';


////////////////*ICONS*///////////
import { MdFilterAlt,MdSort, MdRefresh, MdFilterNone, MdFilterAltOff } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import { MdDriveFileMove } from "react-icons/md";
//////////////////////////////////



const EmailToolbar = ({ onRefreshClick, onMoveClick, onDeleteClick, onSortChange, onOrderChange, onFilterChange, onFilterTextChange, onSortClick, onFilterClick, onClearFilterClick, sortType, sortOrder, filterBy, filterText, folders, currentFolder, contactMailsMode }) => {
    
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [MoveTitle, setMoveTitle] = useState("Move to")

    useEffect(() => {
        if (contactMailsMode === true){
            setMoveTitle("Can't move from a contact's folder!")

        }
        if (currentFolder === "drafts") {
            setMoveTitle("");
        }
        else if (currentFolder === "trash"){
            setMoveTitle("Move to original folders")
        }
        else {
            setMoveTitle("Move to")
        }
    }, [currentFolder]);


    const toggleDropdown = () => {
        if (contactMailsMode === true){
            alert("Can't move from a contact's folder!")
            return
        }

        if (currentFolder === "drafts"){
            alert("Can't move drafts to another folder")
            return
        }

        if (currentFolder === "trash"){

            onMoveClick(null);
            
            return
        }

        setDropdownVisible((prev) => !prev);
    };

    const handleFolderSelect = (folder) => {
        onMoveClick(folder); // Call the onMoveClick function with the selected folder
        setDropdownVisible(false); // Close the dropdown after selection
    };

    return (
        <div className="email toolbar">

            <button onClick={onRefreshClick} id='icon-button' title="Refresh"><MdRefresh id='icon'/></button>
            {/* <button onClick={handleMoveClick} id='icon-button' title="Move"><MdDriveFileMove /></button> */}

            {/* Move Button with Dropdown */}
            <div id="move-folder" style={{ position: 'relative', display: 'inline-block' }}>
                <button onClick={toggleDropdown} id='icon-button' title={MoveTitle}>
                    <MdDriveFileMove id="icon" />
                </button>
                {isDropdownVisible && (
                    <ul className="dropdown-menu" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        listStyle: 'none',
                        padding: '0.5em',
                        margin: 0,
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000
                    }}>
                        {folders.map((folder) => (
                            <li 
                                key={folder} 
                                style={{ padding: '0.5em', cursor: 'pointer' }}
                                onClick={() => handleFolderSelect(folder)}
                            >
                                {folder}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button onClick={onDeleteClick} id='icon-button' title="Delete"><IoTrashBin /></button>

            <div id='sort'>
                <p>Sort By: </p>

                {/* Sorting Options */}
                <select value={sortType} onChange={onSortChange}>
                    <option value="Date">Date</option>
                    <option value="Priority">Priority</option>
                    <option value="Sender">Sender</option>
                    <option value="Subject">Subject</option>
                    <option value="Body">Body</option>
                </select>

                <select value={sortOrder} onChange={onOrderChange}>
                    <option value="Ascendingly">Ascendingly</option>
                    <option value="Descendingly">Descendingly</option>
                </select>

                <button onClick={onSortClick} id='icon-button' title="Sort"><MdSort id='icon'/></button>
            </div>

            <div id='filter'>
            <p>Filter By: </p>

            {/* Filtering Options */}
            <select value={filterBy} onChange={onFilterChange}>
                <option value="All">All</option>
                <option value="Subject">Subject</option>
                <option value="Sender">Sender</option>
            </select>

            <input 
                type="text" 
                value={filterText} 
                onChange={onFilterTextChange} 
                placeholder="Filter text"
            />
            <button onClick={onFilterClick}id='icon-button' title="Filter"><MdFilterAlt id='icon'/></button>
            <button onClick={onClearFilterClick}id='icon-button' title="Clear Filter"><MdFilterAltOff id='icon'/></button>

            </div>
        </div>
    );
};

export default EmailToolbar;
