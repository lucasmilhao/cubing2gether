package com.example.teste.model;

import com.example.teste.dto.solve.SolveRequestDTO;

import jakarta.annotation.Nullable;
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

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name="solve")
@Entity
public class Solve {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_solve", nullable=false)
    private Long id;
    
    @Column(name="tempo_ms", nullable=false)
    private Long tempo;

    private String scramble;

    private String penalty;

    @ManyToOne
    @JoinColumn(name="id_usuario", nullable=false)
    private Usuario user;

}
