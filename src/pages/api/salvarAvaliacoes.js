// pages/api/salvarAvaliacoes.js
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { avaliacoes } = req.body;

    try {
      const { db } = await connectToDatabase();

      // ID do colaborador que você deseja atualizar
      const idColaborador = new ObjectId('670c91f9eb59f1f018ba2b7b');

      // Verificação: Certifique-se de que 'avaliacoes' seja um array
      if (!Array.isArray(avaliacoes)) {
        return res.status(400).json({ message: 'Formato de dados inválido: avaliacoes deve ser um array.' });
      }

      // Buscar o colaborador para obter as avaliações atuais
      const colaborador = await db.collection('avaliacoes').findOne({ _id: idColaborador });

      if (!colaborador) {
        return res.status(404).json({ message: 'Colaborador não encontrado.' });
      }

      // Determinar o último código de avaliação
      const avaliacoesExistentes = colaborador.avaliacoes || [];

      // Ignora avaliações com códigos não numéricos e calcula o último código
      const codigosValidos = avaliacoesExistentes
        .map(avaliacao => parseInt(avaliacao.codigo, 10))
        .filter(codigo => !isNaN(codigo)); // Filtra apenas os códigos válidos

      const ultimoCodigo = codigosValidos.length > 0 ? Math.max(...codigosValidos) : 0;

      // Função para gerar data no formato YYYY/MM/DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
      };

      // Adicionar o campo 'código' e 'data' a cada nova avaliação
      const novasAvaliacoes = avaliacoes.map((avaliacao, index) => ({
        codigo: (ultimoCodigo + index + 1).toString(), // Incrementa o código corretamente
        data: formatDate(new Date()), // Adiciona a data atual formatada
        ...avaliacao
      }));

      // Insere as novas avaliações no banco de dados
      const result = await db.collection('avaliacoes').updateOne(
        { _id: idColaborador },
        { $push: { avaliacoes: { $each: novasAvaliacoes } } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Nenhum documento foi modificado.' });
      }

      res.status(200).json({ message: 'Avaliações salvas com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
      res.status(500).json({ message: 'Erro ao salvar avaliações' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
