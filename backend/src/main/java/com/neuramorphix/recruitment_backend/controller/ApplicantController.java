package com.neuramorphix.recruitment_backend.controller;

import com.neuramorphix.recruitment_backend.entity.ApplicantEntity;
import com.neuramorphix.recruitment_backend.repository.ApplicantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "*")
public class ApplicantController {

    private final ApplicantRepository applicantRepository;

    public ApplicantController(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    @GetMapping
    public List<ApplicantEntity> getAllApplicants() {
        return applicantRepository.findAll();
    }

    @GetMapping("/{appId}")
    public ResponseEntity<ApplicantEntity> getApplicantById(@PathVariable String appId) {
        Optional<ApplicantEntity> applicant = applicantRepository.findByApplicationId(appId);
        return applicant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApplicantEntity> createApplicant(@RequestBody ApplicantEntity applicant) {
        if (applicant.getCreatedAt() == null) {
            applicant.setCreatedAt(LocalDateTime.now());
        }
        applicant.setUpdatedAt(LocalDateTime.now());
        ApplicantEntity saved = applicantRepository.save(applicant);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{appId}/status")
    public ResponseEntity<ApplicantEntity> updateStatus(
            @PathVariable String appId,
            @RequestBody ApplicantEntity updates) {
        Optional<ApplicantEntity> existingOpt = applicantRepository.findByApplicationId(appId);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ApplicantEntity existing = existingOpt.get();
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getFinalAssignedTeam() != null) existing.setFinalAssignedTeam(updates.getFinalAssignedTeam());
        if (updates.getDeclineReason() != null) existing.setDeclineReason(updates.getDeclineReason());
        if (updates.getRequestedInfoQuestion() != null) existing.setRequestedInfoQuestion(updates.getRequestedInfoQuestion());
        if (updates.getRequestedInfoResponse() != null) existing.setRequestedInfoResponse(updates.getRequestedInfoResponse());
        if (updates.getInterviewDetails() != null) existing.setInterviewDetails(updates.getInterviewDetails());
        existing.setUpdatedAt(LocalDateTime.now());

        ApplicantEntity saved = applicantRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
