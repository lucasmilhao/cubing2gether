import {
    Users,
    Trophy,
    Timer,
    Video,
    MessageCircle,
    Shuffle,
    Heart,
    Code2,
    Target,
} from "lucide-react";

import "./sobre.css";
import type { ScatteredPiece } from "../erro/NotFoundPage";

export function Sobre() {

    const FACE_COLORS = [
        "#e63946",
        "#ffe14d",
        "#2ecc71",
        "#ffffff",
        "#2f80ed",
        "#f28c28",
    ];

    const SCATTERED_PIECES: ScatteredPiece[] = [
  // ──────── TOPO ────────
  { top: "4%", left: "68%", rot: -18, size: 30 },
  { top: "14%", left: "86%", rot: 30, size: 26 },
  { top: "6%", left: "48%", rot: -8, size: 20 },
  { top: "26%", left: "15%", rot: 15, size: 38 },
  { top: "28%", left: "77%", rot: -25, size: 24 },

  // ──────── MEIO 1 ────────
  { top: "38%", left: "5%", rot: 10, size: 31 },
  { top: "42%", left: "94%", rot: -14, size: 29 },
  { top: "48%", left: "18%", rot: 22, size: 25 },
  { top: "52%", left: "82%", rot: -18, size: 21 },
  { top: "55%", left: "45%", rot: 12, size: 24 },

  // ──────── MEIO 2 ────────
  { top: "62%", left: "8%", rot: -28, size: 27 },
  { top: "68%", left: "4%", rot: 24, size: 22 },
  { top: "65%", left: "92%", rot: 18, size: 30 },
  { top: "72%", left: "25%", rot: -12, size: 20 },
  { top: "75%", left: "70%", rot: 25, size: 23 },

  // ──────── PARTE INFERIOR ────────
  { top: "78%", left: "88%", rot: -22, size: 34 },
  { top: "82%", left: "46%", rot: 16, size: 24 },
  { top: "86%", left: "12%", rot: -10, size: 19 },
  { top: "90%", left: "62%", rot: 20, size: 28 },
  { top: "94%", left: "35%", rot: -16, size: 21 },
    ];

    return (
        <main className="sobre-page">

            <div className="scattered-pieces">

                {SCATTERED_PIECES.map((piece, index) => {
                    const color = FACE_COLORS[index % FACE_COLORS.length];

                    return (
                        <span
                            key={index}
                            aria-hidden="true"
                            className="scattered-piece"
                            style={{
                                top: piece.top,
                                left: piece.left,
                                width: piece.size,
                                height: piece.size,
                                background: color,
                                transform: `rotate(${piece.rot}deg)`,
                                border:
                                    color === "#ffffff"
                                        ? "1px solid #3a3d40"
                                        : "none",
                            }}
                        />
                    );
                })}
            </div>

            {/* HERO */}
            <section className="sobre-hero">
                <div className="sobre-hero-content">
                    <span className="sobre-label">SOBRE O CUBING2GETHER</span>

                    <h1>
                        Onde cubers se
                        <span> conectam, competem e evoluem.</span>
                    </h1>

                    <p>
                        O Cubing2Gether é uma rede social criada para aproximar a
                        comunidade de speedcubing, unindo interação social, treino
                        e competição em uma única plataforma.
                    </p>

                    <div className="sobre-hero-actions">
                        <a href="/auth/register" className="sobre-primary-button">
                            Fazer parte da comunidade
                        </a>

                        <a href="/practice" className="sobre-secondary-button">
                            Conhecer o Practice
                        </a>
                    </div>
                </div>

            </section>

            {/* SOBRE */}
            <section className="sobre-section sobre-intro">
                <div className="sobre-section-header">
                    <span className="sobre-label">NOSSA IDEIA</span>
                    <h2>Mais do que uma rede social</h2>
                </div>

                <div className="sobre-intro-grid">
                    <div className="sobre-intro-text">
                        <p>
                            O <strong>Cubing2Gether</strong> nasceu com uma ideia simples:
                            criar um espaço pensado especificamente para quem pratica
                            speedcubing.
                        </p>

                        <p>
                            Em vez de separar comunidade, treino e competição em
                            diferentes plataformas, o projeto reúne essas experiências
                            em um único lugar.
                        </p>

                        <p>
                            Aqui, você pode compartilhar seus resultados, acompanhar
                            outros cubers, conversar, treinar seus tempos e até competir
                            ao vivo por vídeo contra outra pessoa.
                        </p>
                    </div>

                    <div className="sobre-highlight">
                        <Target size={32} />

                        <h3>Nosso objetivo</h3>

                        <p>
                            Tornar o speedcubing mais social, conectado e acessível,
                            criando ferramentas que incentivem os cubers a praticar,
                            compartilhar e evoluir juntos.
                        </p>
                    </div>
                </div>
            </section>

            {/* DIFERENCIAL */}
            <section className="sobre-section sobre-diferencial">
                <div className="sobre-section-header centered">
                    <span className="sobre-label">O DIFERENCIAL</span>

                    <h2>Treine sozinho. Compita com alguém.</h2>

                    <p>
                        O Cubing2Gether transforma uma resolução em uma experiência
                        compartilhada.
                    </p>
                </div>

                <div className="sobre-video-feature">
                    <div className="feature-icon">
                        <Video size={36} />
                    </div>

                    <div>
                        <h3>Partidas ao vivo</h3>

                        <p>
                            Conecte-se com outro cuber através de vídeo e resolvam o
                            mesmo scramble simultaneamente. A partida é sincronizada
                            em tempo real para que os dois participantes possam
                            competir de forma justa.
                        </p>

                        <div className="feature-tags">
                            <span>WebRTC</span>
                            <span>Socket.IO</span>
                            <span>Scramble sincronizado</span>
                            <span>Vídeo em tempo real</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FUNCIONALIDADES */}
            <section className="sobre-section">
                <div className="sobre-section-header">
                    <span className="sobre-label">PLATAFORMA</span>

                    <h2>Tudo que um cuber precisa em um só lugar</h2>
                </div>

                <div className="sobre-features">

                    <Feature
                        icon={<Users />}
                        title="Comunidade"
                        text="Siga outros cubers, encontre novos perfis e acompanhe a evolução da comunidade."
                    />

                    <Feature
                        icon={<Heart />}
                        title="Feed social"
                        text="Publique seus resultados, compartilhe conteúdos, curta e interaja com outras pessoas."
                    />

                    <Feature
                        icon={<MessageCircle />}
                        title="Conversas"
                        text="Converse em particular ou participe de grupos com outros membros da comunidade."
                    />

                    <Feature
                        icon={<Timer />}
                        title="Practice"
                        text="Treine suas resoluções com timer, histórico de solves, penalidades e gráficos de evolução."
                    />

                    <Feature
                        icon={<Shuffle />}
                        title="Scrambles oficiais"
                        text="Gere scrambles seguindo os padrões da WCA para diferentes modalidades."
                    />

                    <Feature
                        icon={<Trophy />}
                        title="Competições"
                        text="Desafie outros cubers em partidas ao vivo através de vídeo e áudio."
                    />

                </div>
            </section>

            {/* COMO NASCEU */}
            <section className="sobre-section sobre-origem">
                <div className="sobre-origem-content">
                    <span className="sobre-label">COMO TUDO COMEÇOU</span>

                    <h2>Um projeto que nasceu do speedcubing</h2>

                    <p>
                        O Cubing2Gether foi desenvolvido como Trabalho de Conclusão
                        de Curso do Técnico em Informática da Fundatec.
                    </p>

                    <p>
                        O projeto surgiu da vontade de unir conhecimentos de
                        desenvolvimento de software com uma comunidade que possui
                        uma cultura própria, seus próprios desafios e uma forte
                        busca por evolução.
                    </p>

                    <p>
                        O resultado é uma aplicação que combina desenvolvimento
                        web, comunicação em tempo real, autenticação, banco de dados,
                        visualização de dados e ferramentas específicas para
                        speedcubing.
                    </p>
                </div>

                <div className="sobre-origem-number">
                    <span>01</span>
                    <strong>IDEIA</strong>
                    <small>Comunidade + Speedcubing</small>
                </div>
            </section>

            {/* TECNOLOGIAS */}
            <section className="sobre-section">
                <div className="sobre-section-header centered">
                    <span className="sobre-label">TECNOLOGIA</span>

                    <h2>Construído para conectar pessoas</h2>

                    <p>
                        Uma arquitetura moderna para oferecer uma experiência
                        rápida, interativa e em tempo real.
                    </p>
                </div>

                <div className="sobre-tech-grid">

                    <TechGroup
                        title="Backend"
                        technologies={[
                            "Java 21",
                            "Spring Boot",
                            "Spring Security",
                            "Spring Data JPA",
                            "MySQL",
                            "JWT",
                            "Cloudinary",
                            "TNoodle WCA",
                        ]}
                    />

                    <TechGroup
                        title="Frontend"
                        technologies={[
                            "React",
                            "TypeScript",
                            "Vite",
                            "React Router",
                            "TanStack Query",
                            "Axios",
                            "Tailwind CSS",
                            "D3.js",
                        ]}
                    />

                    <TechGroup
                        title="Tempo real"
                        technologies={[
                            "Node.js",
                            "Express",
                            "Socket.IO",
                            "WebRTC",
                            "Twisty Player",
                            "Cubing",
                        ]}
                    />

                </div>
            </section>

            {/* AUTOR */}
            <section className="sobre-author">
                <Code2 size={34} />

                <span className="sobre-label">DESENVOLVIDO POR</span>

                <h2>Lucas Villarinho Milhão</h2>

                <p>
                    Projeto desenvolvido como TCC do curso Técnico em Informática.
                </p>

                <div className="sobre-socials">
                    <a
                        href="https://github.com/lucasmilhao"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/lucas-villarinho-milh%C3%A3o-a63a1135a/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                </div>
            </section>

            {/* CTA */}
            <section className="sobre-cta">
                <h2>Seu próximo solve pode ser junto.</h2>

                <p>
                    Faça parte da comunidade, pratique e encontre outros cubers.
                </p>

                <a href="/auth/register" className="sobre-primary-button">
                    Começar agora
                </a>
            </section>

        </main>
    );
}

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    text: string;
}

function Feature({ icon, title, text }: FeatureProps) {
    return (
        <article className="sobre-feature">
            <div className="sobre-feature-icon">
                {icon}
            </div>

            <h3>{title}</h3>

            <p>{text}</p>
        </article>
    );
}

interface TechGroupProps {
    title: string;
    technologies: string[];
}

function TechGroup({ title, technologies }: TechGroupProps) {
    return (
        <div className="sobre-tech-group">
            <h3>{title}</h3>

            <div className="sobre-tech-list">
                {technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                ))}
            </div>
        </div>
    );
}