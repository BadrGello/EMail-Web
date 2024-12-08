import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ComposeModal = ({ userName, closeModal }) => {
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

    // const [open, setOpen] = useState(false); // State for controlling modal visibility

    const isFormEmpty = () => {
        return (
            formData.to.every(email => email.trim() === '') &&
            formData.subject.trim() === '' &&
            formData.body.trim() === '' &&
            formData.attachments.length === 0
        );
    };

    const isFormNotComplete = () => {
        return (
            formData.to.every(email => email.trim() === '') ||
            formData.subject.trim() === '' ||
            formData.body.trim() === ''
        );
    };

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

    // Set the current date and time into formData
    const setDate = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            date: new Date().toISOString(), 
        }));
    };

    const handleMoveToDraft = () => {
        if (isFormEmpty()){
            console.log("Empty Form")
            closeModal()
            return;
        }

        let newformData = {...formData}
        newformData.date = new Date().toISOString();
        console.log('Saving to Drafts:', newformData);
        alert('Email saved to drafts!');
        closeModal(); // Close the modal after saving to drafts
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isFormNotComplete()){
            alert("Make Sure You Filled The Following Fields: To - Subject - Body ")
            return
        }

        console.log("Sending", formData);
        alert('Email sent successfully!');
        closeModal();
        setDate();  // Set the current date before sending  
        
    };

    const resetForm = () => {
        setFormData({
            id: null,
            sender: userName,
            to: [''],
            subject: '',
            body: '',
            attachments: [],
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
                            {formData.to.map((email, index) => (
                                <div key={index}>
                                    <TextField
                                        label={`Recipient ${index + 1}`}
                                        variant="outlined"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => handleToChange(index, e.target.value)}
                                        margin="normal"
                                    />
                                    {formData.to.length > 1 && (
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
                                    {index === formData.to.length - 1 && (
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
                                onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
                            />
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
