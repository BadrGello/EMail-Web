// EmailPage.js
import React, { useEffect, useState } from 'react';
import DefualtFolder from './DefualtFolder.jsx';
import ComposeModal from './Compose.jsx';
import Contacts from './Contacts.jsx';
import Drafts from './Drafts.jsx';
import Folders from './Folders.jsx';
import { BrowserRouter as Router, Route, Routes, useLocation , Link,useNavigate} from "react-router-dom";
import axios from 'axios';

////////////////*ICONS*///////////
import { TiContacts } from "react-icons/ti";
import { FaRegFolder, FaPlus, FaInbox, FaPen } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { GoFile } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { MdOutlineDone } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
//////////////////////////////////


const EndPoints = {
    Base: "http://localhost:8080/api",
    getFolders: "http://localhost:8080/api/folders",
    addFolder: "http://localhost:8080/api/folders/add",
};

function EmailPage() {

    // When we login, we get the userName that was passed
    const location = useLocation()
    const navigate = useNavigate();
    const userName = location.state.userName

    const [modalOpen, setModalOpen] = useState(false);


    const [folders, setFolders] = useState(["games","school"]); //List of custom folders
    const [newFolderName, setNewFolderName] = useState("");
    const [addFolderOpen, setAddFolderOpen] = useState(false);

    const toggleAddFolder = () => {
        setAddFolderOpen(!addFolderOpen);
    };

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

    const fetchFolders = async () => {
        console.log("Fetching folders..");
        try {
            const response = await axios.get(EndPoints.getFolders, { params: { userName: userName } });
            console.log(response)
            setFolders(response.data.folders);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };



    const handleComposeClick = () => {
        setModalOpen(true); // Open the modal when the Compose button is clicked
        console.log("Opening Modal")
    };

    const handleEditOrSend = () => {
        console.log("")
        // Leave this function empty
    }

    return (
        <div className="page">
            <div className="sidebar">
                <div id='welcome'>
                    Welcome {userName}
                </div>
                <button onClick={handleComposeClick} id='side-button'><div id='icon-container'><FaPen /></div> Compose</button>
                <button  onClick={()=> {navigate("/home", {replace: true, state:{userName, folder:"inbox"}})}} id='side-button'><div id='icon-container'><FaInbox /></div> Inbox</button>
                <button  onClick={()=> {navigate("/home", {replace: true, state:{userName, folder:"sent"}})}} id='side-button'><div id='icon-container'><IoIosSend /></div> Sent</button>
                <button  onClick={()=> {navigate("/home/drafts", {replace: true, state:{userName, folder:"drafts"}})}} id='side-button'><div id='icon-container'><GoFile /></div> Drafts</button>
                <button  onClick={()=> {navigate("/home", {replace: true, state:{userName, folder:"trash"}})}} id='side-button'><div id='icon-container'><FiTrash /></div> Trash</button>



                <div id='folders-section'>
                    <button onClick={() => { navigate("/home/folders", { replace: true, state: { userName } }) }} id='side-button'><div id='icon-container'><FaRegFolder /></div> Folders</button>
                        

                    {/*Custom folders list*/}
                    <div className="custom-folders">
                        <div id='line'></div>
                        {folders.map((folder) => (
                            <button key={folder} onClick={() => { navigate("/home", { replace: true, state: { userName, folder } }) }} id='folder-button'>{folder}</button> 
                        ))}
                        
                        {/*Add new folder button*/}
                        <button className='add-folder-side' id="icon-button" onClick={toggleAddFolder} title="Add Folder"><FaPlus /> </button>
                    </div>

                    <div id='line'></div>

                    {/*Add Folder Modal*/}
                    {addFolderOpen && (
                        <div className="add-folder-modal">
                            <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New Folder Name" maxLength={10} id='folder-name-input'/>
                            <div id='folder-options'>
                                <button onClick={toggleAddFolder} title='Cancel' id='icon-button'><FaXmark /></button>
                                <button onClick={addFolder} title='Save' id='icon-button'><MdOutlineDone /></button>
                            </div>
                        </div>
                    )}
                </div>



                <button  onClick={()=> {navigate("/home/contacts", {replace: true, state:{userName}})}} id='side-button'><div id='icon-container'><TiContacts /></div> Contacts</button>

                {/* Handle Log Out */}
                <button  onClick={()=> {navigate("/", {replace: true, state:{userName}})}} id='side-button'><div id='icon-container'><CiLogout /></div> Log Out</button>
            </div>

            <div className='fullcontent'>
                <div className="homepage" id='content'>
                    <Routes>
                        <Route path="/" element={<DefualtFolder/>} />
                        <Route path="contacts" element={<Contacts />} />
                        <Route path="drafts" element={<Drafts />} />
                        <Route path="folders" element={<Folders folders={folders} setFolders={setFolders} />} />
                    </Routes>
                </div>

                {modalOpen && <ComposeModal userName={userName} closeModal={() => setModalOpen(false)} onEditOrSend={handleEditOrSend}/>}
        </div>
        </div>
    );
}

export default EmailPage;
