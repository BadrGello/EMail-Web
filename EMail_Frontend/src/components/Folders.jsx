import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation , Link,useNavigate} from "react-router-dom";

////////////////*ICONS*///////////
import { MdOutlineDone } from "react-icons/md";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { CgMoreVerticalAlt } from 'react-icons/cg';
//////////////////////////////////


const Folders = ({ folders, setFolders }) => {

    // When we login, we get the userName that was passed
    const location = useLocation()
    const navigate = useNavigate();
    const userName = location.state.userName

    
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [editingFolderName, setEditingFolderName] = useState("");
    const [addFolderOpen, setAddFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    
    

    const deleteFolder = (id) => {
        if (window.confirm("Delete this folder?")) {
            setFolders(folders.filter((folder) => folder.id !== id));
        }
    };


    const saveEdit = () => {
        if (editingFolderName.trim() === "") {
            alert("Folder name cannot be empty.");
            return;
        }
        setFolders(
            folders.map((folder) =>
                folder.id === editingFolderId ? { ...folder, name: editingFolderName } : folder
            )
        );
        cancelEdit();
    };


    const cancelEdit = () => {
        setEditingFolderId(null);
        setEditingFolderName("");
    };

    const startEdit = (folder) => {
        setEditingFolderId(folder.id);
        setEditingFolderName(folder.name);
    };

    const toggleAddFolder = () => {
        setAddFolderOpen(!addFolderOpen);
    };

    const addFolder = () => {
        if (newFolderName.trim() === "") {
            alert("Folder name cannot be empty.");
            return;
        }
        setFolders([...folders, { id: Date.now(), name: newFolderName }]);
        setNewFolderName("");
        toggleAddFolder();
    };

    return (
        <div className="folders-view">
            {/*Custom folders list*/}
            {/*Add / Edit*/}
            <div className="custom-folders">
                {folders.map((folder) => (
                    <div key={folder.id} className="folder-item">
                        {editingFolderId === folder.id ? (
                            <div id="folders-list">
                                <input type="text" value={editingFolderName} onChange={(e) => setEditingFolderName(e.target.value)} autoFocus placeholder="Edit folder name" />
                                <div id="folder-option">
                                    <button onClick={saveEdit} title="Save" id="icon-button"><MdOutlineDone /></button>
                                    <button onClick={cancelEdit} title="Cancel" id="icon-button"><FaXmark /></button>
                                </div>
                            </div>
                        ) : (
                            <div id="folders-list">
                                <button onClick={() => navigate("/home", { replace: true, state: { userName, folder: folder.name }, }) } id="folder-button" title={`Open ${folder.name}`} > {folder.name} </button>
                                <div id='folder-option'>
                                    <button onClick={() => startEdit(folder)} title="Edit" id="icon-button" > <CgMoreVerticalAlt /> </button>
                                    <button onClick={() => deleteFolder(folder.id)} title="Delete" id="icon-button" > <FiTrash /> </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>



            {/*Add new folder button*/}
            <div className="add-folder-section">
                <button id="icon-button" onClick={toggleAddFolder} title="Add Folder">
                    <FaPlus />
                </button>

                {/*Add Folder Modal*/}
                {addFolderOpen && (
                    <div className="add-folder-modal">
                        <input id='foldar-name-input' type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New Folder Name" maxLength={10} autoFocus />
                        <div className="modal-buttons">
                            <button onClick={toggleAddFolder} title="Cancel" id='icon-button'> <FaXmark /> </button>
                            <button onClick={addFolder} title="Save" id='icon-button'> <MdOutlineDone /> </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Folders;
