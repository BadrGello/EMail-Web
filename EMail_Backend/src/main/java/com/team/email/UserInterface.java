package com.team.email;

import java.util.Vector;

public interface UserInterface {
    
    public void sendMail(Vector<Attachment> attachments,Vector<String> recipients,String subject ,int priority ,String body,String date);
    public void makeDraft(Vector<Attachment> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date);
    public void MoveToTrash(String folderName,String date,String DeleteDate);
    public void returnFromTrash(String date);
    public void deleteMail(String folderName,String date);
    public void moveToFolder(String oldFolder,String newFolder,String date);
    public void addUserFolder(String folderName);
    public void renameUserFolder(String oldFolder,String newFolder);
    public void deleteUserFolder(String folderName);
    public Contacts getContacts();
    public MailFolders getMailFolders();
}
