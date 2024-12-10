package com.team.email;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Vector;

import org.everit.json.schema.Schema;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONTokener;

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
        //validateSchema(jsonFile); 
        return objectMapper.readValue(jsonFile, User.class);
    }

    public void recievMail(Mail mail){
        this.mailFolders.getInboxFolder().add(mail);
    }

    public void sendMail(Vector<String> attachments,Vector<String> recipients,String subject ,int priority ,String body,String date){
        this.mailFolders.sendMail(attachments, this.userName, recipients, subject, priority, body, date);
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Contacts getContacts() {
        return this.contacts;
    }

    public void setContacts(Contacts contacts) {
        this.contacts = contacts;
    }

    public MailFolders getMailFolders() {
        return this.mailFolders;
    }

    public void setMailFolders(MailFolders mailFolders) {
        this.mailFolders = mailFolders;
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

    public UserBuilder(String userName, String password){
       this.userName = userName;
       this.password = password;
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

    public static void main(String[] args) throws Exception {
        //Contacts c=new Contacts();
        //MailFolders f=new MailFolders();
        //User.UserBuilder userBuilder=new UserBuilder("adham", "0000");
        //userBuilder.setContacts(c);
        //userBuilder.setMailFolders(f);
        //User user1 = userBuilder.build();
        //user1.setEmail("null@example.com");
        //user1.setId("1");
        //user1.save(".\\adham.json");
        //User user = new User();
        //user=user.load(".\\adham.json");
        //System.out.println(user.getUserName());
        User user1 = new User();
        String recipient="adham";
        String currentDir = System.getProperty("user.dir");
        Path folderPath = Paths.get(currentDir, recipient);
        Path filePath = Paths.get(folderPath.toString(), "User.json");
        user1=user1.load(filePath.toString());
        System.out.println("load done");
        Vector<String> s=new Vector<>();
        s.add("adham1");
        user1.sendMail(s , s, "", 1, "", "");
        user1.save(filePath.toString());

    }
}