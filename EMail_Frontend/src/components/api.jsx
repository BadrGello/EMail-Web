import axios from 'axios';

const BASE_URL = "http://localhost:8080/api"; // Backend server URL

export const fetchEmails = (folder, page = 1) => 
    axios.get(`${BASE_URL}/emails`, { params: { folder, page } });

export const sendEmail = (emailData) =>
    axios.post(`${BASE_URL}/emails/send`, emailData);

export const deleteEmail = (emailId) =>
    axios.delete(`${BASE_URL}/emails/${emailId}`);

export const fetchContacts = () =>
    axios.get(`${BASE_URL}/contacts`);

export const addContact = (contactData) =>
    axios.post(`${BASE_URL}/contacts`, contactData);

export const searchEmails = (query) =>
    axios.get(`${BASE_URL}/emails/search`, { params: { query } });
