import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation , Link,useNavigate} from "react-router-dom";
import axios from "axios";

////////////////*ICONS*///////////
import { MdOutlineDone } from "react-icons/md";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { CgMoreVerticalAlt } from 'react-icons/cg';
//////////////////////////////////

const EndPoints = {
    Base: "http://localhost:8080/api",
    getFolders: "http://localhost:8080/api/folders",
    deleteFolder: "http://localhost:8080/api/folders" + '/delete',
    addFolder: "http://localhost:8080/api/folders" + '/add',
    editFolder: "http://localhost:8080/api/folders" + '/edit',
};


const Folders = ({ folders, setFolders }) => {

    // When we login, we get the userName that was passed
    const location = useLocation()
    const navigate = useNavigate();
    const userName = location.state.userName

    const [editingFolderName, setEditingFolderName] = useState("");
    const [addFolderOpen, setAddFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    
    useEffect(() => {
        fetchFolders();
    }, [userName]);


    //Fetch / Refresh
    const fetchFolders = async () => {
        console.log("Fetching folders..");
        try {
            console.log("params: { userName: " + userName + "}");
            const response = await axios.get(EndPoints.getFolders, { params: { userName: userName } });
            console.log(response.data)
            setFolders(response.data);
        } catch (error) {
            console.error("Error fetching folders:", error.response.data);
        }
    };


    //Delete
    const deleteFolder = async (folderName) => {
        // Is it passing a folderName or folderId ??
        if (window.confirm("Delete this folder?")) {
            console.log("Deleting.. ", folderName);
            try {
                const response = await axios.post(EndPoints.deleteFolder, null, {
                    params: {
                        userName: userName,
                        folderName: folderName,
                    },
                });
                if (response.status === 200) {
                    fetchFolders(); //refresh
                }
            } catch (error) {
                console.error("Error deleting folder:", error);
            }
        }
    };


    //Rename
    const saveEdit = async (folderName) => {
        if (editingFolderName.trim() === "") {
            alert("Folder name cannot be empty.");
            return;
        }
        console.log("Editing.. ");
        try {
            const response = await axios.post(EndPoints.editFolder, {
                userName: userName,
                folderName: folderName,
                newFolderName: editingFolderName,
            });
            if (response.status === 200) {
                fetchFolders(); //refresh
                setEditingFolderId(null);
            }
        } catch (error) {
            console.error("Error editing folder:", error);
        }
        cancelEdit();
    };


    const cancelEdit = () => {
        setEditingFolderName("");
    };

    const startEdit = (folder) => {
        setEditingFolderName(folder);
    };

    const toggleAddFolder = () => {
        setAddFolderOpen(!addFolderOpen);
    };

    //Add Folder
    const addFolder = async () => {
        if (newFolderName.trim() === "") {
            alert("Folder name cannot be empty.");
            return;
        }
        console.log("Adding.. ", newFolderName);
        try {
            const response = await axios.post(EndPoints.addFolder, null, {
                params: {
                    userName: userName,
                    folderName: newFolderName,
                },
            });
            if (response.status === 200) {
                fetchFolders(); //refresh
                setNewFolderName('');
            }
        } catch (error) {
            console.error("Error adding folder:", error);
        }
    };

    return (
        <div className="folders-view">
            {/*Custom folders list*/}
            {/*Add / Edit*/}
            <div className="custom-folders">
                {folders.map((folder) => (
                    <div key={folder} className="folder-item">
                        {editingFolderName === folder ? (
                            <div id="folders-edit">
                                <input id='folder-name-input' type="text" value={editingFolderName} onChange={(e) => setEditingFolderName(e.target.value)} autoFocus placeholder="Edit folder name" />
                                <div id="folder-option">
                                    <button onClick={saveEdit(folder)} title="Save" id="icon-button"><MdOutlineDone /></button>
                                    <button onClick={cancelEdit} title="Cancel" id="icon-button"><FaXmark /></button>
                                </div>
                            </div>
                        ) : (
                            <>
                            <div id="folders-card">
                                <button onClick={() => navigate("/home", { replace: true, state: { userName, folder }, }) } id="folder-name" title={`Open ${folder}`} > {folder} </button>
                                <div id='folder-option'>
                                    <button onClick={() => startEdit(folder)} title="Edit" id="icon-button" > <CgMoreVerticalAlt /> </button>
                                    <button onClick={() => deleteFolder(folder)} title="Delete" id="icon-button" > <FiTrash /> </button>
                                </div>
                            </div>
                            <div id='list-seperator'></div>
                            </>
                        )}
                    </div>
                ))}
            </div>



            {/*Add new folder button*/}
            <div className="add-folder-section" id='folder-option'>
                <button id="icon-button" onClick={toggleAddFolder} title="Add Folder">
                    <FaPlus />
                </button>

                {/*Add Folder Modal*/}
                {addFolderOpen && (
                    <div className="add-folder-modal">
                        <input id='folder-name-input' type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New Folder Name" maxLength={10} autoFocus />
                        <div className="modal-buttons">
                            <button onClick={addFolder} title="Save" id='icon-button'> <MdOutlineDone /> </button>
                            <button onClick={toggleAddFolder} title="Cancel" id='icon-button'> <FaXmark /> </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Folders;
