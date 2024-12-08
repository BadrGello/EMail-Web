package com.team.email;

import java.util.Comparator;

    public class sorter {
        
        public Comparator<Mail> SubjectCompare() {
            return new Comparator<Mail>() {
                @Override
                public int compare(Mail a, Mail b) {
                    String as = a.getSubject().toUpperCase();
                    String bs = b.getSubject().toUpperCase();
                    return as.compareTo(bs); // Compare names lexicographically
                }
            };
        }
        public Comparator<Mail> DateCompare() {
            return new Comparator<Mail>() {
                @Override
                public int compare(Mail a, Mail b) {
                    String as = a.getDate().toUpperCase();
                    String bs = b.getDate().toUpperCase();
                    return as.compareTo(bs); // Compare names lexicographically
                }
            };
        }
        public Comparator<Mail> SenderCompare() {
            return new Comparator<Mail>() {
                @Override
                public int compare(Mail a, Mail b) {
                    String as = a.getSender().toUpperCase();
                    String bs = b.getSender().toUpperCase();
                    return as.compareTo(bs); // Compare names lexicographically
                }
            };
        }
        public Comparator<Mail> BodyCompare() {
            return new Comparator<Mail>() {
                @Override
                public int compare(Mail a, Mail b) {
                    String as = a.getBody().toUpperCase();
                    String bs = b.getBody().toUpperCase();
                    return as.compareTo(bs); // Compare names lexicographically
                }
            };
        }

        public Comparator<Mail> ImportanceCompare() {
            return new Comparator<Mail>() {
                @Override
                public int compare(Mail a, Mail b) {
                    int as = a.getPriority();
                    int bs = b.getPriority();
                    return as-bs; // Compare names lexicographically
                }
            };
        }

}
