package com.Madhu.Job.portal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Madhu.Job.portal.Repo.JobRepo;
import com.Madhu.Job.portal.model.Job;
@CrossOrigin(origins = "${FRONTEND_ORIGIN:http://localhost:5173}")
@RestController
@RequestMapping("/jobs")
public class JobController {

	@Autowired
    JobRepo jobRepository;

    public JobController(JobRepo jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping("/getall")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("job/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Integer id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/insert")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        job.setId(null);
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Integer id,
            @RequestBody Job updatedJob) {

        return jobRepository.findById(id)
                .map(existingJob -> {
                		existingJob.setJobType(updatedJob.getJobType());
                    existingJob.setTitle(updatedJob.getTitle());
                    existingJob.setCompany(updatedJob.getCompany());
                    existingJob.setLocation(updatedJob.getLocation());
                    existingJob.setDescription(updatedJob.getDescription());
                    existingJob.setSalary(updatedJob.getSalary());
                    existingJob.setJobType(updatedJob.getJobType());

                    return ResponseEntity.ok(jobRepository.save(existingJob));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Integer id) {
        if (!jobRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}