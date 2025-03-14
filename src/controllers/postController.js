import { getAllPosts,  criarPost, atualizarPost } from "../models/postModel.js";
import fs from "fs";

export async function listarTodosOsPosts(req, res) {
    const posts = await getAllPosts();
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res){
    const novoPost = req.body;

    try{
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function uploadImagem(req, res){
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function atualizaPostAntigo(req, res){
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try{
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);  
    }
    catch(erro){
        console.erro(erro.message);
        res.status(500).json({"Error":"Falha na requisição"});
    }
}