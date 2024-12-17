package com.team.email;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Vector;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@CrossOrigin(origins ="http://localhost:5173")
@RequestMapping("/api")

public class Controller {
    proxy appProxy=proxy.getInstance();


    @PostMapping("/sendEmail")
    @ResponseBody
    public ResponseEntity<String> sendEmail(@RequestParam String userName,@RequestParam(required = false) MultipartFile[] files,@RequestParam String recipients,@RequestParam String subject ,@RequestParam String priority ,@RequestParam String body,@RequestParam String date) throws IOException{
        System.out.println("entered");
        System.out.print(priority);
        int intpriority=0;
        switch (priority) {
            case "Low":
                intpriority=4;    
                break;
            case "Normal":
                intpriority=3;
                break;  
            case "High":
                intpriority=2;
                break;  
            case "Urgent":
                intpriority=1;
                break;      
            default:
                throw new AssertionError();
        }
        String[] emailsArray = recipients.split(",");
        Vector<String> emailVector = new Vector<>();
        for (String email : emailsArray) {
            emailVector.add(email);
        }
        Vector<Attachment> attachments = new Vector<>();
        if(files == null) System.out.println("null files");
        if (files != null && files.length >0) {
            for (int i = 0; i < files.length; i++) {
                Attachment attachment = new Attachment();
                attachment.setName(files[i].getOriginalFilename());
                System.out.println(files[i].getOriginalFilename());
                attachment.setType(files[i].getContentType());
                attachment.setFile(files[i].getBytes());
                attachments.add(attachment);
                System.out.println((files[i].getSize()));
            }
        }
        try {
            appProxy.loadUser(userName);
            appProxy.sendMail(attachments, emailVector, subject, intpriority, body, date);
            return ResponseEntity.status(HttpStatus.OK).body("contact added successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding contact: " + e.getMessage());
        }
    }

    @PostMapping("/sendDraft")
    @ResponseBody
    public ResponseEntity<String> sendDraft(@RequestParam(required = false) String userName,@RequestParam(required = false) MultipartFile[] files,@RequestParam(required = false) String recipients,@RequestParam(required = false) String subject ,@RequestParam(required = false) String priority ,@RequestParam(required = false) String body,@RequestParam(required = false) String date) throws IOException{
        System.out.println("enter");
        System.out.println(priority);
        int intpriority=0;
        switch (priority) {
            case "Low":
                intpriority=4;    
                break;
            case "Normal":
                intpriority=3;
                break;  
            case "High":
                intpriority=2;
                break;  
            case "Urgent":
                intpriority=1;
                break;      
            default:
                throw new AssertionError();
        }
        System.out.println("priority done");
        Vector<String> emailVector = new Vector<>();
        if(recipients!=null){
        String[] emailsArray = recipients.split(",");
        for (String email : emailsArray) {
            emailVector.add(email);
        }
        }
        System.out.println("email vector done");
        Vector<Attachment> attachments = new Vector<>();
        if(files == null) System.out.println("null files");
        if (files != null && files.length >0) {
            for (int i = 0; i < files.length; i++) {
                Attachment attachment = new Attachment();
                attachment.setName(files[i].getOriginalFilename());
                System.out.println(files[i].getOriginalFilename());
                attachment.setType(files[i].getContentType());
                attachment.setFile(files[i].getBytes());
                attachments.add(attachment);
                System.out.println((files[i].getSize()));
            }
        }
        if(body==null){
            body="";
            System.out.println("null body");
        }
        if(subject==null){
            subject="";
            System.out.println("null subject");
        }
        try {
            appProxy.loadUser(userName);
            System.out.println(userName);
            appProxy.makeDraft(attachments, userName, emailVector, subject, intpriority, body, date);
            return ResponseEntity.status(HttpStatus.OK).body("contact added successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding contact: " + e.getMessage());
        }
    }

