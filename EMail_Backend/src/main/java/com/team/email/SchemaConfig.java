package com.team.email;

import java.io.File;
import java.net.URL;

public class SchemaConfig {
    public static final String SCHEMA_PATH;

    static {
        URL resource = SchemaConfig.class.getClassLoader().getResource("Schema.json");
        if (resource != null) {
            SCHEMA_PATH = new File(resource.getFile()).getAbsolutePath();
        } else {
            throw new RuntimeException("Schema.json file not found in the resources folder");
        }
    }
}

