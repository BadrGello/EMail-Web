package com.team.email;

import java.util.Vector;

public class SenderCriteria implements Criteria{
    Vector<Mail> filteredSenders = new Vector<>();
        @Override
        public Vector<Mail> meetCriteria (Vector<Mail> mails ,  String  sender){
       
                for(Mail mail : mails){            
                    if(mail.getSender().equalsIgnoreCase(sender)){
                        filteredSenders.add(mail);
                    }
           }     
                        return filteredSenders;
    }
}
