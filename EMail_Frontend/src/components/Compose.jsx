import React, { useState, useRef } from 'react';
import { useLocation} from 'react-router-dom';

const Compose = () => {
    const location = useLocation();
    const userName = location.state.userName;

    const [formData, setFormData] = useState({
        id: null,
        sender: userName,
        to: [''],
        subject: '',
        body: '',
        attachments: [],
        priority: 'Normal',
        date: '',
    });

    // Handle the change for dynamic fields (To: email addresses)
    const handleToChange = (index, value) => {
        const updatedTo = [...formData.to];
        updatedTo[index] = value;
        setFormData({ ...formData, to: updatedTo });
    };

    // Add another "To:" field
    const addAnotherTo = () => {
        setFormData({ ...formData, to: [...formData.to, ''] });
    };

    const removeToField = (index) => {
        const updatedTo = formData.to.filter((_, i) => i !== index);
        setFormData({ ...formData, to: updatedTo });
    };

    // Put the current date and time into formData
    const setDate = async () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            date: new Date().toISOString(), 
        }));
    }

    const handleMoveToDraft = () => {
        // To update date correctly (useState has issues with sync)
        let newformData = {...formData}
        newformData.date = new Date().toISOString();
        console.log('Saving to Drafts:', newformData);
        alert('Email saved to drafts!');

        // To Handle
        //Should go to inbox when done or clear all fields

    };

    // Handle the submit
    const handleSubmit = (e) => {
        e.preventDefault();
        sendEmail(formData)
            .then(() => alert("Email sent successfully"))
            .catch(error => console.error("Error sending email:", error));

        // To Handle
        //Should go to inbox when done or clear all fields
    };

    const sendEmail = (emailData) => {
        console.log(emailData);
        alert('Email sent successfully!');
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>To:</label>
                {formData.to.map((email, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => handleToChange(index, e.target.value)}
                            placeholder={`Recipient ${index + 1}`}
                        />
                        {formData.to.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-danger ml-2"
                                onClick={() => removeToField(index)}
                            >
                                Delete
                            </button>
                        )}
                        {index === formData.to.length - 1 && (
                            <button
                                type="button"
                                className="btn btn-secondary ml-2"
                                onClick={addAnotherTo}
                            >
                                Add Another Recipient
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-group">
                <label>Subject:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label>Body:</label>
                <textarea
                    className="form-control"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label>Attachments:</label>
                <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
                />
            </div>

            <div className="form-group">
                <label>Priority:</label>
                <select
                    className="form-control"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                </select>
            </div>

            <div>
                <button type="submit" className="btn btn-primary" onClick={() => {setDate(); }}>
                    Send
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {setDate(); handleMoveToDraft(); }}>
                    Move to Draft
                </button>
            </div>
        </form>
    );
};

export default Compose;
