import { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronDown,
  User,
  FileText,
  MessageCircle,
  Bell,
  ShieldCheck,
  Bug,
  Mail,
  Lock,
  Eye,
  UserMinus,
  LogOut,
  Pencil,
  Square,
} from "lucide-react";
import "./HelpPage.css";
import { Modal } from "../../components/modal/Modal";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useUsuarioLogout } from "../../hooks/usuario/useUsuarioLogout";
import { useSolicitarRedefinicaoSenha } from "../../hooks/usuario/useSolicitarRedefinicaoSenha";

const FACE_COLORS: Record<string, string> = {
  R: "#e63946",
  U: "#ffe14d",
  F: "#2ecc71",
  D: "#ffffff",
  L: "#f28c28",
  B: "#2f80ed",
};

type Faq = {
  q: string;
  a: string;
};

type Category = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  faqs: Faq[];
};

const CATEGORIES: Category[] = [
  {
    id: "conta",
    icon: User,
    label: "Minha conta",
    faqs: [
      { q: "Como altero meus dados?", a: "Acesse seu perfil → Configurações → Editar perfil. Lá você pode atualizar nome, bio e foto." },
      { q: "Como editar meu perfil?", a: "Vá em Perfil → Editar perfil para alterar nome de usuário, bio e avatar." },
      { q: "Como altero minha senha?", a: "Em Configurações → Senha, informe a senha atual e defina a nova senha." },
      { q: "Como recupero minha senha?", a: 'Na tela de login, toque em "Esqueci minha senha" e siga as instruções enviadas para seu e-mail cadastrado.' },
      { q: "Como altero meu e-mail?", a: "Em Configurações → Conta → E-mail, informe o novo endereço e confirme com sua senha atual." },
      { q: "Como altero minha foto de perfil?", a: "Toque na sua foto atual em Editar perfil e escolha uma nova imagem da galeria." },
      { q: "Como altero o tema da aplicação?", a: "Em Configurações → Aparência, escolha entre tema claro, escuro ou automático (segue o sistema)." },
      { q: "Como excluo minha conta?", a: "Em Configurações → Conta → Excluir conta. Essa ação é permanente e remove suas postagens e dados." },
      { q: "Como saio da minha conta?", a: 'Toque no seu avatar no menu lateral e selecione "Logout".' },
    ],
  },
  {
    id: "postagens",
    icon: FileText,
    label: "Postagens",
    faqs: [
      { q: "Como criar uma postagem?", a: 'Toque em "Nova postagem", escreva o que deseja compartilhar, adicione um scramble se quiser e toque em Publicar.' },
      { q: "Como adicionar um scramble à postagem?", a: "No editor de postagem, toque no ícone de cubo para escrever ou colar um scramble. Ele aparece como um cubo 3D interativo abaixo do texto." },
      { q: "Como editar ou excluir uma postagem?", a: "Toque nos três pontos no canto da postagem e escolha Editar ou Excluir. Apenas o autor pode fazer isso." },
      { q: "Como curtir uma postagem?", a: "Toque no ícone de coração abaixo da postagem. Toque novamente para descurtir." },
      { q: "Como comentar?", a: "Toque no ícone de comentário, escreva sua resposta e toque em Enviar." },
      { q: "Como compartilhar uma postagem?", a: "Toque no ícone de compartilhar para republicar em seu perfil ou enviar em uma conversa." },
    ],
  },
  {
    id: "cubo",
    icon: Square,
    label: "Cubo mágico",
    faqs: [
      { q: "O que é um scramble?", a: "É uma sequência de movimentos aleatórios usada para embaralhar o cubo de forma padronizada antes de uma resolução, garantindo que todos resolvam o mesmo estado." },
      { q: "O que são OLL, PLL e F2L?", a: "São etapas do método CFOP: F2L monta os dois primeiros andares, OLL orienta a última camada e PLL permuta as peças da última camada para finalizar o cubo." },
      { q: "Como interpretar uma sequência de movimentos?", a: "Cada letra representa o giro de uma face. Leia da esquerda para a direita, aplicando um movimento por vez sobre o cubo." },
      { q: "Notação do cubo (R, R', R2)", a: "A letra indica a face girada. O apóstrofo (') inverte o sentido (anti-horário) e o número 2 indica meia volta (180°)." },
      { q: "Como visualizar o scramble", a: "Toque no cubo 3D em qualquer postagem ou em 'Practice' para girar, dar zoom e conferir o estado embaralhado antes de tentar resolver." },
      { q: "Como registrar uma solução", a: 'Vá para a aba "Practice" e segure "espaço" para iniciar o timer e pressione qualquer tecla para parar o timer, registrando uma solução.' },
    ],
  },
  {
    id: "conversas",
    icon: MessageCircle,
    label: "Conversas",
    faqs: [
      { q: "Como iniciar uma conversa?", a: "Vá até Mensagens, toque no ícone de nova conversa e selecione um usuário." },
      { q: "Como criar um grupo?", a: "Em Mensagens, toque em Novo grupo, selecione os participantes e defina um nome." },
      { q: "Como adicionar ou remover participantes?", a: "Abra o grupo → Informações do grupo → Gerenciar participantes, disponível para administradores." },
      { q: "Como enviar mensagens?", a: "Digite na caixa de texto na parte inferior da conversa e toque em enviar." },
      { q: "Como sair de um grupo?", a: "Abra o grupo → Informações do grupo → Sair do grupo." },
    ],
  },
  {
    id: "notificacoes",
    icon: Bell,
    label: "Notificações",
    faqs: [
      { q: "Quando eu recebo notificações?", a: "Você é notificado quando alguém curte, comenta ou compartilha sua postagem, e quando alguém começa a seguir você." },
      { q: "Como desativo notificações?", a: "Em Configurações → Notificações, desative os tipos que não deseja mais receber." },
      { q: "Como sei quem curtiu minha postagem?", a: "Toque na notificação de curtida ou no contador de curtidas dentro da própria postagem." },
    ],
  },
  {
    id: "seguranca",
    icon: ShieldCheck,
    label: "Privacidade e segurança",
    faqs: [
      { q: "Quem pode visualizar minhas postagens?", a: "Por padrão, todos os usuários podem ver postagens públicas. Você pode restringir isso em Configurações → Privacidade." },
      { q: "Como bloquear alguém?", a: "No perfil do usuário, toque nos três pontos e selecione Bloquear. A pessoa não poderá mais ver seu perfil ou te contatar." },
      { q: "Como denunciar uma postagem?", a: "Toque nos três pontos na postagem e selecione Denunciar, escolhendo o motivo da denúncia." },
      { q: "Como denunciar um usuário?", a: "No perfil do usuário, toque nos três pontos e selecione Denunciar usuário." },
      { q: "O que acontece quando denuncio algo?", a: "Nossa equipe analisa a denúncia e toma as medidas cabíveis, que podem incluir remoção de conteúdo ou suspensão da conta." },
      { q: "Como proteger minha conta?", a: "Use uma senha forte, não a compartilhe com ninguém e revise periodicamente os dispositivos conectados em Configurações → Segurança." },
    ],
  },
  {
    id: "problemas",
    icon: Bug,
    label: "Problemas",
    faqs: [
      { q: "Como reporto um problema?", a: "Vá em Ajuda → Reportar um problema, descreva o que aconteceu e anexe uma captura de tela se possível." },
      { q: "Como envio uma sugestão?", a: "Em Ajuda → Enviar uma sugestão, conte o que você gostaria de ver no app." },
      { q: "Como entro em contato?", a: "Em Ajuda → Entrar em contato, nossa equipe responde pelo e-mail informado." },
      { q: "Como reporto um problema de segurança?", a: "Em Ajuda → Problema de segurança, use este canal específico para vulnerabilidades — respondemos com prioridade." },
    ],
  },
];

