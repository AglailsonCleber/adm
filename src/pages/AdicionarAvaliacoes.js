import React, { useEffect, useState, useCallback } from 'react';
import styles from '../styles/AdicionarAvaliacoes.module.css';

export default function AdicionarAvaliacoes() {
  const [colaboradores, setColaboradores] = useState([]); // Colaboradores originais
  const [colaboradoresFiltrados, setColaboradoresFiltrados] = useState([]); // Colaboradores filtrados
  const [avaliacoes, setAvaliacoes] = useState([]); // Avaliações dos colaboradores
  const [turno, setTurno] = useState('ADM'); // Estado para o turno selecionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getDadosColaboradores');
        const data = await response.json();
        setColaboradores(data.colaboradores);
        setColaboradoresFiltrados(data.colaboradores); // Inicializa com todos os colaboradores
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const gerarFormularios = async (turno) => {
    // Filtra os colaboradores com base no turno
    const colaboradoresFiltrados = colaboradores.filter(c => c.turno === turno);
    setColaboradoresFiltrados(colaboradoresFiltrados);

    const avaliacoesIniciais = {};
    colaboradoresFiltrados.forEach(colaborador => {
      avaliacoesIniciais[colaborador.matricula] = {
        pontualidade: '',
        atendimento: '',
        responsabilidade: '',
        autonomia: '',
        desafios: '',
        observacao: '',
        alterado: false,
      };
    });
    setAvaliacoes(avaliacoesIniciais);
  };

  useEffect(() => {
    gerarFormularios(turno);
  }, [turno, colaboradores]); // Adicione colaboradores como dependência para garantir que as avaliações sejam geradas corretamente

  const salvarAvaliacoes = useCallback(async () => {
    const avaliacoesParaSalvar = Object.keys(avaliacoes)
      .map(matricula => ({
        matricula,
        ...avaliacoes[matricula],
      }))
      .filter(avaliacao => avaliacao.alterado);

    if (avaliacoesParaSalvar.length === 0) {
      alert('Nenhuma alteração detectada para salvar.');
      return;
    }

    try {
      const response = await fetch('/api/salvarAvaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avaliacoes: avaliacoesParaSalvar, turno }),
      });

      if (response.ok) {
        alert('Avaliações salvas com sucesso!');
        await gerarFormularios(turno); // Gera os formulários novamente após salvar
      } else {
        alert('Erro ao salvar avaliações.');
      }
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
    }
  }, [avaliacoes, turno]);

  const handleChange = (matricula, campo, valor) => {
    setAvaliacoes(prevAvaliacoes => ({
      ...prevAvaliacoes,
      [matricula]: {
        ...prevAvaliacoes[matricula],
        [campo]: valor,
        alterado: true,
      },
    }));
  };

  return (
    <div>
      <h1>Preenchimento Rápido - Avaliação de Colaboradores</h1>
      <div className={styles.turnoSelect}>
        <label htmlFor="turno">Selecione o Turno:</label>
        <select id="turno" value={turno} onChange={(e) => setTurno(e.target.value)}>
          <option value="ADM">ADM</option>
          <option value="1">Primeiro Turno</option>
          <option value="2">Segundo Turno</option>
          <option value="3">Terceiro Turno</option>
        </select>
      </div>

      <div id="colaboradoresContainer">
        {colaboradoresFiltrados.map(colaborador => (
          <div key={colaborador.matricula} className={styles.colaboradorForm}>
            <h3>{colaborador.nome} - Matrícula: {colaborador.matricula}</h3>

            <label className={styles.customLabel}>Pontualidade:</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name={`pontualidade-${colaborador.matricula}`} value="Sim"
                  checked={avaliacoes[colaborador.matricula]?.pontualidade === 'Sim'}
                  onChange={() => handleChange(colaborador.matricula, 'pontualidade', 'Sim')}
                />
                Sim
              </label>
              <label>
                <input type="radio" name={`pontualidade-${colaborador.matricula}`} value="Não"
                  checked={avaliacoes[colaborador.matricula]?.pontualidade === 'Não'}
                  onChange={() => handleChange(colaborador.matricula, 'pontualidade', 'Não')}
                />
                Não
              </label>
            </div>

            <label className={styles.customLabel}>Atendimento:</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name={`atendimento-${colaborador.matricula}`} value="Excelente"
                  checked={avaliacoes[colaborador.matricula]?.atendimento === 'Excelente'}
                  onChange={() => handleChange(colaborador.matricula, 'atendimento', 'Excelente')}
                />
                Excelente
              </label>
              <label>
                <input type="radio" name={`atendimento-${colaborador.matricula}`} value="Regular"
                  checked={avaliacoes[colaborador.matricula]?.atendimento === 'Regular'}
                  onChange={() => handleChange(colaborador.matricula, 'atendimento', 'Regular')}
                />
                Regular
              </label>
              <label>
                <input type="radio" name={`atendimento-${colaborador.matricula}`} value="Ruim"
                  checked={avaliacoes[colaborador.matricula]?.atendimento === 'Ruim'}
                  onChange={() => handleChange(colaborador.matricula, 'atendimento', 'Ruim')}
                />
                Ruim
              </label>
            </div>

            <label className={styles.customLabel}>Responsabilidade:</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name={`responsabilidade-${colaborador.matricula}`} value="Sim"
                  checked={avaliacoes[colaborador.matricula]?.responsabilidade === 'Sim'}
                  onChange={() => handleChange(colaborador.matricula, 'responsabilidade', 'Sim')}
                />
                Sim
              </label>
              <label>
                <input type="radio" name={`responsabilidade-${colaborador.matricula}`} value="Não"
                  checked={avaliacoes[colaborador.matricula]?.responsabilidade === 'Não'}
                  onChange={() => handleChange(colaborador.matricula, 'responsabilidade', 'Não')}
                />
                Não
              </label>
            </div>

            <label className={styles.customLabel}>Autonomia:</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name={`autonomia-${colaborador.matricula}`} value="Sim"
                  checked={avaliacoes[colaborador.matricula]?.autonomia === 'Sim'}
                  onChange={() => handleChange(colaborador.matricula, 'autonomia', 'Sim')}
                />
                Sim
              </label>
              <label>
                <input type="radio" name={`autonomia-${colaborador.matricula}`} value="Não"
                  checked={avaliacoes[colaborador.matricula]?.autonomia === 'Não'}
                  onChange={() => handleChange(colaborador.matricula, 'autonomia', 'Não')}
                />
                Não
              </label>
            </div>

            <label className={styles.customLabel}>Desafios:</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name={`desafios-${colaborador.matricula}`} value="Sim"
                  checked={avaliacoes[colaborador.matricula]?.desafios === 'Sim'}
                  onChange={() => handleChange(colaborador.matricula, 'desafios', 'Sim')}
                />
                Sim
              </label>
              <label>
                <input type="radio" name={`desafios-${colaborador.matricula}`} value="Não"
                  checked={avaliacoes[colaborador.matricula]?.desafios === 'Não'}
                  onChange={() => handleChange(colaborador.matricula, 'desafios', 'Não')}
                />
                Não
              </label>
              <label>
                <input type="radio" name={`desafios-${colaborador.matricula}`} value="N/A"
                  checked={avaliacoes[colaborador.matricula]?.desafios === 'N/A'}
                  onChange={() => handleChange(colaborador.matricula, 'desafios', 'N/A')}
                />
                N/A
              </label>
            </div>

            <label className={styles.customLabel}>Observação:</label>
            <textarea
              value={avaliacoes[colaborador.matricula]?.observacao || ''}
              onChange={(e) => handleChange(colaborador.matricula, 'observacao', e.target.value)}
              rows="3"
              placeholder="Adicione uma observação..."
            />
          </div>
        ))}
      </div>

      <button className={styles.salvarBtn} onClick={salvarAvaliacoes}>Salvar Avaliações</button>
    </div>
  );
}
