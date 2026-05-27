package com.resumebuilder.controller;

import com.resumebuilder.model.Resume;
import com.resumebuilder.model.UserProfile;
import com.resumebuilder.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    // ── USER PROFILE ENDPOINTS ────────────────────────

    @PostMapping("/users")
    public ResponseEntity<UserProfile> createUser(
            @Valid @RequestBody UserProfile user) {
        return new ResponseEntity<>(
            resumeService.createUser(user),
            HttpStatus.CREATED);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfile> getUser(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            resumeService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserProfile> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserProfile user) {
        return ResponseEntity.ok(
            resumeService.updateUser(id, user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {
        resumeService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ── RESUME ENDPOINTS ──────────────────────────────

    @PostMapping("/users/{userId}/resumes")
    public ResponseEntity<Resume> createResume(
            @PathVariable Long userId,
            @RequestBody Resume resume) {
        return new ResponseEntity<>(
            resumeService.createResume(userId, resume),
            HttpStatus.CREATED);
    }

    @GetMapping("/users/{userId}/resumes")
    public ResponseEntity<List<Resume>> getUserResumes(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
            resumeService.getResumesByUser(userId));
    }

    @GetMapping("/resumes/{id}")
    public ResponseEntity<Resume> getResume(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            resumeService.getResumeById(id));
    }

    @PutMapping("/resumes/{id}")
    public ResponseEntity<Resume> updateResume(
            @PathVariable Long id,
            @RequestBody Resume resume) {
        return ResponseEntity.ok(
            resumeService.updateResume(id, resume));
    }

    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}