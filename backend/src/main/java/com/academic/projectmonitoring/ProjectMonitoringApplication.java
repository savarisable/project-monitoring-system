package com.academic.projectmonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProjectMonitoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectMonitoringApplication.class, args);
    }
}
