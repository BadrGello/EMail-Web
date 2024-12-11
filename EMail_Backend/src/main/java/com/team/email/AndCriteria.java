package com.team.email;

import java.util.Vector;

public class AndCriteria {
    SenderCriteria senderCriteria = new SenderCriteria();
    SubjectCriteria subjectCriteria = new SubjectCriteria();

    public Vector<Mail> meetCriteria(Vector<Mail> mails,Vector<String> senders,Vector<String>subjects) {
        Vector<Mail> firstMeetedCritera = senderCriteria.meetCriteria(mails, senders);
        return subjectCriteria.meetCriteria(firstMeetedCritera, subjects); 
    }
    
}
