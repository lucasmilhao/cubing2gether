package com.example.teste.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "postagem")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Postagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_scramble", nullable = true)
    private Scramble scramble;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    private Instant createdAt;
    
    @PrePersist
    public void PrePersist() {
        this.createdAt = Instant.now();
    }
}
