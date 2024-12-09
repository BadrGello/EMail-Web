package com.team.email;
import org.everit.json.schema.Schema;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONTokener;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

public class User implements UserInterface {
    private String id;
    private String userName;
    private String password;
    private String email;
    private Contacts contacts;
    private MailFolders mailFolders;



    public User() {
    }
   
    private User (UserBuilder builder){
        this.id = builder.id;
        this.userName = builder.userName;
        this.password = builder.password;
        this.email = builder.email;
        this.contacts = builder.contacts;
        this.mailFolders = builder.mailFolders;

    }
     public void save(String filePath) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        File jsonFile = new File(filePath);
        objectMapper.writeValue(jsonFile, this);
        validateSchema(jsonFile);

        System.out.println("User saved");
    }

 
    public User load(String filePath) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        File jsonFile = new File(filePath);
        validateSchema(jsonFile); 
        return objectMapper.readValue(jsonFile, User.class);
    }


    private static void validateSchema(File jsonFile) throws Exception {

        FileInputStream schemaStream = new FileInputStream(SchemaConfig.SCHEMA_PATH);
        JSONObject schemaJSON = new JSONObject(new JSONTokener(schemaStream));
        Schema schema = SchemaLoader.load(schemaJSON);

        FileInputStream jsonStream = new FileInputStream(jsonFile);
        JSONObject jsonObject = new JSONObject(new JSONTokener(jsonStream));

     
        schema.validate(jsonObject); 
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
    public UserBuilder setMailFolders(MailFolders mailFolders){
        this.mailFolders= mailFolders;
        return this;
    }
    public User build(){
        User user = new User(this);
        return user;
    }

    }


}