    @GetMapping("/getEmails")
    @ResponseBody
    public ResponseEntity<Vector<Mail>> getFolder(@RequestParam String userName,@RequestParam String folderName,@RequestParam String sortType,@RequestParam String sortOrder,@RequestParam String filterType,@RequestParam String filterText){
        System.out.println("fetching mails "+folderName);
        appProxy.loadUser(userName);
        System.out.println("load done");
        switch(sortType){
            case "Date":
                appProxy.getUser().getMailFolders().sortByDate(folderName);
                break;
            case "Priority":
                appProxy.getUser().getMailFolders().sortByImportance(folderName);
                break;
            case "Sender":
                appProxy.getUser().getMailFolders().sortBySender(folderName);
                break;
            case "Subject":
                appProxy.getUser().getMailFolders().sortBySubject(folderName);
                break;
            case "Body":
                appProxy.getUser().getMailFolders().sortByBody(folderName);
                break;
        }
        System.out.println("sort done");
        if(sortOrder.equals("Descendingly")){
            appProxy.getUser().getMailFolders().reverseOrder();
        }
        if(!filterText.equals("")){
            System.out.println(filterType);
            Vector<String> text =new Vector<>();
            switch(filterType){
                case "All":
                    System.out.println("searching in all");
                    return ResponseEntity.ok( appProxy.getUser().getMailFolders().searchByAll(filterText, folderName));
                    
                case "Subject":
                    return ResponseEntity.ok(appProxy.getUser().getMailFolders().filterBySubject( appProxy.getUser().getMailFolders().getSortedMail(), filterText));
                    
                case "Sender":
                    return ResponseEntity.ok(appProxy.getUser().getMailFolders().filterBySender( appProxy.getUser().getMailFolders().getSortedMail(), filterText));
                          
            }
        }
        else{
            return ResponseEntity.ok( appProxy.getUser().getMailFolders().getSortedMail());
        }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new Vector<>());
    }

    @PostMapping("/deleteEmails")
    @ResponseBody
    public ResponseEntity<String> delteEmails(@RequestParam String userName,@RequestParam String folderName,@RequestParam String[] dates) {
        System.out.println("delete "+dates.length);
        System.out.println("thisssssssssssssssssssssssssssssssssssssss");
        try {
            appProxy.loadUser(userName);
            for(String date:dates){
                System.out.println("number of times");
            if(folderName.equals("draft")||folderName.equals("trash")){
                System.out.println("trash");
                appProxy.deleteMail(folderName, date);
            }
            else{
                System.out.println(LocalDate.now().toString());
                appProxy.MoveToTrash(folderName, date,LocalDate.now().toString());
            }
        }
            return ResponseEntity.status(HttpStatus.OK).body("mail deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting mail: " + e.getMessage());
        }
    }
        
    @PostMapping("/moveEmails")
    @ResponseBody
    public ResponseEntity<String> moveEmails(@RequestParam String userName,@RequestParam String folderName,@RequestParam String[] dates,@RequestParam String newFolderName) {
        try {
            appProxy.loadUser(userName);
            for(String date:dates)
            appProxy.moveToFolder(folderName, newFolderName, date);
            return ResponseEntity.status(HttpStatus.OK).body("mail moved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error moving mail: " + e.getMessage());
        }
    }

    @PostMapping("/moveEmailsFromTrash")
    @ResponseBody
    public ResponseEntity<String> returnEmailsFromTrash(@RequestParam String userName,@RequestParam String folderName,@RequestParam String[] dates) {
        try {
            appProxy.loadUser(userName);
            for(String date:dates)
            appProxy.returnFromTrash(date);
            return ResponseEntity.status(HttpStatus.OK).body("mail moved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error moving mail: " + e.getMessage());
        }
    }

///////////////////////////////////contacts methods///////////////////////////////////////////////////////////////////////////////////

    @GetMapping("/contacts")
    @ResponseBody
    public ResponseEntity<Vector<Contact>> getContacts(@RequestParam String userName,@RequestParam String sortType,@RequestParam String sortOrder,@RequestParam String filterType,
    @RequestParam String filterText) {
        System.out.println("user:"+userName+"filter:"+sortType);
        try {
            appProxy.loadUser(userName);
            switch (sortType) {
                case "Name":
                    appProxy.getContacts().SortContacts();
                    break;
                
                case "Number of emails":
                    appProxy.getContacts().SortContactsByNumberOfEmails();
                    break;
            }
            if("Descendingly".equals(sortOrder)){
                appProxy.getContacts().reverseOrder();
            } 
            if (filterText.equals("")){
                System.out.println("not filtering");
                return ResponseEntity.ok(this.appProxy.getContacts().getSortedContacts());
            }

                switch(filterType){
                    case "Name":
                        return ResponseEntity.ok(appProxy.getContacts().SearchContactsByName(filterText));
                    case "Email":
                        return ResponseEntity.ok(appProxy.getContacts().SearchContactsByEMail(filterText));
                    case "All":
                        return ResponseEntity.ok(appProxy.getContacts().SearchContactsByAll(filterText));
                }
                return ResponseEntity.ok(this.appProxy.getContacts().getSortedContacts());
            
        } catch (Exception e) {
            // Log the error using a logging framework
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Vector<>()); // Return an empty vector
        }
    }

    @PostMapping("/contacts/add")
    @ResponseBody
    public ResponseEntity<String> addContact(@RequestParam String userName,@RequestParam String contactName ,@RequestParam String contactID,@RequestParam String contactEmails){
        System.out.println(contactID);
        String[] emailsArray = contactEmails.split(",");
        Vector<String> emailVector = new Vector<>();
        for (String email : emailsArray) {
            emailVector.add(email);
        }
        System.out.println(emailVector.get(0));
        try {
            appProxy.loadUser(userName);
            appProxy.addContact(contactID, contactName, emailVector);
            return ResponseEntity.status(HttpStatus.OK).body("contact added successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding contact: " + e.getMessage());
        }
    }

    @PostMapping("/contacts/edit")
    @ResponseBody
    public ResponseEntity<String> editContact(@RequestParam String userName,@RequestParam String contactName ,@RequestParam String contactID,@RequestParam String contactEmails){
        System.out.println(contactID);
        String[] emailsArray = contactEmails.split(",");
        Vector<String> emailVector = new Vector<>();
        for (String email : emailsArray) {
            emailVector.add(email);
        }
        System.out.println(emailVector.get(0));
        try {
            appProxy.loadUser(userName);
            appProxy.editContact(contactID, contactName, emailVector);
            return ResponseEntity.status(HttpStatus.OK).body("contact added successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding contact: " + e.getMessage());
        }
    }

    @PostMapping("/contacts/delete")
    @ResponseBody
    public ResponseEntity<String> deletecontact(@RequestParam String userName,@RequestParam String contactID){
        try {
            appProxy.loadUser(userName);
            System.out.println(contactID);
            appProxy.deletecontact(contactID);
            return ResponseEntity.status(HttpStatus.OK).body("contact added successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding contact: " + e.getMessage());
        }
    }

    @GetMapping("/contacts/getContactMails")
    @ResponseBody
    public ResponseEntity<Vector<Mail>> getContactMails(@RequestParam String userName,@RequestParam String folderName,@RequestParam String sortType,@RequestParam String sortOrder,@RequestParam String filterType,@RequestParam String filterText){
        appProxy.loadUser(userName);
        Contact thisContact=appProxy.getUser().getContacts().returnThisContact(folderName);
        System.out.println("load done");
        switch(sortType){
            case "Date":
                thisContact.sortByDate();
                break;
            case "Priority":
                thisContact.sortByImportance();
                break;
            case "Sender":
                thisContact.sortBySender();
                break;
            case "Subject":
                thisContact.sortBySubject();
                break;
            case "Body":
                thisContact.sortByBody();
                break;
        }
        System.out.println("sort done");
        if(sortOrder.equals("Descendingly")){
            appProxy.getUser().getMailFolders().reverseOrder();
        }
        if(!filterText.equals("")){
            System.out.println(filterType);
            Vector<String> text =new Vector<>();
            switch(filterType){
                case "All":
                    System.out.println("searching in all");
                    return ResponseEntity.ok( thisContact.searchByAll(filterText));
                    
                case "Subject":
                    return ResponseEntity.ok(thisContact.filterBySubject( thisContact.getMails(), filterText));
                    
                case "Sender":
                    return ResponseEntity.ok(thisContact.filterBySender( thisContact.getMails(), filterText));
                          
            }
        }
        else{
            return ResponseEntity.ok( thisContact.getMails());
        }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new Vector<>());
    }


