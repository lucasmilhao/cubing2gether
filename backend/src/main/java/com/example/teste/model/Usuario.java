package com.example.teste.model;

import java.util.ArrayList;
import java.util.List;

import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.type.TypeUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Column(name = "username", unique = true, nullable = false, length = 30)
    private String username;

    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TypeUsuario tipo;

    private Boolean isGuest;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<Credential> credentials = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<MarcacaoPostagem> marcacoes = new ArrayList<>();

    @Column(name="foto_perfil")
    private String picture = "https://res.cloudinary.com/t8awtqrh/image/upload/v1789515124/cubing2gether/a2lryysfrhrpwtzapnfz.webp";
    
    public Usuario(UsuarioRequestDTO data) {
        this.nome = data.nome();
        this.email = data.email();
        this.username = normalizarUsername(data.username(), data.nome());
        this.tipo = data.tipo();
        this.isGuest = data.isGuest();

        if (data.picture() != null && !data.picture().isBlank()) {
            this.picture = data.picture();
        }
    }

    public static String normalizarUsername(String username, String nome) {
        String valor = username != null && !username.isBlank() ? username : nome;
        String normalizado = valor.trim().replaceAll("[^a-zA-Z0-9_]", "").toLowerCase();

        if (normalizado.isBlank()) {
            return "usuario";
        }

        return normalizado;
    }

}