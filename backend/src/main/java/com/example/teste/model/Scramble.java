package com.example.teste.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "scramble")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Scramble {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "scramble", nullable = true)
    private String scramble;

    private String solution;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String svg;
}
