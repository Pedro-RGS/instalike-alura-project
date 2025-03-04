import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

const db = conexao.db("imersao-instabyte");
const colecao = db.collection("posts")

export async function getAllPosts(){
    return colecao.find().toArray();
}

export async function criarPost(novoPost){
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost){
    const objectId = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objectId)}, {$set: novoPost});
}