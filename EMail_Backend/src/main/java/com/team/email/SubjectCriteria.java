package com.team.email;

import java.util.Vector;

public class SubjectCriteria implements Criteria{
    Vector<Mail> filteredSubjects = new Vector<>();
        @Override
        public Vector<Mail> meetCriteria (Vector<Mail> mails ,  String  subject){
 
                for(Mail mail : mails){        
                    if(mail.getSubject().equalsIgnoreCase(subject)){
                        filteredSubjects.add(mail);
                    }
           }
                    return filteredSubjects;
    }
}
