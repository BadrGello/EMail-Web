package com.team.email;

import java.awt.datatransfer.SystemFlavorMap;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Vector;

public class Contacts {
    private Vector<Contact> contacts=new Vector<>();
    private Vector<Contact> sortedContacts=new Vector<>();


    public Contacts() {
    }
    
    public void loadData(){
        //load data from dataBase when sign in
    }
    
    public void AddContact(String ID, String contactName ,Vector<String> mails){
        Contact newContact = new Contact(ID, contactName, mails);
        contacts.add(newContact);
        //should save at dataBase
    }

    public void EditContact(String ID, String contactName ,Vector<String> mails){
        for(int i=0;i<this.contacts.size();i++){
            if(contacts.get(i).getID().equals(ID)){
                contacts.set(i,contacts.get(i).Edit(contactName, mails));
            }
        }
        //should save at database
    }

    public void DeleteContact(String ID){
        for(int i=0;i<this.contacts.size();i++){
            if(contacts.get(i).getID().equals(ID)){
                System.out.println(ID);
                contacts.remove(i);
            }
        }
        //should save at database
    }

    public Vector<Contact> SearchContactsByName(String ContactName){
        Vector<Contact> searchContacts = new Vector<>();
        for(int i=0;i<this.sortedContacts.size();i++){
            if(isThisNameInSearch(ContactName,this.sortedContacts.get(i).getName())){
                searchContacts.add(this.sortedContacts.get(i));
            }
        }
        return searchContacts;
    }

    private boolean isThisNameInSearch(String SearchName,String ContactName){
        SearchName=SearchName.toLowerCase();
        ContactName=ContactName.toLowerCase();
        if(SearchName.length()>ContactName.length()){
            return false;
        }
        else{
            for(int i=0;i<=ContactName.length()-SearchName.length();i++){
                String s=ContactName.substring(i, i+SearchName.length());
                if(s.equals(SearchName)){
                    return true;
                }
            }
                return false;
        }

    } 

    public Vector<Contact> SearchContactsByEMail(String Mail){
        Vector<Contact> searchContacts = new Vector<>();
        for(int i=0;i<this.sortedContacts.size();i++){
            Vector<String> contactMails=this.sortedContacts.get(i).getMails();
            for(int j=0;j<contactMails.size();j++){
                if(isThisNameInSearch(Mail,contactMails.get(j))){
                    searchContacts.add(this.sortedContacts.get(i));
                    break;
                }
            } 
        }
        return searchContacts;
    }

    public Vector<Contact> SearchContactsByAll(String text){
        Vector<Contact> searchContacts = new Vector<>();
        for(int i=0;i<this.sortedContacts.size();i++){
            if(isThisNameInSearch(text,this.sortedContacts.get(i).getName())){
                searchContacts.add(this.sortedContacts.get(i));
                System.out.println(text+" in "+this.sortedContacts.get(i).getName());
            }
            else {
                Vector<String> contactMails=this.sortedContacts.get(i).getMails();
                for(int j=0;j<contactMails.size();j++){
                    if(isThisNameInSearch(text,contactMails.get(j))){
                        searchContacts.add(this.sortedContacts.get(i));
                        break;
                    }
                } 
            }
    }
    return searchContacts;
}
    private Comparator<Contact> s() {
        return new Comparator<Contact>() {
            @Override
            public int compare(Contact a, Contact b) {
                String as = a.getName().toUpperCase();
                String bs = b.getName().toUpperCase();
                return as.compareTo(bs); // Compare names lexicographically
            }
        };
    }
    private Comparator<Contact> numberOfEmails() {
        return new Comparator<Contact>() {
            @Override
            public int compare(Contact a, Contact b) {
                int an = a.getEmails().size();
                int bn = b.getEmails().size();
                return an-bn; // Compare names lexicographically
            }
        };
    }

    public void SortContacts(){
        System.out.println("done");
        this.sortedContacts = (Vector<Contact>) this.contacts.clone();
        Collections.sort(this.sortedContacts, s());
        
    }
    public void SortContactsByNumberOfEmails(){
        System.out.println("sorting by numbers");
        this.sortedContacts = (Vector<Contact>) this.contacts.clone();
        Collections.sort(this.sortedContacts, numberOfEmails());
    }

    public void reverseOrder(){
        System.out.println("reversing");
        int start=0;
        int end = this.sortedContacts.size()-1;
        while (start < end) {
            Contact temp = this.sortedContacts.get(start);
            this.sortedContacts.set(start, sortedContacts.get(end));
            this.sortedContacts.set(end, temp);
            start++;
            end--;
        }
        
    }

    public Vector<Contact> getContacts(){
        return this.contacts;
    }

    public Vector<Contact> getSortedContacts(){
        return this.sortedContacts;
    }
}
