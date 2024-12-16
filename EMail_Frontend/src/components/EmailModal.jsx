import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const EmailModal = ({ email, isOpen, onClose, userName }) => {
    const handleDownload = (attachment) => {
        const link = document.createElement('a');
        // Create a Blob URL from the base64-encoded file
        const blob = new Blob([new Uint8Array(atob(attachment.file).split("").map(char => char.charCodeAt(0)))], { type: attachment.type });
        const url = URL.createObjectURL(blob);
        
        link.href = url;
        link.download = attachment.name; // Use the file name from attachment object
        link.click();
        URL.revokeObjectURL(url); // Clean up the URL object after use
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="email-details-title"
            aria-describedby="email-details-description"
        >
            <Box sx={styles.modal}>
                <Typography id="email-details-title" variant="h5" component="h2">
                    Email Details
                </Typography>
                <Typography variant="body1">
                <Typography variant="body1">
                    <strong>
                        {email?.sender === userName ? 'To:' : 'From:'}
                    </strong>{' '}
                    {email?.sender === userName ? email?.recipients.join(', ') : email?.sender}
                </Typography>
                </Typography>
                <Typography variant="body1">
                    <strong>Date:</strong> {email?.date}
                </Typography>
                <Typography variant="body1">
                    <strong>Subject:</strong> {email?.subject}
                </Typography>
                <Typography variant="body1">
                    <strong>Priority:</strong> {email?.priority}
                </Typography>
                <Typography variant="body1">
                    <strong>Body:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    {email?.body}
                </Typography>
                {email?.attachment?.length > 0 && (
                    <div>
                        <Typography variant="body1" gutterBottom>
                            <strong>Attachments:</strong>
                        </Typography>
                        {email.attachment.map((attachment, index) => (
                            
                            <Button
                                key={index}
                                onClick={() => handleDownload(attachment)}
                                variant="contained"
                                sx={{ marginBottom: '8px' }}
                            >
                                Download {attachment.name}
                            </Button>
                        ))}
                    </div>
                )}
                <Button onClick={onClose} variant="outlined" color="error" sx={{ marginTop: '16px' }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

const styles = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    },
};

export default EmailModal;
