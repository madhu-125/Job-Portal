package com.Madhu.Job.portal.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Madhu.Job.portal.model.Job;
@Repository
public interface JobRepo extends JpaRepository<Job, Integer>{

}
