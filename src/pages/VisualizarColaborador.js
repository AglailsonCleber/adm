import React, { useEffect, useState } from 'react';
import styles from '../styles/VisualizarColaborador.module.css';

const VisualizarColaborador = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacoesFiltradas, setAvaliacoesFiltradas] = useState({});
  const [turnoAtivo, setTurnoAtivo] = useState('ADM');
  const [isMobile, setIsMobile] = useState(false);

  // Verifica se é um dispositivo móvel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1115); // Altera o limite para 1115px
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica no primeiro carregamento
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fazer a requisição à API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseColaboradores = await fetch('/api/getDadosColaboradores');
        const dataColaboradores = await responseColaboradores.json();
        const responseAvaliacoes = await fetch('/api/getDadosAvaliacoes');
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
      return;
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

  // Renderização dos colaboradores por turno
  const renderColaboradoresPorTurno = (turno) => {
    if (!colaboradores || colaboradores.length === 0) {
      return <tr><td colSpan="9">Carregando colaboradores...</td></tr>;
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
    <div className={styles.container}>
      <div className={`${styles.tabMenu} ${isMobile ? styles.tabMenuMobile : styles.tabMenuDesktop}`}>
        {/* Menu de Abas */}
        <button className={`${styles.tabLink} ${turnoAtivo === 'ADM' ? styles.tabLinkActive : ''}`} onClick={() => handleTurnoClick('ADM')}>ADM</button>
        <button className={`${styles.tabLink} ${turnoAtivo === '1' ? styles.tabLinkActive : ''}`} onClick={() => handleTurnoClick('1')}>Turno 1</button>
        <button className={`${styles.tabLink} ${turnoAtivo === '2' ? styles.tabLinkActive : ''}`} onClick={() => handleTurnoClick('2')}>Turno 2</button>
        <button className={`${styles.tabLink} ${turnoAtivo === '3' ? styles.tabLinkActive : ''}`} onClick={() => handleTurnoClick('3')}>Turno 3</button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className={styles.tabContent}>
        {isMobile ? (
          // Renderização vertical para dispositivos móveis
          colaboradores.filter(colaborador => colaborador.turno === turnoAtivo).map(colaborador => {
            const avaliacao = avaliacoesFiltradas[colaborador.matricula] || {};
            return (
              <div key={colaborador.matricula} className={styles.mobileCard}>
                <h3>{colaborador.nome}</h3>
                <p><strong>Matrícula:</strong> {colaborador.matricula}</p>
                <p><strong>Data Avaliação:</strong> {avaliacao.data || 'N/A'}</p>
                <p><strong>Pontualidade:</strong> {avaliacao.pontualidade || 'N/A'}</p>
                <p><strong>Atendimento:</strong> {avaliacao.atendimento || 'N/A'}</p>
                <p><strong>Responsabilidade:</strong> {avaliacao.responsabilidade || 'N/A'}</p>
                <p><strong>Autonomia:</strong> {avaliacao.autonomia || 'N/A'}</p>
                <p><strong>Desafios:</strong> {avaliacao.desafios || 'N/A'}</p>
                <p><strong>Observação:</strong> {avaliacao.observacao || 'N/A'}</p>
              </div>
            );
          })
        ) : (
          // Renderização horizontal para desktop
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
        )}
      </div>
    </div>
  );
};

export default VisualizarColaborador;
