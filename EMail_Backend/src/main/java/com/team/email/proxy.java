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
    private boolean access=false;
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

    public void getAccess(String userName,String password){
        if(!UserNames.contains(userName)){
            this.access=false;
            System.out.println("there is no user name");
        }
        else{
            int index=UserNames.indexOf(userName);
            if(password.equals(passwords.get(index))){
                this.access=true;
                System.out.println("Access granted");
            }
            else {
                this.access=false;
                System.out.println("wrong password");
            }
        }
    }

    public void loadUser(String userName) {
            try {
                this.user = new User();
                this.user = user.load(userName);
            } catch (Exception e) {
                System.err.println(e);
            }
        

    }

    public void makeAccount(String userName,String password) {
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
            } catch (IOException e) {
                System.err.println("An error occurred while creating the folder: " + e.getMessage());
            }
        }
        else{
            System.out.print("this username is used");
        }
    }

    public User getUser(){
        return this.user;
    }

    @Override
    public void sendMail(Vector<String> attachments,Vector<String> recipients,String subject ,int priority ,String body,String date){
        this.user.sendMail(attachments, recipients, subject, priority, body, date);
    }

    @Override
    public void makeDraft(Vector<String> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date){
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

    public Set<String> getFolderNames(){
        return this.user.getMailFolders().getFolderNames();
    }

    public Map<String,Vector<Mail>> getUserFolders(){
        return this.user.getMailFolders().getUserFolders();
    }

    public static proxy getInstance(){
        return AppProxy;
    }
    public static void main(String[] args) throws Exception {
        proxy p=new proxy();
        //p.makeAccount("adham4", "0003");
        p.loadUser("adham4");
        //p.getMailFolders().getUserFolders().keySet();
        //Vector<String> s=new Vector<>();
        //s.add("null@gg.com");
        //p.getContacts().AddContact("1", "hello", s);
        //p.addUserFolder("adham2");
        //System.out.println(p.getContacts().getSortedContacts().get(0).getName());
        p.getUser().save();
    }

}
