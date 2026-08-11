import { useNavigate, useParams } from "react-router-dom";
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


export function Usuario() {
    const { idUsuario } = useParams();
    const { data: usuario, isLoading, isError, error } = useUsuarioDataId(idUsuario);
    const { data: usuarioLogado, isError: erroUsuario } = useUsuarioLogado();
    const { data: seguindo } = useFollowSeguindoData(idUsuario);
    const { data: seguidores } = useFollowSeguidoresData(idUsuario);
    const { mutate: seguir, isPending: carregandoSeguir } = useFollowCreate();
    const navigate = useNavigate();
    const { data: solveUser } = useSolveDataUser(usuario?.id);
    const [isOpen, setIsOpen] = useState(false);
    const { data: followStatus } = useFollowStatus(idUsuario);
    const [nome, setNome] = useState(usuario?.nome);
    console.log("FollowStatus: ", followStatus);
    const followInfo = useMemo(() => {
        if (!followStatus) return "Seguir";

        if (followStatus.sigo && followStatus.meSegue) return "Amigos";
        if (followStatus.sigo) return "Seguindo";
        if (followStatus.meSegue) return "Seguir de volta";

        return "Seguir";
    }, [followStatus]);

    const EditarPerfilBtn = <button onClick={() => handleModal()} className="edit-profile-btn">Editar perfil</button>;

    const checarConvidado = (): boolean => {
        return usuarioLogado?.isGuest === undefined ? false : usuarioLogado?.isGuest;
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
                {show && <h2>Histórico gráfico:</h2>}

                <div className="graphic-solve" style={{ width: "100%" }}>
                    {solves?.map(e => {

                        const hue = (e.id * 360) / solves.length;

                        return (
                            <div
                                key={e.id}
                                style={{
                                    backgroundColor: `hsl(${hue}, 70%, 50%)`,
                                    height: `${e.tempo / 100}px`,
                                    flex: 1,
                                    color: `rgb(${segundos(e.tempo)} ${e.id} 32)`
                                }}
                            >
                                <p style={{ color: "white" }}>{segundos(e.tempo)}s</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )

}
