package com.team.email;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

public class MailFolders {

////////////////intialize variables////////////////////////////////////////////

    private Vector<Mail> inboxFolder =new Vector<>();
    private Vector<Mail> sentFolder =new Vector<>();
    private Vector<Mail> draftFolder =new Vector<>();
    private Vector<Mail> trashFolder =new Vector<>();
    private Map<String,Vector<Mail>> UserFolders =new HashMap<>();
    private Vector<Mail> sortedMails=new Vector<>();;
    

    public MailFolders() {
    }
    
    public void loadData(){
        //load data from dataBase when sign in
    }

////////////user direct methods with mails//////////////////////////////////
    
    public void sendMail(Vector<String> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date){
        Mail mail =new Mail(attachments,sender,recipients,subject, priority, body,date,"","");
        this.sentFolder.add(mail);
        for(int i=0;i<recipients.size();i++){
            Mail tempMail = mail.cloneMail();
            String recipient=recipients.get(i);
            String currentDir = System.getProperty("user.dir");
            Path folderPath = Paths.get(currentDir, recipient);
            Path filePath = Paths.get(folderPath.toString(), "User.json");
            User reciever = new User();
            try{
            reciever = reciever.load(recipient);
            reciever.recievMail(tempMail);
            }
            catch(Exception e){
                System.out.println(e);
            }
            //save the mail in each inbox folder for each recipient and in sent folder in sender folder (in database)
        }
    }

    public void makeDraft(Vector<String> attachments,String sender,Vector<String> recipients,String subject ,int priority ,String body,String date){
        Mail mail =new Mail(attachments,sender,recipients,subject, priority, body,date,"","");
        this.draftFolder.add(mail);
        //save it in database in sender (dont save it in recipients)
    }

    public void MoveToTrash(String folderName,String date,String DeleteDate){
        switch (folderName) {
            case "sent":
            for(int i=0;i<this.sentFolder.size();i++){
                if(this.sentFolder.get(i).getDate()==date){
                    this.trashFolder.add(this.sentFolder.get(i).trashMail(folderName, DeleteDate));
                    this.sentFolder.remove(i);
                    break;
                }
            }
                break;
             case"inbox":
             for(int i=0;i<this.inboxFolder.size();i++){
                if(this.inboxFolder.get(i).getDate()==date){
                    this.trashFolder.add(this.inboxFolder.get(i).trashMail(folderName, DeleteDate));
                    this.inboxFolder.remove(i);
                    break;
                }
            }
                break;
            case "draft":
            for(int i=0;i<this.draftFolder.size();i++){
                if(this.draftFolder.get(i).getDate()==date){
                    this.trashFolder.add(this.draftFolder.get(i).trashMail(folderName, DeleteDate));
                    this.draftFolder.remove(i);
                    break;
                }
            }
                break;
            default:
            for(int i=0;i<this.UserFolders.get(folderName).size();i++){
                if(this.UserFolders.get(folderName).get(i).getDate()==date){
                    this.trashFolder.add(this.UserFolders.get(folderName).get(i).trashMail(folderName, DeleteDate));
                    this.UserFolders.get(folderName).remove(i);
                    break;
                }
            }
        }
        //save this in user's folder who made it
    }

    public void returnFromTrash(String date){
        Mail returnedMail=null;
        String folderName="";
        for(int i=0;i<this.trashFolder.size();i++){
            if(this.trashFolder.get(i).getDate()==date){
                returnedMail=this.trashFolder.get(i).regMail();
                folderName=this.trashFolder.get(i).getFolderNameBeforeDelete();
                this.trashFolder.remove(i);
                break;
            }
        }
        switch (folderName) {
            case "inbox":
                this.inboxFolder.add(returnedMail);
                break;
            
            case "sent":
                this.sentFolder.add(returnedMail);
                break;
                
            case "draft":
                this.draftFolder.add(returnedMail);
                break;

            default:
                this.UserFolders.get(folderName).add(returnedMail);
        }
        //save this in user's folder who made it
    }

    public void deleteMail(String folderName,String date){
        switch (folderName) {
            case "draft":
                for(int i=0;i<this.draftFolder.size();i++){
                    if(this.draftFolder.get(i).getDate()==date){
                        this.draftFolder.remove(i);
                        break;
                    }
                }
                break;

            case "trash":
            for(int i=0;i<this.trashFolder.size();i++){
                if(this.trashFolder.get(i).getDate()==date){
                    this.trashFolder.remove(i);
                    break;
                }
            }
                break;    
            default:
                System.out.println("this cant be deleted");
        }
        //save this in user's folder who made it
    }

