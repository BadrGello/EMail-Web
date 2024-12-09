package com.team.email;

public class User implements UserInterface {
    private String id;
    private String userName;
    private String password;
    private String email;
    private Contacts contacts;
    private MailFolders mailFolders;
    // More to be added when Mail created

    User (UserBuilder builder){
        this.id = builder.id;
        this.userName = builder.userName;
        this.password = builder.password;
        this.email = builder.email;
        this.contacts = builder.contacts;
        this.mailFolders = builder.mailFolders;

    }
    public static class UserBuilder{
    private String id;
    private String userName;
    private String password;
    private String email;
    private Contacts contacts;
    private MailFolders mailFolders;

    public UserBuilder(String userName, String password, String email){
       this.userName = userName;
       this.password = password;
       this.email = email;
    }
    public UserBuilder setContacts(Contacts contacts){
        this.contacts = contacts;
        return this;
    }
    public UserBuilder setID (String id){
        this.id = id;
        return this;    
    }
    }



}