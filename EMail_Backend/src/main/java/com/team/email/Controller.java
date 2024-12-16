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
    public ResponseEntity<String> sendEmail(@RequestParam String userName,@RequestParam MultipartFile[] files,@RequestParam Vector<String> recipients,@RequestParam String subject ,@RequestParam int priority ,@RequestParam String body,@RequestParam String date) throws IOException{
        Vector<Attachment> attachments = new Vector<>();
        if (files != null) {
            for (int i = 0; i < files.length; i++) {
                Attachment attachment = new Attachment();
                attachment.setName(files[i].getOriginalFilename());
                attachment.setType(files[i].getContentType());
                attachment.setFile(files[i].getBytes());
                attachments.add(attachment);
            }
        }
        try {
            appProxy.loadUser(userName);
            appProxy.sendMail(attachments, recipients, subject, priority, body, date);
            return ResponseEntity.status(HttpStatus.OK).body("contact added successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding contact: " + e.getMessage());
        }
    }

    @GetMapping("/getEmails")
    @ResponseBody
    public ResponseEntity<Vector<Mail>> getFolder(@RequestParam String userName,@RequestParam String folderName,@RequestParam String sortType,@RequestParam String sortOrder,@RequestParam String filterType,@RequestParam String filterText){
        System.out.println("fetching mails");
        appProxy.loadUser(userName);
        System.out.println(appProxy.getMailFolders().getSentFolder().get(0).getBody());
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
        if(sortOrder=="Descendingly"){
            appProxy.getUser().getMailFolders().reverseOrder();
        }
        if(filterText!=""){
            Vector<String> text =new Vector<>();
            switch(sortType){
                case "All":
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
    public ResponseEntity<String> delteEmails(@RequestParam String userName,@RequestParam String folderName,@RequestParam String date) {
        try {
            appProxy.loadUser(userName);
            if(folderName.equals("draft")||folderName.equals("trash")){
                appProxy.deleteMail(folderName, date);
            }
            else{
                System.out.println(LocalDate.now().toString());
                appProxy.MoveToTrash(folderName, date,LocalDate.now().toString());
            }
            return ResponseEntity.status(HttpStatus.OK).body("mail deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting mail: " + e.getMessage());
        }
    }
        
    @PostMapping("/moveEmails")
    @ResponseBody
    public ResponseEntity<String> moveEmails(@RequestParam String userName,@RequestParam String folderName,@RequestParam String date,@RequestParam String newFolderName) {
        try {
            appProxy.loadUser(userName);
            appProxy.moveToFolder(folderName, newFolderName, date);
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
