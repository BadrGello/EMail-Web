// EmailPage.js
import React, { useEffect, useState } from 'react';
import DefualtFolder from './DefualtFolder.jsx';
import ComposeModal from './Compose.jsx';
import Contacts from './Contacts.jsx';
import Drafts from './Drafts.jsx';
import Folders from './Folders.jsx';
import { BrowserRouter as Router, Route, Routes, useLocation , Link,useNavigate} from "react-router-dom";

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

function EmailPage() {

    // When we login, we get the userName that was passed
    const location = useLocation()
    const navigate = useNavigate();
    const userName = location.state.userName

    const [modalOpen, setModalOpen] = useState(false);


    const [folders, setFolders] = useState([]); //List of custom folders
    const [newFolderName, setNewFolderName] = useState("");
    const [addFolderOpen, setAddFolderOpen] = useState(false);

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



    const handleComposeClick = () => {
        setModalOpen(true); // Open the modal when the Compose button is clicked
        console.log("Opening Modal")
    };

    // Test Case for initail Form Data when working with drafts
    const initialFormData = {
        id: null,
        sender: 'BADR BADR',
        to: ['ahmed', 'mo', 'bubble'],
        subject: 'Yeah',
        body: '',
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
        priority: 'Low',
        date: '',
      };

    return (
        <div className='fullpage'>
            <div className="sidebar">
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
                            <button key={folder.id} onClick={() => { navigate("/home", { replace: true, state: { userName, folder: folder.name } }) }} id='folder-button'>{folder.name}</button> 
                        ))}
                        
                        {/*Add new folder button*/}
                        <button id="icon-button" onClick={toggleAddFolder} title="Add Folder"><FaPlus /> </button>
                    </div>

                    <div id='line'></div>

                    {/*Add Folder Modal*/}
                    {addFolderOpen && (
                        <div className="add-folder-modal">
                            <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New Folder Name" maxLength={10} id='foldar-name-input'/>
                            <div id='folder-options'>
                                <button onClick={toggleAddFolder} title='Cancel' id='icon-button'><FaXmark /></button>
                                <button onClick={addFolder} title='Save' id='icon-button'><MdOutlineDone /></button>
                            </div>
                        </div>
                    )}
                </div>



                <button  onClick={()=> {navigate("/home/contacts", {replace: true, state:{userName}})}} id='side-button'><div id='icon-container'><TiContacts /></div> Contacts</button>

                {/* Handle Log Out */}
                <button  onClick={()=> {navigate("/login", {replace: true, state:{userName}})}} id='side-button'><div id='icon-container'><CiLogout /></div> Log Out</button>
            </div>
                <div className="homepage" id='content'>
                    <Routes>
                        <Route path="/" element={<DefualtFolder/>} />
                        <Route path="contacts" element={<Contacts />} />
                        <Route path="drafts" element={<Drafts />} />
                        <Route path="folders" element={<Folders folders={folders} setFolders={setFolders} />} />
                    </Routes>
                </div>

                {modalOpen && <ComposeModal userName={userName} closeModal={() => setModalOpen(false)} initialFormData={initialFormData} />}
        </div>
    );
}

export default EmailPage;
