import { useEffect } from "react";
import "./TermosModal.css";

interface TermosModalProps {
    onClose: () => void;
}

interface Secao {
    titulo: string;
    paragrafos?: string[];
    itens?: string[];
}

const ULTIMA_ATUALIZACAO = "20 de outubro de 2026";

const SECOES: Secao[] = [
    {
        titulo: "1. Aceitação dos termos",
        paragrafos: [
            "Ao criar uma conta ou usar o Cubing2Gether, você concorda com estes Termos de Uso. Se não concordar com algum ponto, não utilize a plataforma.",
        ],
    },
    {
        titulo: "2. O que é o Cubing2Gether",
        paragrafos: [
            "O Cubing2Gether é uma rede social para a comunidade de speedcubing. Nela você pode publicar, seguir outros cubers, conversar, treinar com scrambles e cronômetro e disputar partidas ao vivo por vídeo.",
            "A plataforma foi desenvolvida como Trabalho de Conclusão de Curso do Técnico em Informática da Fundatec e pode receber mudanças ou ficar indisponível sem aviso prévio.",
        ],
    },
    {
        titulo: "3. Sua conta",
        itens: [
            "Você pode se cadastrar com e-mail e senha ou entrar com a sua conta Google.",
            "As informações do cadastro devem ser verdadeiras e estar atualizadas.",
            "Você é responsável por manter sua senha em segurança e por tudo o que acontece na sua conta.",
            "Cada pessoa deve ter apenas uma conta. Contas que se passam por outra pessoa podem ser removidas.",
        ],
    },
    {
        titulo: "4. Como usar a plataforma",
        paragrafos: ["Para manter a comunidade segura e agradável, você não pode:"],
        itens: [
            "Ofender, ameaçar, assediar ou discriminar outras pessoas.",
            "Publicar conteúdo ilegal, violento, sexual ou que viole direitos de terceiros.",
            "Enviar spam, links maliciosos ou tentar enganar outros usuários.",
            "Tentar acessar contas, dados ou áreas da plataforma sem autorização.",
            "Fraudar tempos, solves ou resultados de partidas.",
        ],
    },
    {
        titulo: "5. Conteúdo que você publica",
        paragrafos: [
            "Postagens, comentários, mensagens, imagens, scrambles e soluções que você publica continuam sendo seus. Ao publicá-los, você permite que o Cubing2Gether os exiba na plataforma para os usuários que tenham acesso a eles.",
            "Você é o único responsável pelo que publica. O Cubing2Gether pode remover conteúdo que descumpra estes termos.",
        ],
    },
    {
        titulo: "6. Seguidores, conversas e notificações",
        paragrafos: [
            "Você pode seguir outros usuários, trocar mensagens em conversas privadas ou em grupo e receber notificações sobre curtidas, comentários, novos seguidores e mensagens.",
            "Em grupos públicos, qualquer pessoa com o link de convite pode entrar até que ele expire. Administradores do grupo podem remover participantes. Ao sair de uma conversa, você deixa de receber as mensagens enviadas depois disso.",
        ],
    },
    {
        titulo: "7. Partidas ao vivo",
        paragrafos: [
            "As partidas usam a câmera e o microfone do seu dispositivo, com a sua permissão, para transmitir vídeo e áudio ao outro participante durante a sala. Você pode negar a permissão no navegador, mas não conseguirá participar da partida em vídeo.",
            "A plataforma não grava as partidas. Mesmo assim, o outro participante poderia gravar a própria tela por conta própria, então entre apenas em salas com pessoas em quem você confia.",
        ],
    },
    {
        titulo: "8. Denúncias e moderação",
        paragrafos: [
            "Se encontrar uma postagem ou comportamento que viole estes termos, use a opção Denunciar. As denúncias são analisadas e podem resultar na remoção do conteúdo ou na suspensão da conta.",
        ],
    },
    {
        titulo: "9. Dados e privacidade",
        paragrafos: ["Para o funcionamento da plataforma, tratamos os seguintes dados:"],
        itens: [
            "Dados de cadastro: nome, nome de usuário, e-mail e foto de perfil. Ao entrar com o Google, recebemos nome, e-mail e foto da sua conta.",
            "Conteúdo e atividade: postagens, comentários, mensagens, curtidas, seguidores, solves e resultados de partidas.",
            "Senhas são armazenadas de forma criptografada, e a sessão fica salva em um cookie seguro no seu navegador.",
            "Imagens enviadas são armazenadas no serviço Cloudinary, e e-mails de redefinição de senha são enviados por um servidor SMTP.",
        ],
    },
    {
        titulo: "10. Propriedade intelectual",
        paragrafos: [
            "O nome, a identidade visual e o código do Cubing2Gether pertencem ao seu autor. Os scrambles são gerados com a biblioteca TNoodle, usada nas competições da WCA, e a visualização dos cubos usa a biblioteca cubing.js. Cada uma delas segue a licença de seus respectivos autores.",
        ],
    },
    {
        titulo: "11. Disponibilidade e responsabilidade",
        paragrafos: [
            "Fazemos o possível para manter a plataforma funcionando, mas ela é oferecida como está, sem garantia de funcionamento contínuo. O Cubing2Gether não se responsabiliza por perda de dados, falhas de conexão durante partidas ou conteúdo publicado por outros usuários.",
        ],
    },
    {
        titulo: "12. Encerramento da conta",
        paragrafos: [
            "Você pode deixar de usar a plataforma quando quiser. Contas que descumprirem estes termos podem ser suspensas ou removidas.",
        ],
    },
    {
        titulo: "13. Mudanças nos termos",
        paragrafos: [
            "Estes termos podem ser atualizados. A data da última atualização aparece no topo deste documento, e continuar usando a plataforma depois de uma mudança significa que você aceita a nova versão.",
        ],
    },
    {
        titulo: "14. Contato",
        paragrafos: [
            "Dúvidas sobre estes termos ou sobre seus dados podem ser enviadas para contato@cubing2gether.com.",
        ],
    },
];

export function TermosModal({ onClose }: TermosModalProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="termos-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="termos-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="termos-modal-titulo"
            >
                <header className="termos-modal__header">
                    <div>
                        <h2 id="termos-modal-titulo">Termos de Uso</h2>
                        <p>Atualizado em {ULTIMA_ATUALIZACAO}</p>
                    </div>

                    <button
                        type="button"
                        className="termos-modal__close"
                        onClick={onClose}
                        aria-label="Fechar termos de uso"
                    >
                        ×
                    </button>
                </header>

                <div className="termos-modal__content">
                    <p className="termos-modal__intro">
                        Leia com calma. Estes termos explicam as regras de uso do
                        Cubing2Gether e como cuidamos das suas informações.
                    </p>

                    {SECOES.map((secao) => (
                        <section className="termos-secao" key={secao.titulo}>
                            <h3>{secao.titulo}</h3>

                            {secao.paragrafos?.map((paragrafo, index) => (
                                <p key={index}>{paragrafo}</p>
                            ))}

                            {secao.itens && (
                                <ul>
                                    {secao.itens.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>

                <footer className="termos-modal__footer">
                    <button
                        type="button"
                        className="termos-modal__confirm"
                        onClick={onClose}
                    >
                        Entendi
                    </button>
                </footer>
            </div>
        </div>
    );
}
