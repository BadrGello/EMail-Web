package com.team.email;

import java.util.Vector;

public interface UserInterface {
    
    //send mail and save it in data base (sent folder for user and inbox folder for recievers)
    public void sendMail(Vector<Attachment> attachments,Vector<String> recipients,String subject ,int priority ,String body,String date);
    
    //if u dont send the mail it will be saved in draft folder if u open it u can complete it and send it
    public void makeDraft(Vector<Attachment> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date);
    
    //move to trash when u delete mails (remove from trash after 30 days)
    public void MoveToTrash(String folderName,String date,String DeleteDate);
    
    //return from trash to the folder it deleted from
    public void returnFromTrash(String date);
    
    //it will remove mail from all data base(for trash and draft only)
    public void deleteMail(String folderName,String date);
    
    //move mail to one of costume folders
    public void moveToFolder(String oldFolder,String newFolder,String date);
    
    //make a costume folder
    public void addUserFolder(String folderName);
    
    //rename a costume folder
    public void renameUserFolder(String oldFolder,String newFolder);
    
    ////delete a costume folder
    public void deleteUserFolder(String folderName);
    
    //get the contacts 
    public Contacts getContacts();
    
    //get all the folders
    public MailFolders getMailFolders();
    
    //delete contact
    public void deletecontact(String Id);
    
    //edit a contact
    public void editContact(String ID, String contactName ,Vector<String> mails);
    
    //add a contact
    public void addContact(String ID,String contactName,Vector<String> UserNames);

}
