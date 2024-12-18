package com.team.email;


import java.util.Collections;
import java.util.Vector;
import java.util.regex.Pattern;

public class Contact {

    private String ID;
    private String Name;
    private Vector<String> Emails=new Vector<>();
    private Vector<Mail> mails=new Vector<>();

    public Contact() {
    }

    public void setID(String ID) {
        this.ID = ID;
    }
    public void setName(String Name) {
        this.Name = Name;
    }

    public Vector<String> getEmails() {
        return this.Emails;
    }

    public void setEmails(Vector<String> Emails) {
        this.Emails = Emails;
    }
    public void setMails(Vector<Mail> mails) {
        this.mails = mails;
    }
    public Vector<Mail> getMails(){
        return this.mails;
    }
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
    
    public void deleteContactMail(String date){
        if(this.mails.size()!=1){
        for(Mail mail:this.mails){
            if(mail.getDate().equals(date)){
                System.out.println("found the mail");
                this.mails.remove(mail);
            }
        }
    }
    else {
        this.mails.remove(0);
    }
    }
    //////////////////sort Methods///////////////////////////////////////

    public void sortByDate(){
        sorter sorter=new sorter();
        Collections.sort(this.mails, sorter.DateCompare());
        
    }

    public void sortBySender(){
        sorter sorter=new sorter();

        Collections.sort(this.mails, sorter.SenderCompare());
        
    }


    public void sortByImportance(){
        sorter sorter=new sorter();

        Collections.sort(this.mails, sorter.ImportanceCompare());
    }

    public void sortBySubject(){
        sorter sorter=new sorter();

        Collections.sort(this.mails, sorter.SubjectCompare());
        
    }

    public void sortByBody(){
        sorter sorter=new sorter();

        Collections.sort(this.mails, sorter.BodyCompare());
        
    }
    public void reverseOrder(){
        int start=0;
        int end = this.mails.size()-1;
        System.out.println("hello");
        while (start < end) {
            Mail temp = this.mails.get(start);
            this.mails.set(start, this.mails.get(end));
            this.mails.set(end, temp);
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

    public Vector<Mail> searchByAll(String text){
        Vector<Mail> searchMails=new Vector<>();
        Vector<Mail> tempMails =this.mails;
        for(int i=0;i<tempMails.size();i++){

            if( this.isThisNameInSearch(text, tempMails.get(i).getDate())){
                searchMails.add(tempMails.get(i));
            }

            else if( this.isThisNameInSearch(text, tempMails.get(i).getSender())){
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
            for(j=0;j<tempMails.get(i).getRecipients().size();j++){
                if( this.isThisNameInSearch(text, tempMails.get(i).getRecipients().get(j))){
                    searchMails.add(tempMails.get(i));
                    break;
                }
            }
            if(j==tempMails.get(i).getAttachment().size()){
            for(j=0;j<tempMails.get(i).getAttachment().size();j++){
                if( this.isThisNameInSearch(text, tempMails.get(i).getAttachment().get(j).getName())){
                    searchMails.add(tempMails.get(i));
                    break;
                }
            }
            }
            
        }
        }
        return searchMails;
    }
    

///////////////filter methods//////////////////////////////////////
    public Vector<Mail> filterBySender (Vector<Mail> mails, String senders){
        System.out.println("sender is "+senders);
        SenderCriteria senderCriteria = new SenderCriteria();
        Vector<Mail> filtered = senderCriteria.meetCriteria(mails, senders);
        return filtered;
    }

    public Vector<Mail> filterBySubject (Vector<Mail> mails, String subjects){
        System.out.println("subject is "+subjects);
        SubjectCriteria subjectCriteria = new SubjectCriteria();
        Vector<Mail> filtered = subjectCriteria.meetCriteria(mails, subjects);
        System.out.println(filtered.size());
        return filtered;
    }
    
    
     
///////////////return folders methods//////////////////////////////    
}
