package com.team.email;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Vector;

public class Contacts {
    private Vector<Contact> contacts=new Vector<>();
    
    public void AddContact(String ID, String contactName ,Vector<String> mails){
        Contact newContact = new Contact(ID, contactName, mails);
        contacts.add(newContact);
    }

    public void EditContact(String ID, String contactName ,Vector<String> mails){
        for(int i=0;i<this.contacts.size();i++){
            if(contacts.get(i).getID()==ID){
                contacts.set(i,contacts.get(i).Edit(contactName, mails));
            }
        }
    }

    public void DeleteContact(String ID){
        for(int i=0;i<this.contacts.size();i++){
            if(contacts.get(i).getID()==ID){
                contacts.remove(i);
            }
        }
    }

    public Vector<Contact> SearchContactsByName(String ContactName){
        Vector<Contact> searchContacts = new Vector<>();
        for(int i=0;i<this.contacts.size();i++){
            if(isThisNameInSearch(ContactName,this.contacts.get(i).getName())){
                searchContacts.add(this.contacts.get(i));
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
        for(int i=0;i<this.contacts.size();i++){
            Vector<String> contactMails=this.contacts.get(i).getMails();
            for(int j=0;j<contactMails.size();j++){
                if(contactMails.get(j)==Mail){
                    searchContacts.add(contacts.get(i));
                    break;
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

    public void SortContacts(){
        Collections.sort(this.contacts, s());
    }

    public Vector<Contact> getContacts(){
        return this.contacts;
    }
    public static void main(String[] args) {
        Contacts c=new Contacts();
        Vector<String> m=new Vector<>();
        m.add("safe@fesf.com");
        c.AddContact("1", "adham anass", m);
        c.AddContact("2", "Adham ahmed", m);
        c.AddContact("3", "ahmed anass", m);
        Vector<Contact> s=new Vector<>();
        s=c.SearchContactsByName("a");
        System.out.println(s.size());
    }
}
