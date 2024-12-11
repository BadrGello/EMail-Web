import React, { useState } from 'react';


////////////////*ICONS*///////////
import { MdFilterAlt,MdSort, MdRefresh, MdFilterNone, MdFilterAltOff } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import { MdDriveFileMove } from "react-icons/md";
//////////////////////////////////



const EmailToolbar = ({ onRefreshClick, onMoveClick, onDeleteClick, onSortChange, onOrderChange, onFilterChange, onFilterTextChange, onSortClick, onFilterClick, onClearFilterClick, sortType, sortOrder, filterBy, filterText }) => {
    return (
        <div className="email toolbar">

            <button onClick={onRefreshClick} id='icon-button' title="Refresh"><MdRefresh id='icon'/></button>
            <button onClick={onMoveClick} id='icon-button' title="Move"><MdDriveFileMove /></button>
            <button onClick={onDeleteClick} id='icon-button' title="Delete"><IoTrashBin /></button>
            
            <div id='sort'>
                <p>Sort By: </p>

                {/* Sorting Options */}
                <select value={sortType} onChange={onSortChange}>
                    <option value="Date">Date</option>
                    <option value="Priority">Priority</option>
                    <option value="Sender">Sender</option>
                    <option value="Subject">Subject</option>
                    <option value="Attachment Size">Attachment Size</option>
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
