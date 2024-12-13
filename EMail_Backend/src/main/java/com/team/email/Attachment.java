package com.team.email;

public class Attachment {
    String name;
    String type;
    byte[] file;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getFile() {
        return this.file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
}