    public void moveToFolder(String oldFolder,String newFolder,String date){
        switch (oldFolder) {
            case "sent":
            for(int i=0;i<this.sentFolder.size();i++){
                if(this.sentFolder.get(i).getDate()==date){
                    this.UserFolders.get(newFolder).add(this.sentFolder.get(i));
                    this.sentFolder.remove(i);
                    break;
                }
            }
                break;
             case"inbox":
             for(int i=0;i<this.inboxFolder.size();i++){
                if(this.inboxFolder.get(i).getDate()==date){
                    this.UserFolders.get(newFolder).add(this.inboxFolder.get(i));
                    this.inboxFolder.remove(i);
                    break;
                }
            }
                break;
            case "draft":
            for(int i=0;i<this.draftFolder.size();i++){
                if(this.draftFolder.get(i).getDate()==date){
                    this.UserFolders.get(newFolder).add(this.draftFolder.get(i));
                    this.draftFolder.remove(i);
                    break;
                }
            }
                break;
            default:
            for(int i=0;i<this.UserFolders.get(oldFolder).size();i++){
                if(this.UserFolders.get(oldFolder).get(i).getDate()==date){
                    this.UserFolders.get(newFolder).add(this.UserFolders.get(oldFolder).get(i));
                    this.UserFolders.get(oldFolder).remove(i);
                    break;
                }
            }
        }
        //save this in user's folder who made it
    }

///////////////user folder methods////////////////

    public void addUserFolder(String folderName){
        if(!this.UserFolders.containsKey(folderName)&&!"draft".equals(folderName)&&!"sent".equals(folderName)&&!"inbox".equals(folderName)&&!"trash".equals(folderName)){
            Vector<Mail> newFolder=new Vector<>();
            this.UserFolders.put(folderName, newFolder);
        }
        else{
            System.out.print("can't name by this name");
        }
        //save this in user's folder who made it
    }

    public void renameUserFolder(String oldFolder,String newFolder){
        if(!this.UserFolders.containsKey(newFolder)&&!"draft".equals(newFolder)&&!"sent".equals(newFolder)&&!"inbox".equals(newFolder)&&!"trash".equals(newFolder)){
            this.UserFolders.put(newFolder, UserFolders.get(oldFolder));
            this.UserFolders.remove(oldFolder);
            for(int i=0;i<this.sentFolder.size();i++){
                if(this.trashFolder.get(i).getFolderNameBeforeDelete()==oldFolder){
                    this.trashFolder.add(this.sentFolder.get(i).trashMail(newFolder,this.trashFolder.get(i).getDeletedDate()));
                    this.sentFolder.remove(i);
                    break;
                }
            }
        }
        else{
            System.out.print("can't name by this name");
        }
        //save this in user's folder who made it
    }

    public void deleteUserFolder(String folderName){
        this.UserFolders.remove(folderName);
        System.out.println(this.UserFolders.keySet().size());
        for(int i=0;i<this.trashFolder.size();i++){
            if(this.trashFolder.get(i).getFolderNameBeforeDelete()==folderName){
                this.trashFolder.remove(i);
                break;
            }
        }
        //save this in user's folder who made it
    }

//////////////////neededMethods//////////////////////////////////////

    private Vector<Mail> theTrueFolder(String folderName){
        Vector<Mail> tempMails=new Vector<>();
        switch (folderName) {
            case "inbox" :
                tempMails=(Vector<Mail>) this.inboxFolder.clone();
                break;

            case "sent" :
                tempMails=(Vector<Mail>) this.sentFolder.clone();
                break;

            case "draft" :
                tempMails=(Vector<Mail>) this.draftFolder.clone();
                break;

            case "trash" :
                tempMails=(Vector<Mail>) this.trashFolder.clone();
                break;
            default:
                tempMails=(Vector<Mail>) this.UserFolders.get(folderName).clone();
        }
        return tempMails;
    }

//////////////////sort Methods///////////////////////////////////////

    public void sortByDate(String folderName){
        this.sortedMails =theTrueFolder(folderName);
        sorter sorter=new sorter();

        Collections.sort(this.sortedMails, sorter.DateCompare());
        
    }

    public void sortBySender(String folderName){
        this.sortedMails =theTrueFolder(folderName);
        sorter sorter=new sorter();

        Collections.sort(this.sortedMails, sorter.SenderCompare());
        
    }


    public void sortByImportance(String folderName){
        this.sortedMails =theTrueFolder(folderName);
        sorter sorter=new sorter();

        Collections.sort(this.sortedMails, sorter.ImportanceCompare());
    }

    public void sortBySubject(String folderName){
        this.sortedMails =theTrueFolder(folderName);
        sorter sorter=new sorter();

        Collections.sort(this.sortedMails, sorter.SubjectCompare());
        
    }

    public void sortByBody(String folderName){
        this.sortedMails =theTrueFolder(folderName);
        sorter sorter=new sorter();

        Collections.sort(this.sortedMails, sorter.BodyCompare());
        
    }
    public void reverseOrder(){
        int start=0;
        int end = this.sortedMails.size()-1;
        while (start < end) {
            Mail temp = sortedMails.get(start);
            sortedMails.set(start, sortedMails.get(end));
            sortedMails.set(end, temp);
            start++;
            end--;
        }
    }

/////////////////search Methods/////////////////////////////////////

    private boolean isThisNameInSearch(String SearchText,String mailText){
        SearchText=SearchText.toLowerCase();
        mailText=mailText.toLowerCase();
        if(SearchText.length()>mailText.length()){
            return false;
        }
        else{
            for(int i=0;i<=mailText.length()-SearchText.length();i++){
                String s=mailText.substring(i, i+SearchText.length());
                if(s.equals(SearchText)){
                    return true;
                }
            }
                return false;
        }

    }

