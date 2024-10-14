// /pages/api/getColaboradores.js
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  
  try {
    // Conectar ao MongoDB
    const { db } = await connectToDatabase();
    
    const avaliacoesCollection = db.collection("avaliacoes");

    // Obter dados de colaboradores e avaliações
    const avaliacoes = await avaliacoesCollection.find().toArray();
    
    // Enviar dados como resposta
    res.status(200).json(avaliacoes[0]);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}
