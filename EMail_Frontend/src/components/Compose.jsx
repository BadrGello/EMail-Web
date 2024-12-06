import React, { useState } from 'react';
import { sendEmail } from './api';

const Compose = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        body: '',
        attachments: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        sendEmail(formData)
        .then(() => alert("Email sent successfully"))
        .catch(error => console.error("Error sending email:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>To:</label>
                <input
                type="email"
                className="form-control"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                />
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
            <button type="submit" className="btn btn-primary">Send</button>
        </form>
    );
};

export default Compose;
