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

@Table(name = "mensagem")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Mensagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_mensagem")
    private String idMensagem;

    private String texto;

    @ManyToOne
    @JoinColumn(name = "id_sender")
    private Usuario sender;
    
    @ManyToOne
    @JoinColumn(name = "id_conversa")
    private Conversa conversa;

    private Instant mandado;

    private Boolean isVisto = false;

    @PrePersist
    public void prePersist() {
        this.mandado = Instant.now();
    }

}
