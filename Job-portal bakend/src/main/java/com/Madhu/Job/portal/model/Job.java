package com.Madhu.Job.portal.model;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "jobs")
@Setter
@Getter
@NoArgsConstructor

public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Integer id;

     String title;
     String company;
     String location;

    @Column(length = 2000)
     String description;

     Double salary;
     String jobType;
     LocalDate postedDate;

   
}