import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // Se já existe uma conexão ativa, reutiliza-a
    return { client: cachedClient, db: cachedDb };
  }

  // Conecta ao MongoDB usando a URI fornecida no .env.local
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(); // Use o nome do banco de dados correto

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
