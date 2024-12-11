package com.team.email;

import java.util.Vector;

public class SubjectCriteria implements Criteria{
    Vector<Mail> filteredSubjects = new Vector<>();
        @Override
        public Vector<Mail> meetCriteria (Vector<Mail> mails ,  Vector<String>  subjects){
            for(int i = 0 ; i < subjects.size() ; i++){
                String subject = subjects.get(i);
                for(Mail mail : mails){            
                    if(mail.getSender().equalsIgnoreCase(subject)){
                        filteredSubjects.add(mail);
                    }
           }
           
        }
        return filteredSubjects;
    }
}
