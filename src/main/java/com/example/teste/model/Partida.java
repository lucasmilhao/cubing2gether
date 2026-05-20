package com.example.teste.model;

import java.time.Instant;
import java.util.List;

import com.example.teste.dto.partida.PartidaRequestDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

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


@Entity
@Table(name = "partida")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_partida")
    private String idPartida;

    private Long duracao; //segundos
    
    @JsonIgnore
    @OneToMany(mappedBy = "partida")
    private List<PartidaUsuario> jogadores;

    private Instant data;

    @PrePersist
    public void prePersist() {
        this.data = Instant.now();
    }
}
