import React, { useState } from "react";

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

    //Contacts displayed
    const [contactForm, setContactForm] = useState({
        name: "",
        emails: [{ email: "", default: true }],
    });

    //Handle contact input changes
    const handleFormChange = (key, value) => {
        setContactForm({ ...contactForm, [key]: value });
    };

    //Handle email update
    const handleEmailUpdate = (index, key, value) => {
        const updatedEmails = [...contactForm.emails];
        updatedEmails[index][key] = value;

        //Ensure only one email is default
        if (key === "default" && value === true) {
            updatedEmails.forEach((email, i) => {
                if (i !== index) email.default = false;
            });
        }

        //Clear email error if email becomes valid
        if (key === "email" && emailValidator(value)) {
            setEmailError("");
        }

        setContactForm({ ...contactForm, emails: updatedEmails });
    };

    const addEmailField = () => {
        setContactForm({
            ...contactForm,
            emails: [...contactForm.emails, { email: "", default: false }],
        });
    };

    const removeEmailField = (index) => {
        const updatedEmails = contactForm.emails.filter((_, i) => i !== index);
        if (contactForm.emails[index].default && updatedEmails.length > 0) {
            updatedEmails[0].default = true;
        }
        setContactForm({ ...contactForm, emails: updatedEmails });
    };

    //Add or Edit Contact
    const handleSaveContact = () => {
        //Check if all emails are valid before saving
        const invalidEmail = contactForm.emails.find((emailObj) => !emailValidator(emailObj.email));
        if (invalidEmail) {
            setEmailError("Please enter valid email addresses.");
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
        setContacts(contacts.filter((contact) => contact.id !== id));
    };

    const resetForm = () => {
        setContactForm({ name: "", emails: [{ email: "", default: true }] });
        setFormVisible(false);
        setEditingContact(null);
        setEmailError("");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Contacts</h2>

            {/*Add Contact button*/}
            {!formVisible && (
                <button onClick={() => setFormVisible(true)}>Add Contact</button>
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
                                <input
                                    type="radio"
                                    checked={emailObj.default}
                                    onChange={() => handleEmailUpdate(index, "default", true)}  /*Set Default Email*/
                                />
                                <label>Default</label>
                                {contactForm.emails.length > 1 && (
                                    <button type="button" onClick={() => removeEmailField(index)}>  {/*Delete Email*/}
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addEmailField}>
                            Add Email
                        </button>
                    </div>

                    

                    <button onClick={handleSaveContact}>
                        {editingContact ? "Save Changes" : "Add Contact"}
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
                                <strong>{contact.name}</strong>
                                <ul>
                                    {contact.emails.map((emailObj, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                color: emailObj.default ? "red" : "black",
                                            }}
                                        >
                                            {emailObj.email} {emailObj.default && "(Default)"}
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
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Contacts;
