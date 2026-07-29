import { PostCard } from "../../components/postagem/PostCard";
import { usePostagemData } from "../../hooks/postagem/usePostagemData";

export default function Home() {
    const {data : postagens} = usePostagemData();

    return (
        <div>
            {postagens?.data && postagens.data.map(e => {
                console.log(e.descricao);
                return <PostCard postagem={e}/>
                })}
        </div>
    )
}