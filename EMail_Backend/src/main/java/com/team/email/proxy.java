package com.team.email;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team.email.User.UserBuilder;

public class proxy implements UserInterface {
    private static final proxy AppProxy=new proxy();
    private User user;
    private Vector<String> UserNames;
    private Vector<String> passwords;

    public proxy(){
        ObjectMapper mapper = new ObjectMapper();
        this.UserNames=new Vector<>();
        this.passwords=new Vector<>();
        try {
            // Map JSON to the UsersData class
            UsersData usersData = mapper.readValue(new File("usersData.json"), UsersData.class);
            // Populate Vectors
                UserNames.addAll(usersData.getUserNames());
                passwords.addAll(usersData.getPasswords());
        } catch (IOException e) {
            System.out.println(e);
        }

    }

    public Boolean getAccess(String userName,String password){
        Boolean access=false;
        if(!UserNames.contains(userName)){
            access=false;
            System.out.println("there is no user name");
        }
        else{
            int index=UserNames.indexOf(userName);
            if(password.equals(passwords.get(index))){
                access=true;
                System.out.println("Access granted");
            }
            else {
                access=false;
                System.out.println("wrong password");
            }
        }
        return access;
    }

    public void loadUser(String userName) {
            try {
                this.user = new User();
                this.user = user.load(userName);
            } catch (Exception e) {
                System.err.println(e);
            }
        

    }

    public boolean makeAccount(String userName,String password) {
        ObjectMapper objectMapper = new ObjectMapper();
        if(!UserNames.contains(userName)){
            String currentDir = System.getProperty("user.dir");
            String folderName = userName;
            currentDir =Paths.get(currentDir, "dataBase").toString(); 
            Path folderPath = Paths.get(currentDir, folderName);
            
            try {
                Files.createDirectories(folderPath); 
                System.out.println("Folder created at: " + folderPath);
                Contacts emptyContacts=new Contacts();
                MailFolders emptyFolders=new MailFolders();
                User.UserBuilder userBuilder=new UserBuilder(userName, password);
                userBuilder.setContacts(emptyContacts);
                userBuilder.setMailFolders(emptyFolders);
                User user1 = userBuilder.build();
       
              
                try{
                user1.save();
                }
                catch(Exception e){
                    System.out.println(e);
                }
                this.UserNames.add(userName);
                this.passwords.add(password);
                UsersData usersData=new UsersData(this.UserNames, this.passwords);
                try{
                objectMapper.writeValue(new File("usersData.json"), usersData);
                }
                catch (IOException e) {
                    System.out.println(e);
                }
                return true;
            } catch (IOException e) {
                System.err.println("An error occurred while creating the folder: " + e.getMessage());
                return false;
            }
        }
        else{
            System.out.print("this username is used");
            return false;
        }
    }

    public User getUser(){
        return this.user;
    }

    @Override
    public void sendMail(Vector<Attachment> attachments,Vector<String> recipients,String subject ,int priority ,String body,String date){
        this.user.sendMail(attachments, recipients, subject, priority, body, date);
    }

    @Override
    public void makeDraft(Vector<Attachment> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date){
        this.user.makeDraft(attachments, sender, recipients, subject, priority, body, date);
    }

    @Override
    public void MoveToTrash(String folderName,String date,String DeleteDate){
        this.user.MoveToTrash(folderName, date, DeleteDate);
    }

    @Override
    public void returnFromTrash(String date){
        this.user.returnFromTrash(date);
    }

    @Override
    public void deleteMail(String folderName,String date){
        this.user.deleteMail(folderName, date);
    }

    @Override
    public void moveToFolder(String oldFolder,String newFolder,String date){
        this.user.moveToFolder(oldFolder, newFolder, date);
    }
    
    @Override
    public void addUserFolder(String folderName){
        this.user.addUserFolder(folderName);
    }

    @Override
    public void renameUserFolder(String oldFolder,String newFolder){
        this.user.renameUserFolder(oldFolder, newFolder);
    }

    @Override
    public void deleteUserFolder(String folderName){
        this.user.deleteUserFolder(folderName);
    }

    @Override
    public MailFolders getMailFolders(){
        return this.user.getMailFolders();
    }

    @Override
    public Contacts getContacts() {
        return this.user.getContacts();
    }

    public void deletecontact(String Id){
        this.user.getContacts().DeleteContact(Id);
        try {
            this.user.save();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void editContact(String ID, String contactName ,Vector<String> mails){
        this.user.getContacts().EditContact(ID, contactName, mails);
        try {
            this.user.save();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void addContact(String ID,String contactName,Vector<String> UserNames){
        this.user.getContacts().AddContact(ID, contactName, UserNames);
        try {
            this.user.save();
        } catch (Exception ex) {
        }
    }

    public Set<String> getFolderNames(){
        return this.user.getMailFolders().getFolderNames();
    }

    public Map<String,Vector<Mail>> getUserFolders(){
        return this.user.getMailFolders().getUserFolders();
    }

    public static proxy getInstance(){
        return AppProxy;
    }

}
