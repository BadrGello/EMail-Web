package com.team.email;

public class User {
    private String id;
    private String userName;
    private String password;
    private String email;
    private Contacts contacts;
    // More to be added when Mail created

    private User (UserBuilder builder){
        this.id = builder.id;
        this.userName = builder.userName;
        this.password = builder.password;
        this.email = builder.email;
        this.contacts = builder.contacts;

    }
    public static class UserBuilder{
    private String id;
    private String userName;
    private String password;
    private String email;
    private Contacts contacts;

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