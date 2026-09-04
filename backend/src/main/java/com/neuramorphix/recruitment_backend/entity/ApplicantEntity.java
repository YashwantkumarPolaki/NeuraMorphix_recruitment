package com.neuramorphix.recruitment_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applicants")
public class ApplicantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", unique = true, nullable = false)
    private String applicationId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String college;
    private String department;

    @Column(name = "year_of_study")
    private String yearOfStudy;

    @Column(name = "first_preference", nullable = false)
    private String firstPreference;

    @Column(name = "second_preference")
    private String secondPreference;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "experience_summary", columnDefinition = "TEXT")
    private String experienceSummary;

    @Column(name = "why_join", columnDefinition = "TEXT")
    private String whyJoin;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(nullable = false)
    private String status = "Applied";

    @Column(name = "final_assigned_team")
    private String finalAssignedTeam;

    @Column(name = "decline_reason")
    private String declineReason;

    @Column(name = "requested_info_question", columnDefinition = "TEXT")
    private String requestedInfoQuestion;

    @Column(name = "requested_info_response", columnDefinition = "TEXT")
    private String requestedInfoResponse;

    @Column(name = "interview_details", columnDefinition = "TEXT")
    private String interviewDetails;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ApplicantEntity() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplicationId() { return applicationId; }
    public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getFirstPreference() { return firstPreference; }
    public void setFirstPreference(String firstPreference) { this.firstPreference = firstPreference; }

    public String getSecondPreference() { return secondPreference; }
    public void setSecondPreference(String secondPreference) { this.secondPreference = secondPreference; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperienceSummary() { return experienceSummary; }
    public void setExperienceSummary(String experienceSummary) { this.experienceSummary = experienceSummary; }

    public String getWhyJoin() { return whyJoin; }
    public void setWhyJoin(String whyJoin) { this.whyJoin = whyJoin; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFinalAssignedTeam() { return finalAssignedTeam; }
    public void setFinalAssignedTeam(String finalAssignedTeam) { this.finalAssignedTeam = finalAssignedTeam; }

    public String getDeclineReason() { return declineReason; }
    public void setDeclineReason(String declineReason) { this.declineReason = declineReason; }

    public String getRequestedInfoQuestion() { return requestedInfoQuestion; }
    public void setRequestedInfoQuestion(String requestedInfoQuestion) { this.requestedInfoQuestion = requestedInfoQuestion; }

    public String getRequestedInfoResponse() { return requestedInfoResponse; }
    public void setRequestedInfoResponse(String requestedInfoResponse) { this.requestedInfoResponse = requestedInfoResponse; }

    public String getInterviewDetails() { return interviewDetails; }
    public void setInterviewDetails(String interviewDetails) { this.interviewDetails = interviewDetails; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
