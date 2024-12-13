package com.team.email;

import java.util.Vector;

public class Mail {
    private String subject;
    private int priority;
    private String body;
    private String sender;
    private Vector<String> recipients;
    private String date;
    private String folderBeforeDelete;
    private String deletedDate;
    Vector<Attachment> attachments;

    public Mail() {
    }


    public Mail(Vector<Attachment> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date,String folderBeforeDelete,String deltedDate){
            this.attachments=attachments;
            this.sender=sender;
            this.recipients=recipients;
            this.subject=subject;
            this.priority=priority;
            this.body=body;
            this.date=date;
            this.folderBeforeDelete=folderBeforeDelete;
            this.deletedDate=deltedDate;
    }

    
    public String getSender(){
        return this.sender;
    }

    public Vector<String> getRecipients(){
        return this.recipients;
    }

    public String getSubject(){
        return this.subject;
    }

    public int getPriority(){
        return this.priority;
    }

    public String getBody(){
        return this.body;
    }   

    public String getDate(){
        return this.date;
    }
    
    public String getFolderNameBeforeDelete(){
        return this.folderBeforeDelete;
    }

    public String getDeletedDate(){
        return this.deletedDate;
    }  
    
    public Vector<Attachment> getAttachment(){
        return this.attachments;
    }

    public Mail trashMail(String folderName,String DeleteDate){
        Mail trashMail=new Mail(this.attachments,this.sender,this.recipients,this.subject,this.priority,this.body,this.date,folderName,DeleteDate);
        return trashMail;
            }
    
    public Mail regMail(){
        Mail trashMail=new Mail(this.attachments,this.sender,this.recipients,this.subject,this.priority,this.body,this.date,"","");
        return trashMail;
    } 
    
    public Mail cloneMail (){
        Mail mail = new Mail(this.attachments,this.sender,this. recipients,this. subject ,this. priority ,this. body,this. date,this. folderBeforeDelete,this.deletedDate);
        return mail;
    }


}