//////////////////folders methods///////////////////////////////////////////////////////////////

    @GetMapping("/folders")
    @ResponseBody
    public ResponseEntity<Set<String>> getFoldersNames(@RequestParam String userName) {
        try {
            appProxy.loadUser(userName);
            Set<String> folderNames = appProxy.getFolderNames();
            return ResponseEntity.ok(folderNames);
        } catch (Exception e) {
            // Log the error using a logging framework
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashSet<>()); // Return an empty vector
        }
    }
    

    @PostMapping("/folders/delete")
    @ResponseBody
    public ResponseEntity<String> deleteFolder(@RequestParam String userName,@RequestParam String folderName){
        System.out.print(folderName);
        try {
        appProxy.loadUser(userName);
        appProxy.deleteUserFolder(folderName);
        return ResponseEntity.status(HttpStatus.OK).body("Folder deleted successfully");
        } catch (Exception e) {
            System.out.print(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting folder: " + e.getMessage());
        }
    }

    @PostMapping("/folders/add")
    @ResponseBody
    public ResponseEntity<String> addFolder(@RequestParam String userName,@RequestParam String folderName){
        try {
            System.out.println("Adding folder for user: " + userName + ", folder: " + folderName);
            appProxy.loadUser(userName);
            appProxy.addUserFolder(folderName);
            return ResponseEntity.status(HttpStatus.OK).body("Folder added successfully");
        } catch (Exception e) {
            // Log the stack trace of the exception
            System.out.print(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding folder: " + e.getMessage());
        }
    }

    @PostMapping("/folders/edit")
    @ResponseBody
    public ResponseEntity<String> editFolder(@RequestParam String userName,@RequestParam String folderName,@RequestParam String newFolderName){
        try {
        appProxy.loadUser(userName);
        appProxy.renameUserFolder(folderName, newFolderName);
        return ResponseEntity.status(HttpStatus.OK).body("Folder added successfully");
        }
        catch (Exception e) {
            // Log the stack trace of the exception
            System.out.print(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding folder: " + e.getMessage());
        }
    }

////////////////////////// login and signup ////////////////////////////////////////////

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Boolean> login(@RequestParam String email,@RequestParam String password){
        try { 
            if(appProxy.getAccess(email, password)){
                return ResponseEntity.status(HttpStatus.OK).body(true);
            }
            else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        
        }
        catch (Exception e) {
            // Log the stack trace of the exception
            System.out.print(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<String> signUp(@RequestParam String email,@RequestParam String password){
        try { 
            System.out.println(email);
            appProxy.makeAccount(email, password);
            return ResponseEntity.status(HttpStatus.OK).body("Folder added successfully");
        
        }
        catch (Exception e) {
            // Log the stack trace of the exception
            System.out.print(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding folder: " + e.getMessage());
        }
    }
}