const ACCOUNT_QUICK_ACTIONS = [
  {
    icon: Pencil,
    label: "Editar perfil",
    action: "edit-profile",
  },
  {
    icon: Lock,
    label: "Alterar senha",
    action: "change-password",
  },
  {
    icon: Mail,
    label: "Alterar e-mail",
    action: "change-email",
  },
  {
    icon: Eye,
    label: "Recuperar senha",
    action: "recover-password",
  },
  {
    icon: UserMinus,
    label: "Excluir conta",
    action: "delete-account",
  },
  {
    icon: LogOut,
    label: "Sair da conta",
    action: "logout",
  },
];

type NotationChipProps = {
  letter: string;
};

function NotationChip({ letter }: NotationChipProps) {
  const face = letter[0];

  return (
    <span className="notation-chip">
      <span
        className={`notation-chip__face ${face === "U" || face === "D" ? "notation-chip__face--light" : ""}`}
        style={{ backgroundColor: FACE_COLORS[face] }}
      />
      {letter}
    </span>
  );
}

type FaqItemProps = {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
};

function FaqItem({ q, a, open, onToggle }: FaqItemProps) {
  return (
    <div className="faq-item">
      <button className="faq-item__button" onClick={onToggle} type="button">
        <span>{q}</span>
        <ChevronDown className={`faq-item__chevron ${open ? "faq-item__chevron--open" : ""}`} size={18} />
      </button>

      {open && <p className="faq-item__answer">{a}</p>}
    </div>
  );
}

type CategoryCardProps = {
  category: Category;
  onClick: () => void;
};

