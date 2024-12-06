package com.team.email;


import java.util.Vector;
import java.util.regex.Pattern;

public class Contact {

    private String ID;
    private String Name;
    private Vector<String> Emails=new Vector<>();

    public Contact(String Id,String name,Vector<String> Mails){
        if(ValidMails(Mails)){
            this.ID=Id;
            this.Name=name;
            for(int i=0;i<Mails.size();i++){
                AddEmail(Mails.get(i));
            }
        }
        else{
            System.out.println("there is invalid mail");
        }
    }

    public String getID(){
        return this.ID;
    }

    public String getName(){
        return this.Name;
    }

    public Vector<String> getMails(){
        return this.Emails;
    }

    private void AddEmail(String mail){
        if(this.ValidMail(mail) && !this.Emails.contains(mail) ){
            this.Emails.add(mail);
        }
    }

    private boolean ValidMail(String mail){
            String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
            return Pattern.matches(regex, mail);
    }

    private boolean ValidMails(Vector<String> mails){
        for(int i=0;i<mails.size();i++){
            if(!ValidMail(mails.get(i))) return false;
        }
        return true;
    }

    public Contact Edit(String name,Vector<String> Mails){
        if(ValidMails(Mails)){
            Contact EditedContact=new Contact(this.ID,name,Mails);
            return EditedContact;
        }
        else{
            System.out.println("no edit done(there is male invalid)");
            return this;
        }    
    }
}
