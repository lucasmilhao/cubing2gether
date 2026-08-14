package com.example.teste.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "denuncia")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Denuncia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_postagem", nullable = true)
    private Postagem postagem;

    @Column(name = "created_at")
    private Instant createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }

    public Denuncia(Usuario usuario, Postagem postagem) {
        this.usuario = usuario;
        this.postagem = postagem;
    }
}
