package com.team.email;

import java.io.File;
import java.io.IOException;
import java.util.Vector;

import com.fasterxml.jackson.databind.ObjectMapper;

public class proxy implements UserInterface {

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

    public void loadUser(){
        if(this.access){
            User.UserBuilder UserBuilder = null;
            user=new User(UserBuilder );
            //load user in this.user
        }
        else{
            System.out.println("no access");
        }
    }

    public void makeAccount(String userName,String password) {
        ObjectMapper objectMapper = new ObjectMapper();
        if(!UserNames.contains(userName)){
        this.UserNames.add(userName);
        this.passwords.add(password);
        UsersData usersData=new UsersData(this.UserNames, this.passwords);
        try{
        objectMapper.writeValue(new File("usersData.json"), usersData);
        }
        catch (IOException e) {
            System.out.println(e);
        }
        }
        else{
            System.out.print("this username is used");
        }
    }

    public User getUser(){
        return this.user;
    }
    
    public static void main(String[] args) {
        proxy p=new proxy();
        p.getAccess("adham1", "0001");
    }
}