    public Vector<Mail> searchByAll(String text,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;
        for(int i=0;i<tempMails.size();i++){

            if( this.isThisNameInSearch(text, tempMails.get(i).getDate())){
                searchMails.add(tempMails.get(i));
            }

            else if( this.isThisNameInSearch(text, tempMails.get(i).getSender()) && folderName != "sent"){
                searchMails.add(tempMails.get(i));
            }

            else if( this.isThisNameInSearch(text, tempMails.get(i).getSubject())){
                searchMails.add(tempMails.get(i));
            }

            else if( this.isThisNameInSearch(text, tempMails.get(i).getBody())){
                searchMails.add(tempMails.get(i));
            }

            else{
            int j=0;
            if(folderName!="inbox"){
            for(j=0;j<tempMails.get(i).getRecipients().size();j++){
                if( this.isThisNameInSearch(text, tempMails.get(i).getRecipients().get(j))){
                    searchMails.add(tempMails.get(i));
                    break;
                }
            }
            }
            if(j==tempMails.get(i).getRecipients().size()){
            for(j=0;j<tempMails.get(i).getAttachment().size();j++){
                if( this.isThisNameInSearch(text, tempMails.get(i).getAttachment().get(j))){
                    searchMails.add(tempMails.get(i));
                    break;
                }
            }
            }
            
        }
        }
        return searchMails;
    }
    
    public Vector<Mail> searchByDate(String date,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;

        for(int i=0;i<tempMails.size();i++){
            if( this.isThisNameInSearch(date, tempMails.get(i).getDate())){
                searchMails.add(tempMails.get(i));
            }
        }
        return searchMails;
         
    }

    public Vector<Mail> searchBySender(String sender,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;

        for(int i=0;i<tempMails.size();i++){
            if( this.isThisNameInSearch(sender, tempMails.get(i).getSender())){
                searchMails.add(tempMails.get(i));
                break;
            }
        }
        return searchMails;
         
    }

    public Vector<Mail> searchByRecivers(String reciver,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;

        for(int i=0;i<tempMails.size();i++){
            for(int j=0;j<tempMails.get(i).getRecipients().size();j++){
                if( this.isThisNameInSearch(reciver, tempMails.get(i).getRecipients().get(j))){
                    searchMails.add(tempMails.get(i));
                }
            }
        }
        return searchMails;
         
    }

    public Vector<Mail> searchByImportance(int priority,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;

        for(int i=0;i<tempMails.size();i++){
            if(tempMails.get(i).getPriority()==priority){
                searchMails.add(tempMails.get(i));
            }
        }
        return searchMails;
    }

    public Vector<Mail> searchBySubject(String subject,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;
        
        for(int i=0;i<tempMails.size();i++){
            if( this.isThisNameInSearch(subject, tempMails.get(i).getSubject())){
                searchMails.add(tempMails.get(i));
            }
        }
        return searchMails;
         
    }

    public Vector<Mail> searchByBody(String body,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;

        for(int i=0;i<tempMails.size();i++){
            if( this.isThisNameInSearch(body, tempMails.get(i).getBody())){
                searchMails.add(tempMails.get(i));
            }
        }
        return searchMails;
         
    }

    public Vector<Mail> searchByAttachment(String attachment,String folderName){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.sortedMails;

        for(int i=0;i<tempMails.size();i++){
            for(int j=0;j<tempMails.get(i).getAttachment().size();j++){
                if( this.isThisNameInSearch(attachment, tempMails.get(i).getAttachment().get(j))){
                    searchMails.add(tempMails.get(i));
                    break;
                }
            }
        }
        return searchMails;
    }

///////////////filter methods//////////////////////////////////////
    public Vector<Mail> filterBySender (Vector<Mail> mails, String senders){
        SenderCriteria senderCriteria = new SenderCriteria();
        Vector<Mail> filtered = senderCriteria.meetCriteria(mails, senders);
        return filtered;
    }

    public Vector<Mail> filterBySubject (Vector<Mail> mails, String subjects){
        SubjectCriteria subjectCriteria = new SubjectCriteria();
        Vector<Mail> filtered = subjectCriteria.meetCriteria(mails, subjects);
        return filtered;
    }
    
    
     
///////////////return folders methods//////////////////////////////    

    public Vector<Mail> getInboxFolder(){
        return this.inboxFolder;
    }

    public Vector<Mail> getSentFolder(){
        return this.sentFolder;
    }

    public Vector<Mail> getDraftFolder(){
        return this.draftFolder;
    }

    public Vector<Mail> getTrashFolder(){
        return this.trashFolder;
    }

    public Vector<Mail> getOtherFolder(String folderName){
        return this.UserFolders.get(folderName);
    }
    public Set<String> getFolderNames(){
        return this.UserFolders.keySet();
    }

    public Vector<Mail> getSortedMail(){
        return this.sortedMails;
    }
    public Map<String,Vector<Mail>> getUserFolders(){
        return this.UserFolders;
    }

}
