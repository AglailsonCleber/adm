// pages/api/salvar-avaliacoes.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Caminho para o arquivo avaliacoes.json
      const filePath = path.join(process.cwd(), 'public', 'data', 'avaliacoes.json');

      // Ler o conteúdo atual do arquivo JSON
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const avaliacoesExistentes = JSON.parse(fileContent);

      // Novas avaliações recebidas da requisição
      const novasAvaliacoes = req.body;

      // Combina avaliações existentes com novas
      const avaliacoesAtualizadas = [...avaliacoesExistentes, ...novasAvaliacoes];

      // Escrever as avaliações atualizadas no arquivo
      fs.writeFileSync(filePath, JSON.stringify(avaliacoesAtualizadas, null, 2), 'utf-8');

      // Retorna uma resposta de sucesso
      res.status(200).json({ message: 'Avaliações salvas com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
      res.status(500).json({ error: 'Erro ao salvar avaliações' });
    }
  } else {
    // Responde com erro se não for uma requisição POST
    res.status(405).json({ error: 'Método não permitido' });
  }
}
