import React, { useState } from "react";

////////////////*ICONS*///////////
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { MdDeleteOutline,MdFilterAlt, MdFilterAltOff,MdSort, MdRefresh, MdOutlineDone } from "react-icons/md";
import { IoPersonCircleOutline, IoPersonAdd } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
//////////////////////////////////

//Email validation regex
const emailValidator = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [emailError, setEmailError] = useState("");

    const [sortType, setSortType] = useState("Name"); // Default sorting by name
    const [sortOrder, setSortOrder] = useState("Ascendingly");
    const [filterBy, setFilterBy] = useState("Name");

    const [filterText, setFilterText] = useState('');

    //Contacts displayed
    const [contactForm, setContactForm] = useState({
        name: "",
        emails: [{ email: ""}],
    });

    //Handle contact input changes
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
    const handleSaveContact = () => {
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

        if (editingContact !== null) {
            const updatedContacts = contacts.map((contact) =>
                contact.id === editingContact.id ? { ...editingContact, ...contactForm } : contact
            );
            setContacts(updatedContacts);
        } else {
            setContacts([
                ...contacts,
                { id: Date.now(), ...contactForm }, //New Contact
            ]);
        }
        resetForm();
    };

    // Delete Contact
    const handleDeleteContact = (id) => {
        if (window.confirm("Delete contact?")) {
            setContacts(contacts.filter((contact) => contact.id !== id));
        }
    };
    

    const resetForm = () => {
        setContactForm({ name: "", emails: [{ email: ""}] });
        setFormVisible(false);
        setEditingContact(null);
        setEmailError("");
    };

    const handleRefresh = () => {
        console.log("refresh")
    }  

    const handleSort = () => {
        console.log(sortType, sortOrder, filterText, filterBy)
    };
    
    const handleFilter = () => {
        console.log("filter");
    };

    const clearFilter = () => {
        console.log("clear filter");
    };
    

    return (
        <>
        {/*Start ToolBar*/}
        <div className="contacts toolbar" style={{display:"flex",}}>

            <button onClick={handleRefresh}><MdRefresh id='icon'/></button>
            <p>Sort By: </p>

            <select value={sortType} onChange={handleSort}>
                <option value="Name">Name</option>
                <option value="Number of emails">Number of emails</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="Ascendingly">Ascendingly</option>
                <option value="Descendingly">Descendingly</option>
            </select>

            <button onClick={handleSort}><MdSort id='icon'/></button>

            <p>Filter By: </p>

            <select value={filterBy} onChange={handleFilter}>
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
                <button onClick={handleFilter}><MdFilterAlt id='icon'/></button>
                <button onClick={clearFilter}><MdFilterAltOff id='icon'/></button>
            </div>


        </div>
        {/*End ToolBar*/}


        <div style={{ padding: "20px" }}>
            <h2>Contacts</h2>

            {/*Add Contact button*/}
            {!formVisible && (
                <button onClick={() => setFormVisible(true)}><IoMdAdd id='icon'/></button>
            )}

            {/*Add/Edit contact*/}
            {formVisible && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
                    <h3>{editingContact ? "Edit Contact" : "Add Contact"}</h3>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => handleFormChange("name", e.target.value)}  /* Input Name */
                        />
                    </div>

                    <div>
                        <h4>Emails:</h4>
                        {contactForm.emails.map((emailObj, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={emailObj.email}
                                    onChange={(e) =>
                                        handleEmailUpdate(index, "email", e.target.value)  /*Input Email*/
                                    }
                                />
                                {contactForm.emails.length > 1 && (
                                    <button type="button" onClick={() => removeEmailField(index)}>  {/*Delete Email*/}
                                        <FaMinus id='icon'/>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addEmailField}>
                        <IoMdAdd id='icon'/>
                        </button>
                    </div>

                    

                    <button onClick={handleSaveContact}>
                        {editingContact ? <MdOutlineDone id='icon'/> : <IoPersonAdd id='icon'/>}
                    </button>
                    <button onClick={resetForm}>Cancel</button>

                    {/*Show email error incase invalid input*/}
                    {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                </div>
            )}

            {/*Contacts List*/}
            {!formVisible && (
                <ul style={{ listStyleType: "none", padding: "0", marginTop: "20px" }}>
                    {contacts.map((contact) => (
                        <li
                            key={contact.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px",
                                border: "1px solid #ccc",
                                marginBottom: "10px",
                            }}
                        >
                            <div>
                                <strong><IoPersonCircleOutline id='icon'/> {contact.name}</strong>
                                <ul>
                                    {contact.emails.map((emailObj, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                color: emailObj.default ? "red" : "black",
                                            }}
                                        >
                                            {emailObj.email}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <button onClick={() => {
                                    setFormVisible(true);
                                    setEditingContact(contact);
                                    setContactForm(contact);
                                }}>
                                    <CgMoreVerticalAlt id='icon'/>
                                </button>
                                <button onClick={() => handleDeleteContact(contact.id)}><MdDeleteOutline id='icon'/></button>
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
