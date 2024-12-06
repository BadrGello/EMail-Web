import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const EmailModal = ({ email, isOpen, onClose }) => {
    const handleDownload = (attachment) => {
        const link = document.createElement('a');
        link.href = attachment; // Replace with real file URL
        link.download = attachment.split('/').pop(); // Extract file name
        link.click();
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
                    <strong>Sender:</strong> {email?.sender}
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
                {email?.attachments?.length > 0 && (
                    <div>
                        <Typography variant="body1" gutterBottom>
                            <strong>Attachments:</strong>
                        </Typography>
                        {email.attachments.map((attachment, index) => (
                            <Button
                                key={index}
                                onClick={() => handleDownload(attachment)}
                                variant="contained"
                                sx={{ marginBottom: '8px' }}
                            >
                                Download {attachment.split('/').pop()}
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
