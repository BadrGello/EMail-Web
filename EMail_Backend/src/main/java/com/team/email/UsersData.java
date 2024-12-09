package com.team.email;

import java.util.Vector;

public class UsersData {
    public  Vector<String> UserNames;
    public  Vector<String> passwords;

    // Public no-argument constructor (needed for Jackson)
    public UsersData() {
        this.UserNames = new Vector<>();
        this.passwords = new Vector<>();
    }

    // Parameterized constructor (optional for manual initialization)
    public UsersData(Vector<String> UserNames, Vector<String> passwords) {
        this.UserNames = UserNames;
        this.passwords = passwords;
    }

    // Getters and Setters
    public Vector<String> getUserNames() {
        return this.UserNames;
    }

    public void setUserNames(Vector<String> userNames) {
        this.UserNames = userNames;
    }

    public Vector<String> getPasswords() {
        return this.passwords;
    }

    public void setPasswords(Vector<String> passwords) {
        this.passwords = passwords;
    }
}
