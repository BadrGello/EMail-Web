import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

const EndPoints = {
    Base: "http://localhost:8080/api",
    sendEmail: "http://localhost:8080/api" + '/sendEmail',
    sendDraft: "http://localhost:8080/api" + '/sendDraft',
}


const ComposeModal = ({ userName, closeModal, initialFormData, onEditOrSend }) => {
    const [formData, setFormData] = useState({
        id: null,
        sender: userName,
        recipients: [''], //recipients
        subject: '',
        body: '',
        attachment: [],
        priority: 'Normal',
        folder: 'inbox',
        date: '',
    });
    
    const emailValidator = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };
    
    // (drafts folder)
    const [initialFormState, setInitialFormState] = useState({});

    // Set initial formData if it's provided (i.e., an existing draft) (drafts folder)
    useEffect(() => {
        if (initialFormData) {
            setFormData(initialFormData);
            setInitialFormState(initialFormData);
        }
    }, [initialFormData]);

    // const [open, setOpen] = useState(false); // State for controlling modal visibility

    const isFormEmpty = () => {
        return (
            formData.recipients.every(email => email.trim() === '') &&
            formData.subject.trim() === '' &&
            formData.body.trim() === '' &&
            formData.attachment.length === 0
        );
    };

    const isFormNotComplete = () => {
        return (
            formData.recipients.every(email => email.trim() === '') ||
            formData.subject.trim() === '' ||
            formData.body.trim() === ''
        );
    };

    const [errors, setErrors] = useState({}); // State to track validation errors

    // Handle the change for dynamic fields (To: email addresses)
    const handleToChange = (index, value) => {
        const updatedTo = [...formData.recipients];
        updatedTo[index] = value;

        // Validate the email address
        const updatedErrors = { ...errors };
        if (!emailValidator(value) && value.trim() !== '') {
            updatedErrors[`to-${index}`] = 'Invalid email address';
        } else {
            delete updatedErrors[`to-${index}`];
        }

        setErrors(updatedErrors);

        setFormData({ ...formData, recipients: updatedTo });
    };

    // Add another "To:" field
    const addAnotherTo = () => {
        setFormData({ ...formData, recipients: [...formData.recipients, ''] });
    };

    const removeToField = (index) => {
        const updatedTo = formData.recipients.filter((_, i) => i !== index);
        setFormData({ ...formData, recipients: updatedTo });
    };

    const handleMoveToDraft = async () => {

         // Check if form data is unchanged from the initial draft (drafts folder)
         if (JSON.stringify(formData) === JSON.stringify(initialFormState)) {
            console.log("No changes made. Closing without saving.");
            closeModal();
            return;
        }

        if (isFormEmpty()){
            console.log("Empty Form")
            closeModal()
            return;
        }

        // send to backend userName and newformData (move to draft (new email and move it to draft)) and await a response

        let newformData = {...formData}
        newformData.date = new Date().toISOString();
        newformData.id = newformData.date;

        onEditOrSend("Edit"); // Drafts Folder function

        const formDataToSend = new FormData();
        formDataToSend.append("userName", userName);
        formDataToSend.append("recipients", newformData.recipients.join(",")); // Join recipients into a comma-separated string
        formDataToSend.append("subject", newformData.subject);
        formDataToSend.append("priority", newformData.priority);
        formDataToSend.append("body", newformData.body);
        formDataToSend.append("date", newformData.date);
    
        // Add attachment to FormData
        Array.from(newformData.attachment).forEach((file) => {
            formDataToSend.append("files", file);
        });
    
        console.log("Sending FormData:", formDataToSend);

        try {
            // const response = await axios.post(EndPoints.sendDraft, requestData); // Send data to backend
            const response = await axios.post(EndPoints.sendDraft, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data", // Indicate multipart form data
                },
            });
    
            console.log('Draft saved:', response.data);
            alert('Email saved to drafts!');
            closeModal();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the draft');
        }

    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (Object.keys(errors).length > 0) {
            // Check if there's exactly one error
            if (Object.keys(errors).length === 1) {
                alert("Invalid email address");
            } else {
                alert("Invalid email addresses");
            }
            return; // Stop further execution if there are errors
        }
    
        if (isFormNotComplete()) {
            alert("Make sure you fill the following fields: To - Subject - Body ");
            return;
        }
    
        // Prepare the form data
        let newformData = { ...formData };
        newformData.date = new Date().toISOString();
        newformData.id = newformData.date;
    
        onEditOrSend("Send"); // Drafts Folder
    
        const formDataToSend = new FormData();
        formDataToSend.append("userName", userName);
        formDataToSend.append("recipients", newformData.recipients.join(",")); // Join recipients into a comma-separated string
        formDataToSend.append("subject", newformData.subject);
        formDataToSend.append("priority", newformData.priority);
        formDataToSend.append("body", newformData.body);
        formDataToSend.append("date", newformData.date);
    
        // Add attachment to FormData
        Array.from(newformData.attachment).forEach((file) => {
            formDataToSend.append("files", file);
        });
    
        console.log("Sending FormData:", formDataToSend);
    
        try {
            // Send FormData to the backend
            const response = await axios.post(EndPoints.sendEmail, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data", // Indicate multipart form data
                },
            });
    
            console.log("Email sent:", response.data);
            alert("Email sent successfully!");
            closeModal();
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert("An error occurred while sending the email");
        }
    };
    

    const resetForm = () => {
        setFormData({
            id: null,
            sender: userName,
            recipients: [''],
            subject: '',
            body: '',
            attachment: [],
            priority: 'Normal',
            date: '',
        });
        closeModal();
    };

    // const handleOpen = () => setOpen(true); // Open the modal
    // const handleClose = () => setOpen(false); // Close the modal

    return (
        <div>
            {/* Trigger modal when a sidebar item is clicked */}
            {/* <div onClick={handleOpen}>Compose Email</div> */}

            {/* Modal Component */}
            <Modal
                open={true}
                onClose={closeModal}
                aria-labelledby="compose-email-modal"
                aria-describedby="compose-email-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        maxHeight: '80vh', // Limit the height of the modal
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto', // Make the modal scrollable
                    }}
                >
                    {/* Close Icon */}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMoveToDraft}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography id="compose-email-modal" variant="h6" component="h2">
                        Compose Email
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>To:</label>
                            {formData.recipients.map((email, index) => (
                                <div key={index}>
                                    <TextField
                                        label={`Recipient ${index + 1}`}
                                        variant="outlined"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => handleToChange(index, e.target.value)}
                                        margin="normal"
                                        error={!!errors[`to-${index}`]}
                                        helperText={errors[`to-${index}`]}
                                    />
                                    {formData.recipients.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            color="error"
                                            sx={{ ml: 2 }}
                                            onClick={() => removeToField(index)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    {index === formData.recipients.length - 1 && (
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            sx={{ ml: 2 }}
                                            onClick={addAnotherTo}
                                        >
                                            Add Another Recipient
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <TextField
                            label="Subject"
                            variant="outlined"
                            fullWidth
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            margin="normal"
                        />

                        <TextField
                            label="Body"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            margin="normal"
                        />

                        <div className="form-group">
                            <label>Attachments:</label>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                onChange={(e) => setFormData({ ...formData, attachment: e.target.files })}
                            />
                            {formData.attachment.length > 0 && (
                                <ul>
                                    {Array.from(formData.attachment).map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Priority:</label>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    label="Priority"
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Normal">Normal</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                    <MenuItem value="Urgent">Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mr: 2 }}
                            >
                                Send
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleMoveToDraft}
                            >
                                Move to Draft
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ComposeModal;
