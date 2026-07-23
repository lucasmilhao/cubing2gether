package com.example.teste.model;

import java.util.ArrayList;
import java.util.List;

import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="usuario")
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(name="id_usuario")
    private String id;

    private String nome;

    private String email;

    private String tipo;

    private Boolean isGuest;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<Credential> credentials = new ArrayList<>();

    @Column(name="foto_perfil")
    private String picture = "http:localhost:8080/uploads/1783392569974_default.webp";
    
    public Usuario(UsuarioRequestDTO data) {
        this.nome = data.nome();
        this.email = data.email();
        this.tipo = data.tipo();
        this.isGuest = data.isGuest();
    }

}