function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <button className="category-card" onClick={onClick} type="button">
      {Icon ? (
        <Icon className="category-card__icon" size={22} />
      ) : (
        <div className="category-card__cube">
          {["R", "U", "F"].map((letter) => (
            <span
              key={letter}
              className={`category-card__cube-face ${letter === "U" ? "category-card__cube-face--light" : ""}`}
              style={{ backgroundColor: FACE_COLORS[letter] }}
            />
          ))}
        </div>
      )}

      <div>
        <p className="category-card__label">{category.label}</p>
        <p className="category-card__count">
          {category.faqs.length} {category.faqs.length === 1 ? "artigo" : "artigos"}
        </p>
      </div>
    </button>
  );
}

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {mutate : logout} = useUsuarioLogout();
  const {mutate : recuperarSenha, isPending} = useSolicitarRedefinicaoSenha();
  const {data : usuarioLogado} = useUsuarioLogado();


  const handleAction = (action: string) => {
    switch (action) {
      case "edit-profile":
        setIsModalOpen(true); 
        break;

      case "change-password":
        recuperarSenha(usuarioLogado)
        break;

      case "change-email":
        // ...
        break;

      case "recover-password":
        recuperarSenha(usuarioLogado, {
          onSuccess: () => alert(`Enviamos um email para ${usuarioLogado?.email} com instruções de como redefinir sua senha.`)
        });
        break;

      case "delete-account":
        // ...
        break;

      case "logout":
        logout();
        break;
    }
  };

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    const results: Array<Faq & { categoryLabel: string; categoryId: string }> = [];

    for (const category of CATEGORIES) {
      for (const faq of category.faqs) {
        if (
          faq.q.toLowerCase().includes(normalizedQuery) ||
          faq.a.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            ...faq,
            categoryLabel: category.label,
            categoryId: category.id,
          });
        }
      }
    }

    return results;
  }, [normalizedQuery]);

  const category = CATEGORIES.find((item) => item.id === activeCategory);

  const handleOpenCategory = (id: string) => {
    setActiveCategory(id);
    setOpenFaq(null);
    setQuery("");
  };


  return (
    <div className="help-page">
      <header className="help-page__header">
        {isModalOpen && <Modal usuarioLogado={usuarioLogado} closeModal={() => setIsModalOpen(prev => !prev)}/>}
        {activeCategory && (
          <button
            className="help-page__back-button"
            onClick={() => setActiveCategory(null)}
            aria-label="Voltar"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <h1 className="help-page__title">
          {activeCategory && category ? category.label : "Ajuda"}
        </h1>
      </header>

      {!activeCategory && (
        <div className="help-page__search">
          <Search className="help-page__search-icon" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Como podemos ajudar?"
          />
        </div>
      )}

      {!activeCategory && normalizedQuery && (
        <div>
          <p className="help-page__result-count">
            {searchResults.length}{" "}
            {searchResults.length === 1 ? "resultado" : "resultados"} para "{query}"
          </p>

          {searchResults.length === 0 ? (
            <p className="help-page__empty">
              Nenhum artigo encontrado. Tente outros termos ou navegue pelas categorias abaixo.
            </p>
          ) : (
            searchResults.map((result, index) => (
              <div key={`${result.categoryId}-${result.q}-${index}`}>
                <p className="help-page__result-category">{result.categoryLabel}</p>
                <FaqItem
                  q={result.q}
                  a={result.a}
                  open={openFaq === result.q}
                  onToggle={() => setOpenFaq(openFaq === result.q ? null : result.q)}
                />
              </div>
            ))
          )}
        </div>
      )}

      {!activeCategory && !normalizedQuery && (
        <>
          <div className="help-page__categories">
            {CATEGORIES.map((item) => (
              <CategoryCard
                key={item.id}
                category={item}
                onClick={() => handleOpenCategory(item.id)}
              />
            ))}
          </div>

          <h2 className="help-page__section-title">Perguntas frequentes</h2>

          <div>
            {CATEGORIES.flatMap((item) => item.faqs.slice(0, 1)).map((faq, index) => (
              <FaqItem
                key={index}
                q={faq.q}
                a={faq.a}
                open={openFaq === faq.q}
                onToggle={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
              />
            ))}
          </div>
        </>
      )}

      {activeCategory && category && (
        <div>
          {category.id === "conta" && (
            <div className="account-actions">
              {ACCOUNT_QUICK_ACTIONS.map(({ icon: Icon, label, action }) => (
                <button className="account-action" key={label} type="button" onClick={() => handleAction(action)}>
                  <Icon size={15} className="account-action__icon" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {category.id === "cubo" && (
            <div className="notation-list">
              {["R", "R'", "R2", "U", "U'", "F", "F'", "L", "D", "B"].map((notation) => (
                <NotationChip key={notation} letter={notation} />
              ))}
            </div>
          )}

          <div>
            {category.faqs.map((faq, index) => (
              <FaqItem
                key={index}
                q={faq.q}
                a={faq.a}
                open={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
