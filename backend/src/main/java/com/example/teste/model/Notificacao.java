package com.example.teste.model;

import java.time.Instant;

import com.example.teste.type.TypeNotificacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "notificacao")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Notificacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_remetente", nullable = false)
    private Usuario remetente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotificacao tipo;
    
    @Column(nullable = false)
    private String mensagem;
    
    @Column(name = "is_lida", nullable = false)
    private Boolean isLida = false;
    
    @Column(nullable = false)
    private Instant createdAt;
    
    @Column(nullable = false)
    private String referenciaId;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}
