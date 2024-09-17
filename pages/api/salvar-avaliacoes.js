// pages/api/salvar-avaliacoes.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'public', 'data', 'avaliacoes.json');
    
    try {
      // Verificar se o diretório existe
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      // Ler o conteúdo atual do arquivo
      let conteudoAtual = [];
      if (fs.existsSync(filePath)) {
        conteudoAtual = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }

      // Atualizar o conteúdo com as novas avaliações
      const novoConteudo = req.body;
      const conteudoAtualizado = [...conteudoAtual, ...novoConteudo];

      // Salvar o conteúdo atualizado
      fs.writeFileSync(filePath, JSON.stringify(conteudoAtualizado, null, 2), 'utf-8');

      res.status(200).json({ message: 'Avaliações salvas com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
      res.status(500).json({ message: 'Erro ao salvar avaliações.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
