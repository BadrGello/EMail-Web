package com.team.email;

import java.util.Vector;

public interface Criteria {
    public Vector<Mail> meetCriteria (Vector<Mail> mails , Vector<String>  SenderSubject);
    
}
