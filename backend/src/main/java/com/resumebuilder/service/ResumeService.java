package com.resumebuilder.service;

import com.resumebuilder.model.Resume;
import com.resumebuilder.model.UserProfile;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserProfileRepository userRepository;

    // ── USER PROFILE METHODS ──────────────────

    public UserProfile createUser(UserProfile user) {
        return userRepository.save(user);
    }

    public UserProfile getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("User not found: " + id));
    }

    public UserProfile updateUser(Long id, UserProfile updated) {
        UserProfile existing = getUserById(id);
        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setLocation(updated.getLocation());
        existing.setLinkedinUrl(updated.getLinkedinUrl());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setSummary(updated.getSummary());
        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ── RESUME METHODS ────────────────────────

    public Resume createResume(Long userId, Resume resume) {
        UserProfile user = getUserById(userId);
        resume.setUser(user);
        return resumeRepository.save(resume);
    }

    public List<Resume> getResumesByUser(Long userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Resume not found: " + id));
    }

    public Resume updateResume(Long id, Resume updated) {
        Resume existing = getResumeById(id);
        existing.setResumeTitle(updated.getResumeTitle());
        existing.setSkills(updated.getSkills());
        existing.setExperience(updated.getExperience());
        existing.setEducation(updated.getEducation());
        existing.setProjects(updated.getProjects());
        existing.setCertifications(updated.getCertifications());
        existing.setUpdatedAt(LocalDateTime.now());
        return resumeRepository.save(existing);
    }

    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }
}