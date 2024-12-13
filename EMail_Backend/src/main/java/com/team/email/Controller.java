package com.team.email;

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

@RestController
@CrossOrigin(origins ="http://localhost:5173")
@RequestMapping("/api")

public class Controller {
    proxy appProxy=proxy.getInstance();
    
    @GetMapping("/getEmails")
    @ResponseBody
    public ResponseEntity<Vector<Mail>> getFolder(@RequestParam String userName,@RequestParam String folderName,@RequestParam String sortType,@RequestParam String sortOrder,@RequestParam String filterType,@RequestParam String filterText){
        appProxy.loadUser(userName);
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
            System.out.println("first done");
            appProxy.addUserFolder(folderName);
            System.out.println("second done");
            return ResponseEntity.status(HttpStatus.OK).body("Folder added successfully");
        } catch (Exception e) {
            // Log the stack trace of the exception
            System.out.print(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding folder: " + e.getMessage());
        }
    }

    @GetMapping("/folders/edit")
    @ResponseBody
    public void editFolder(@RequestParam String userName,@RequestParam String folderName,@RequestParam String newFolderName){
        appProxy.loadUser(userName);
        appProxy.renameUserFolder(folderName, newFolderName);
    }
}
