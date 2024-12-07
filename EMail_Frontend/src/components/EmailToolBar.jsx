import React, { useState } from 'react';

const EmailToolbar = ({ onRefreshClick, onMoveClick, onDeleteClick, onSortChange, onOrderChange, onFilterChange, onFilterTextChange, onSortClick, onFilterClick, sortType, sortOrder, filterBy, filterText }) => {
    return (
        <div className="email toolbar">

            <button onClick={onRefreshClick}>Refresh</button>
            <button onClick={onMoveClick}>Move to Folder</button>
            <button onClick={onDeleteClick}>Delete</button>
            
            <p>Sort By: </p>

            {/* Sorting Options */}
            <select value={sortType} onChange={onSortChange}>
                <option value="Date">Date</option>
                <option value="Priority">Date</option>
                <option value="Sender">Sender</option>
                <option value="Subject">Subject</option>
                <option value="Attachment Size">Date</option>
            </select>

            <select value={sortOrder} onChange={onOrderChange}>
                <option value="Ascendingly">Ascendingly</option>
                <option value="Descendingly">Descendingly</option>
            </select>

            <button onClick={onSortClick}>Sort</button>

            <p>Filter By: </p>

            {/* Filtering Options */}
            <select value={filterBy} onChange={onFilterChange}>
                <option value="Subject">Subject</option>
                <option value="Sender">Sender</option>
            </select>

            <input 
                type="text" 
                value={filterText} 
                onChange={onFilterTextChange} 
                placeholder="Filter text"
            />
            <button onClick={onFilterClick}>Filter</button>

            
        </div>
    );
};

export default EmailToolbar;
