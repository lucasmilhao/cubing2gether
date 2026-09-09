import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUsuarioDataId } from "../../hooks/usuario/useUsuarioDataId"
import './Usuario.css';
import { useSolveDataUser } from "../../hooks/solves/useSolveDataUser";
import { segundos } from "../Practice";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/modal/Modal";
import Swal from "sweetalert2";
import { useFollowSeguindoData } from "../../hooks/follow/useFollowSeguindoData";
import { useFollowSeguidoresData } from "../../hooks/follow/useFollowSeguidoresData";
import { useFollowCreate, type FollowRequest } from "../../hooks/follow/useFollowCreate";
import { useFollowStatus } from "../../hooks/follow/useFollowStatus";
import { SolveChart } from "../../components/chart/SolveChart";
import { PostCard } from "../../components/postagem/PostCard";
import { usePostagemUsuario } from "../../hooks/postagem/usePostagemUsuario";
import type { ConversaRequestProps } from "../../interface/ConversaRequestProps";
import { useConversaCreate } from "../../hooks/chat/conversa/useConversaCreate";


export function Usuario() {
    const location = useLocation();
    const { idUsuario } = useParams();
    const { data: usuario, isLoading, isError, error } = useUsuarioDataId(idUsuario);
    const { data: usuarioLogado, isError: erroUsuario } = useUsuarioLogado();
    const { data: seguindo } = useFollowSeguindoData(idUsuario);
    const { data: seguidores } = useFollowSeguidoresData(idUsuario);
    const { data: postagens } = usePostagemUsuario(idUsuario);
    const { mutate: seguir, isPending: carregandoSeguir } = useFollowCreate();
    const navigate = useNavigate();
    const { data: solveUser } = useSolveDataUser(usuario?.id);
    const [isOpen, setIsOpen] = useState(false);
    const { data: followStatus } = useFollowStatus(idUsuario);
    const [nome, setNome] = useState(usuario?.nome);
    const { mutate: conversa } = useConversaCreate();
    const followInfo = useMemo(() => {
        if (!followStatus) return "Seguir";

        if (followStatus.sigo && followStatus.meSegue) return "Amigos";
        if (followStatus.sigo) return "Seguindo";
        if (followStatus.meSegue) return "Seguir de volta";

        return "Seguir";
    }, [followStatus]);

    const EditarPerfilBtn = <button onClick={() => handleModal()} className="edit-profile-btn">Editar perfil</button>;
    let idsUsuarios: string[] | undefined = []

    const checarConvidado = (): boolean => {
        return usuarioLogado?.isGuest === undefined ? false : usuarioLogado?.isGuest;
    }


    const submitConversa = (nome: string, idsUsuarios: string[]) => {
        const props: ConversaRequestProps = {
            nome,
            idsUsuarios
        }

        conversa(props, {
            onSuccess: (data) => {
                navigate(`/chat/${data.idConversa}`)
                console.log(data.nome);
            }
        });
    }


    useEffect(() => {
        if (erroUsuario) navigate("/auth/login");
    }, [erroUsuario, navigate])

    const handleSeguir = () => {

        const props: FollowRequest = {
            idSeguidor: usuarioLogado?.id,
            idSeguindo: idUsuario
        }

        console.log(props);

        seguir(props, {
            onSuccess: () => console.log("Sucesso"),
        });
    }
    console.log(carregandoSeguir);
    const FollowBtn = <button onClick={() => handleSeguir()} className="edit-profile-btn">{followInfo}</button>;

    const handleModal = () => {

        if (checarConvidado()) Swal.fire({
            title: "Login",
            text: "Faça login para editar seu perfil",
            showCancelButton: true,
            confirmButtonText: "Login",
        }).then((result) => {
            if (result.isConfirmed) navigate("/auth/login");
        })

        else setIsOpen(prev => !prev);
    }


    useEffect(() => {
        if (!location.hash) return;

        const postId = location.hash.substring(1);
        const elemento = document.getElementById(postId);

        if (elemento) {
            elemento.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [location.hash, postagens]);

    useEffect(() => {
        if (!usuario?.picture || !usuario?.nome) return;

        setImage(usuario.picture);
        setNome(usuario.nome);

    }, [usuario?.picture, usuario?.picture])

    const solves = solveUser?.data.reverse();

    const [image, setImage] = useState(usuario?.picture ? usuario.picture : "defaltImage");

    console.log(usuario?.picture);
    if (isLoading) return <div className="usuario-page">Carregando usuário...</div>;
    if (isError) return <div className="usuario-page error">id: {idUsuario} Erro ao buscar usuário: {String((error as any)?.message || error)}</div>;

    const isUsuarioLogado = usuarioLogado?.id === idUsuario;

    const show = solves ? solves.length > 0 : false;

    return (
        <div className="user-container">
            {isOpen && <Modal closeModal={handleModal} usuarioLogado={usuarioLogado} />}
            <div className="usuario-page">
                <div className="actions">
                    {!isUsuarioLogado && <button className="chat-button-usuario" onClick={() => {
                        idsUsuarios.push(usuario?.id ?? "");
                        if (usuarioLogado?.id) {
                            idsUsuarios.push(usuarioLogado.id);
                        }
                        submitConversa(`${usuario?.nome} e ${usuarioLogado?.nome}`, idsUsuarios)
                    }} title="Iniciar conversa">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L360 512C354.8 512 349.8 513.7 345.6 516.8L230.4 603.2C226.2 606.3 221.2 608 216 608C202.7 608 192 597.3 192 584L192 512L160 512C107 512 64 469 64 416z" /></svg>
                    </button>}

                    <div className="usuario-card">
                        <img className="usuario-avatar" src={image} alt="Foto Usuario" onClick={() => window.location.href = image} />

                        <div>
                            <h1 className="usuario-name">{nome}</h1>
                        </div>
                    </div>
                    {isUsuarioLogado ? EditarPerfilBtn : FollowBtn}

                </div>

                <div className="usuario-sections">
                    <section className="usuario-section">
                        <h2>Média:</h2>
                        {solveUser?.data && solveUser.data.length > 0 ? (
                            <div className="photos-grid">
                                <h1>{segundos(solveUser.data.reduce((a, b) => a + b.tempo, 0) / solveUser.data.length)}s</h1>
                            </div>
                        ) : (
                            <p>Sem resoluções ainda. Faça upload de suas melhores jogadas!</p>
                        )}
                    </section>

                    <section className="usuario-section">
                        <h2 onClick={() => navigate(`/followers/${idUsuario}`)}>Seguidores</h2>
                        <div className="photos-grid">
                            <h1>{seguidores?.length ?? 0}</h1>
                        </div>
                    </section>

                    <section className="usuario-section">
                        <h2 onClick={() => navigate(`/following/${idUsuario}`)}>Seguindo</h2>
                        <div className="photos-grid">
                            <h1>{seguindo ? seguindo.length : 0}</h1>
                        </div>
                    </section>
                </div>
                {show && (
                    <>
                        {<SolveChart solves={solves ?? []} />}
                    </>
                )
                }

                <div className="home-posts-list">
                    {postagens?.length ? (
                        postagens.map((postagem) => <PostCard key={postagem.id} postagem={postagem} />)
                    ) : (
                        <div className="home-empty-state">Ainda não há publicações para mostrar.</div>
                    )}
                </div>
            </div>
        </div>
    )

}
