import React, { useState, useEffect } from "react";

////////////////*ICONS*///////////
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { MdDeleteOutline,MdFilterAlt, MdFilterAltOff,MdSort, MdRefresh, MdOutlineDone } from "react-icons/md";
import { IoPersonCircleOutline, IoPersonAdd } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
//////////////////////////////////

//Email validation regex
const emailValidator = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};


const EndPoints = {
    Base: "http://localhost:8080/api",
    getContacts: "http://localhost:8080/api/contacts",
    deleteContact: "http://localhost:8080/api/contacts/delete",
    addContact: "http://localhost:8080/api/contacts/add",
};


const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [emailError, setEmailError] = useState("");

    const [sortType, setSortType] = useState("Name"); //Default sorting by name
    const [sortOrder, setSortOrder] = useState("Ascendingly");
    const [filterBy, setFilterBy] = useState("All");
    const [filterText, setFilterText] = useState('');

    //Contacts displayed
    const [contactForm, setContactForm] = useState({
        name: "",
        emails: [{ email: ""}],
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    //Fetch / Refresh / Sort / Filter
    const fetchContacts = async () => {
        console.log("Fetching Contacts.. ");
        try {
            const response = await axios.get(EndPoints.getContacts, {
                params: {
                    user: userName,

                    sortType: sortType,
                    sortOrder: sortOrder,
                    filterType: filterBy,
                    filterText: filterText, 
                }
            });
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    //Handle contact input form changes
    const handleFormChange = (key, value) => {
        setContactForm({ ...contactForm, [key]: value });
    };

    //Handle email update
    const handleEmailUpdate = (index, key, value) => {
        const updatedEmails = [...contactForm.emails];
        updatedEmails[index][key] = value;

        //Clear email error if email becomes valid
        if (key === "email" && emailValidator(value)) {
            setEmailError("");
        }

        setContactForm({ ...contactForm, emails: updatedEmails });
    };

    const addEmailField = () => {
        setContactForm({
            ...contactForm,
            emails: [...contactForm.emails, { email: ""}],
        });
    };

    const removeEmailField = (index) => {
        if (contactForm.emails.length === 1) {
            alert("A contact must have at least one email.");
            return;
        }
        const updatedEmails = contactForm.emails.filter((_, i) => i !== index);
        
        setContactForm({ ...contactForm, emails: updatedEmails });
    };

    //Add or Edit Contact
    const handleSaveContact = async () => {
        setEmailError("");
        if (!contactForm.name.trim()) {
            setEmailError("Enter a name please.");
            return;
        }
        //Check if all emails are valid before saving
        const invalidEmail = contactForm.emails.find((emailObj) => !emailValidator(emailObj.email));
        if (invalidEmail) {
            setEmailError("Invalid Email address/es.");
            return;
        }

        console.log("Saving Contact.. ");
        try {
            if (editingContact !== null) {
                //Editing existing contact
                const response = await axios.post(EndPoints.editContact, { ...contactForm, id: editingContact.id });
                setContacts(contacts.map(contact => contact.id === editingContact.id ? response.data : contact));
            } else {
                //Adding new contact
                const response = await axios.post(EndPoints.addContact, contactForm);
                setContacts([...contacts, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving contact:", error);
        }
    };

    //Delete Contact
    const handleDeleteContact = async (id) => {
        if (window.confirm("Delete contact?")) {
            try {
                await axios.delete(`${EndPoints.deleteContact}/${id}`);
                setContacts(contacts.filter(contact => contact.id !== id));
            } catch (error) {
                console.error("Error deleting contact:", error);
            }
        }
    };
    

    const resetForm = () => {
        setContactForm({ name: "", emails: [{ email: ""}] });
        setFormVisible(false);
        setEditingContact(null);
        setEmailError("");
    };

    const handleRefresh = () => {
        console.log("Refreshing.. ");
        fetchContacts();
    }  

    const handleSort = async () => {
        console.log("Sorting.. " + sortType, sortOrder )
        fetchContacts();
    };
    
    const handleFilter = async () => {
        console.log("filtering.. " + filterText, filterBy );
        fetchContacts();
    };

    const clearFilter = () => {
        console.log("Clear filter..");
        setFilterBy("All");
        setFilterText("");
        fetchContacts();
    };
    

    return (
        <>
        {/*Start ToolBar*/}
        <div className="contacts toolbar">

            <button onClick={handleRefresh} id='icon-button' title="Refresh"><MdRefresh id='icon'/></button>
            
            <div id='sort'>
                <p>Sort By: </p>

                <select value={sortType} onChange={handleSort}>
                    <option value="Name">Name</option>
                    <option value="Number of emails">Number of emails</option>
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="Ascendingly">Ascendingly</option>
                    <option value="Descendingly">Descendingly</option>
                </select>

                <button onClick={handleSort} id='icon-button' title="Sort"><MdSort id='icon'/></button>
            </div>

            <div id='filter'>
                <p>Filter By: </p>

                <select value={filterBy} onChange={handleFilter}>
                <option value="All">All</option>
                    <option value="Name">Name</option>
                    <option value="Email">Email</option>
                </select>

                <input 
                    type="text" 
                    value={filterText} 
                    onChange={(e) => setFilterText(e.target.value)} 
                    placeholder="Filter text"
                />
                <div>
                    <button onClick={handleFilter} id='icon-button' title="Filter"><MdFilterAlt id='icon'/></button>
                    <button onClick={clearFilter} id='icon-button' title="Clear Filter"><MdFilterAltOff id='icon'/></button>
                </div>
            </div>


        </div>
        {/*End ToolBar*/}


        <div>

            {/*Add Contact button*/}
            {!formVisible && (
                <button onClick={() => setFormVisible(true)} className='content-icon' id='icon-button'><IoMdAdd id='icon'/></button>
            )}

            {/*Add/Edit contact*/}
            {formVisible && (
                <div className="formContact">
                    <div className='title'>{editingContact ? "Edit Contact" : "Add Contact"}</div>
                    <div>
                        <label>Name:</label>
                        <input type="text" placeholder="Enter name" value={contactForm.name} onChange={(e) => handleFormChange("name", e.target.value)}  /* Input Name */ />
                    </div>

                    <div>
                        <label>Emails:</label>
                        <div>
                        {contactForm.emails.map((emailObj, index) => (
                            <div id='emails-list-edit'>
                                <input type="email" placeholder="Enter email" value={emailObj.email} onChange={(e) => handleEmailUpdate(index, "email", e.target.value)  /*Input Email*/ } />
                                {contactForm.emails.length > 1 && (
                                    <button type="button" className='content-icon' id='icon-remove' onClick={() => removeEmailField(index)}>  {/*Delete Email*/} <FaMinus id='icon'/> </button>
                                )}
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={addEmailField} className='content-icon' id='icon-add' title='Add Email'> <IoMdAdd id='icon'/> </button>
                    </div>

                    
                    <div id='edit-options'>
                    <button onClick={resetForm} className='content-icon' id='icon-cancel' title="Cancel"><FaXmark /></button>
                    <button onClick={handleSaveContact} className='content-icon' id='icon-done'> {editingContact ?  <MdOutlineDone id='icon' /> :  <IoPersonAdd id='icon'/>} </button>
                    </div>
                    
                    {/*Show email error incase invalid input*/}
                    {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                </div>
            )}

            {/*Contacts List*/}
            {!formVisible && (
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.id} >
                            <div id='contact-card'>
                                <strong id='icon-button'><IoPersonCircleOutline id='icon'/> {contact.name}</strong>
                                <ul>
                                    {contact.emails.map((emailObj, index) => (
                                        <li key={index} > {emailObj.email} </li>
                                    ))}
                                </ul>
                                <button  id='icon-button' onClick={() => { setFormVisible(true); setEditingContact(contact); setContactForm(contact); }}> <CgMoreVerticalAlt/> </button>
                                <button onClick={() => handleDeleteContact(contact.id)} id='icon-button'><MdDeleteOutline/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </>
    );
};

export default Contacts;
