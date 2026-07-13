package com.example.teste.model;

import com.example.teste.dto.partida.PartidaUsuarioRequestDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "partida_usuario")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartidaUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_partida_usuario")
    private String idPartidaUsuario;

    @ManyToOne
    @JoinColumn(name = "id_partida")
    private Partida partida;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
 
    private Long media; //milissegundos

    public PartidaUsuario(PartidaUsuarioRequestDTO request) {
        this.partida = request.partida();
        this.usuario = request.usuario();
        this.media = request.media();
    }
}
