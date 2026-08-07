package com.example.teste.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "conversa")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Conversa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_conversa")
    private String idConversa;

    private String nome;

    @Column(name = "data_criado")
    private Instant dataCriado;

    @OneToMany(mappedBy = "conversa")
    private List<ParticipantesConversa> participantes = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.dataCriado = Instant.now();
    }

    public Conversa(ConversaRequestDTO requestDTO) {
        this.nome = requestDTO.nome();
    }
}
