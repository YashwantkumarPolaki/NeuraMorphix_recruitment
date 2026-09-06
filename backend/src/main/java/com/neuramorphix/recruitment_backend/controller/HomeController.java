package com.neuramorphix.recruitment_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "name", "NeuraMorphix Recruitment Backend API",
            "status", "UP",
            "frontendUrl", "http://localhost:5173",
            "message", "Backend REST API is running. Access the frontend application at http://localhost:5173"
        );
    }
}
