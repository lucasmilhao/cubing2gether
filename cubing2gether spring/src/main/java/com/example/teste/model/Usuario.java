package com.example.teste.model;

import com.example.teste.dto.usuario.UsuarioRequestDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    private String senha;

    @Column(name="foto_perfil")
    private String fotoPerfil;
    
    public Usuario(UsuarioRequestDTO data) {
        this.nome = data.nome();
        this.email = data.email();
        this.senha = data.senha();
        this.fotoPerfil = data.fotoPerfil();
    }

}