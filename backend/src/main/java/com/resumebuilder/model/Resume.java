package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfile user;

    @Column(name = "resume_title")
    private String resumeTitle;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters
    public Long getId() { return id; }
    public UserProfile getUser() { return user; }
    public String getResumeTitle() { return resumeTitle; }
    public String getSkills() { return skills; }
    public String getExperience() { return experience; }
    public String getEducation() { return education; }
    public String getProjects() { return projects; }
    public String getCertifications() { return certifications; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(UserProfile user) { this.user = user; }
    public void setResumeTitle(String resumeTitle) { this.resumeTitle = resumeTitle; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setExperience(String experience) { this.experience = experience; }
    public void setEducation(String education) { this.education = education; }
    public void setProjects(String projects) { this.projects = projects; }
    public void setCertifications(String certifications) { this.certifications = certifications; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}