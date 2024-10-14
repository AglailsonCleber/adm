import React, { useEffect, useState } from 'react';
import styles from '../styles/VisualizarColaborador.module.css';

const VisualizarColaborador = () => {
  const [colaboradores, setColaboradores] = useState([]); // Inicializa como array vazio
  const [avaliacoes, setAvaliacoes] = useState([]); // Inicializa como array vazio
  const [avaliacoesFiltradas, setAvaliacoesFiltradas] = useState({});
  const [turnoAtivo, setTurnoAtivo] = useState('ADM'); // Estado para armazenar o turno ativo

  // Fazer a requisição à API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseColaboradores = await fetch('/api/getDadosColaboradores'); // Corrigido para o nome correto da API
        if (!responseColaboradores.ok) {
          // Exibe a resposta completa em formato texto para debugar
          const errorText = await response.text();
          throw new Error(`Erro na requisição: ${errorText}`);
        }
        const dataColaboradores = await responseColaboradores.json();
        const responseAvaliacoes = await fetch('/api/getDadosAvaliacoes'); // Corrigido para o nome correto da API
        if (!responseAvaliacoes.ok) {
          // Exibe a resposta completa em formato texto para debugar
          const errorText = await response.text();
          throw new Error(`Erro na requisição: ${errorText}`);
        }
        const dataAvaliacoes = await responseAvaliacoes.json();
        setColaboradores(dataColaboradores.colaboradores);
        setAvaliacoes(dataAvaliacoes.avaliacoes);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Lógica de filtragem das avaliações
  useEffect(() => {
    if (!avaliacoes || avaliacoes.length === 0) {
      return; // Não faz nada se avaliacoes não estiver definido ou vazio
    }

    const ultimaAvaliacaoPorMatricula = {};

    avaliacoes.forEach((avaliacao) => {
      const avaliacaoExistente = ultimaAvaliacaoPorMatricula[avaliacao.matricula];
      if (
        !avaliacaoExistente ||
        new Date(avaliacao.data) > new Date(avaliacaoExistente.data) ||
        (
          new Date(avaliacao.data).getTime() === new Date(avaliacaoExistente.data).getTime() &&
          avaliacao.codigo > avaliacaoExistente.codigo
        )
      ) {
        ultimaAvaliacaoPorMatricula[avaliacao.matricula] = avaliacao;
      }
    });

    setAvaliacoesFiltradas(ultimaAvaliacaoPorMatricula);
  }, [avaliacoes]);

  // Renderização das tabelas com verificação
  const renderColaboradoresPorTurno = (turno) => {
    if (!colaboradores || colaboradores.length === 0) {
      return <tr><td colSpan="9">Carregando colaboradores...</td></tr>; // Mensagem enquanto carrega
    }
    
    return colaboradores
      .filter((colaborador) => colaborador.turno === turno)
      .map((colaborador) => {
        const avaliacao = avaliacoesFiltradas[colaborador.matricula] || {};
        return (
          <tr key={colaborador.matricula}>
            <td>{colaborador.matricula}</td>
            <td>{colaborador.nome}</td>
            <td>{avaliacao.data || 'N/A'}</td>
            <td>{avaliacao.pontualidade || 'N/A'}</td>
            <td>{avaliacao.atendimento || 'N/A'}</td>
            <td>{avaliacao.responsabilidade || 'N/A'}</td>
            <td>{avaliacao.autonomia || 'N/A'}</td>
            <td>{avaliacao.desafios || 'N/A'}</td>
            <td>{avaliacao.observacao || 'N/A'}</td>
          </tr>
        );
      });
  };

  // Manipulador de clique para mudar o turno ativo
  const handleTurnoClick = (turno) => {
    setTurnoAtivo(turno);
  };

  return (
    <div className={styles.tabMenu}>
      {/* Menu de Abas */}
      <div className={styles.tabMenu}>
        <button className={`${styles.tabLink} ${turnoAtivo === 'ADM' ? styles.active : ''}`} onClick={() => handleTurnoClick('ADM')}>ADM</button>
        <button className={`${styles.tabLink} ${turnoAtivo === '1' ? styles.active : ''}`} onClick={() => handleTurnoClick('1')}>Turno 1</button>
        <button className={`${styles.tabLink} ${turnoAtivo === '2' ? styles.active : ''}`} onClick={() => handleTurnoClick('2')}>Turno 2</button>
        <button className={`${styles.tabLink} ${turnoAtivo === '3' ? styles.active : ''}`} onClick={() => handleTurnoClick('3')}>Turno 3</button>
      </div>
      
      {/* Conteúdo da Aba Ativa */}
      <div className={styles.tabContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Data Avaliação</th>
              <th>Pontualidade</th>
              <th>Atendimento</th>
              <th>Responsabilidade</th>
              <th>Autonomia</th>
              <th>Desafios</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>{renderColaboradoresPorTurno(turnoAtivo)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default VisualizarColaborador;
