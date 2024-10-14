// /pages/api/getColaboradores.js
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  
  try {
    // Conectar ao MongoDB
    const { db } = await connectToDatabase();
    
    const colaboradoresCollection = db.collection("colaboradores");

    // Obter dados de colaboradores e avaliações
    const colaboradores = await colaboradoresCollection.find().toArray();
    
    // Enviar dados como resposta
    res.status(200).json(colaboradores[0]);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}
