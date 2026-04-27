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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "participantes_conversa")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ParticipantesConversa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "id_conversa")
    private Conversa conversa;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    private Instant entrou;
    
    @PrePersist
    public void prePersist() {
        this.entrou = Instant.now();
    }
}
