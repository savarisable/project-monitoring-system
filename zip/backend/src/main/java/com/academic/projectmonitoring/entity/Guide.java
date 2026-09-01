package com.academic.projectmonitoring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guides")
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(length = 200)
    private String specialization;

    @Column(name = "max_groups_capacity", nullable = false)
    private int maxGroupsCapacity = 5;

    public Guide() {}

    public Guide(User user, String department, String designation, String specialization, int maxGroupsCapacity) {
        this.user = user;
        this.department = department;
        this.designation = designation;
        this.specialization = specialization;
        this.maxGroupsCapacity = maxGroupsCapacity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getMaxGroupsCapacity() {
        return maxGroupsCapacity;
    }

    public void setMaxGroupsCapacity(int maxGroupsCapacity) {
        this.maxGroupsCapacity = maxGroupsCapacity;
    }
}
