import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import styles from '../styles/VisualizarColaborador.module.css';

const VisualizarColaborador = ({ colaboradores, avaliacoes }) => {
  const [avaliacoesFiltradas, setAvaliacoesFiltradas] = useState({});

  // Filtrar as avaliações mais recentes por matrícula e, em caso de empate, pelo código do registro
  useEffect(() => {
    const ultimaAvaliacaoPorMatricula = {};
  
    avaliacoes.forEach((avaliacao) => {
      // Caso 'avaliacao' seja um array com um único objeto, acesse o primeiro item
      const avaliacaoItem = Array.isArray(avaliacao) ? avaliacao[0] : avaliacao;
  
      // Obter a avaliação existente para a matrícula, se houver
      const avaliacaoExistente = ultimaAvaliacaoPorMatricula[avaliacaoItem.matricula];

      // Verificar se deve substituir a avaliação existente
      if (
        !avaliacaoExistente || // Se não há avaliação existente
        new Date(avaliacaoItem.data) > new Date(avaliacaoExistente.data) || // Se a data da nova avaliação é mais recente
        (
          new Date(avaliacaoItem.data).getTime() === new Date(avaliacaoExistente.data).getTime() && 
          avaliacaoItem.codigo > avaliacaoExistente.codigo // Se as datas são iguais, usa o código para desempatar
        )
      ) {
        ultimaAvaliacaoPorMatricula[avaliacaoItem.matricula] = avaliacaoItem;
      }
    });
  
    setAvaliacoesFiltradas(ultimaAvaliacaoPorMatricula);
  }, [avaliacoes]);

  // Lógica para alternar entre as abas
  useEffect(() => {
    const openTab = (evt, tabId) => {
      document.querySelectorAll(`.${styles.tabContent}`).forEach((tabContent) => {
        tabContent.style.display = 'none';
      });

      document.querySelectorAll(`.${styles.tabLink}`).forEach((tabLink) => {
        tabLink.classList.remove(styles.tabLinkActive);
      });

      document.getElementById(tabId).style.display = 'block';
      evt.currentTarget.classList.add(styles.tabLinkActive);
    };

    const defaultTab = document.querySelector(`#${styles.turnoAdm}`);
    if (defaultTab) {
      defaultTab.click();
    }

    document.querySelectorAll(`.${styles.tabLink}`).forEach((button) => {
      button.addEventListener('click', (evt) => openTab(evt, button.dataset.tabId));
    });

    return () => {
      document.querySelectorAll(`.${styles.tabLink}`).forEach((button) => {
        button.removeEventListener('click', (evt) => openTab(evt, button.dataset.tabId));
      });
    };
  }, []);

  // Renderizar colaboradores por turno
  const renderColaboradoresPorTurno = (turno) => {
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

  return (
    <div className={styles.tabMenu}>
      {/* Menu de Abas */}
      <div className={styles.tabMenu}>
        <button id={styles.turnoAdm} className={styles.tabLink} data-tab-id="tab1">
          ADM
        </button>
        <button id={styles.turno1} className={styles.tabLink} data-tab-id="tab2">
          Turno 1
        </button>
        <button id={styles.turno2} className={styles.tabLink} data-tab-id="tab3">
          Turno 2
        </button>
        <button id={styles.turno3} className={styles.tabLink} data-tab-id="tab4">
          Turno 3
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div id="tab1" className={styles.tabContent}>
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
          <tbody>{renderColaboradoresPorTurno('ADM')}</tbody>
        </table>
      </div>

      <div id="tab2" className={styles.tabContent} style={{ display: 'none' }}>
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
          <tbody>{renderColaboradoresPorTurno('1')}</tbody>
        </table>
      </div>

      <div id="tab3" className={styles.tabContent} style={{ display: 'none' }}>
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
          <tbody>{renderColaboradoresPorTurno('2')}</tbody>
        </table>
      </div>

      <div id="tab4" className={styles.tabContent} style={{ display: 'none' }}>
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
          <tbody>{renderColaboradoresPorTurno('3')}</tbody>
        </table>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const colaboradoresPath = path.join(process.cwd(), 'public', 'data', 'colaboradores.json');
  const avaliacoesPath = path.join(process.cwd(), 'public', 'data', 'avaliacoes.json');

  const colaboradoresData = fs.readFileSync(colaboradoresPath, 'utf-8');
  const avaliacoesData = fs.readFileSync(avaliacoesPath, 'utf-8');

  const colaboradores = JSON.parse(colaboradoresData).colaboradores;
  const avaliacoes = JSON.parse(avaliacoesData);

  return {
    props: {
      colaboradores,
      avaliacoes,
    },
  };
};

export default VisualizarColaborador;
