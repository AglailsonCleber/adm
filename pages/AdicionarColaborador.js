// pages/adicionarcolaborador.js
import { useState, useEffect } from 'react';
import styles from '../styles/AdicionarColaborador.module.css'; // Crie um arquivo CSS para estilizar

export default function AdicionarColaborador() {
  const [colaboradores, setColaboradores] = useState([]);
  const [turno, setTurno] = useState('ADM');
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Função para ler o JSON de colaboradores
  const lerJson = async (local) => {
    try {
      const response = await fetch(local);
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }
      const data = await response.json();
      return data.colaboradores;
    } catch (error) {
      console.error("Erro ao ler JSON:", error);
      throw error;
    }
  };

  // Função para gerar os formulários para os colaboradores filtrados por turno
  const gerarFormularios = async (turno) => {
    try {
      const colaboradores = await lerJson('/db/colaboradores.json'); // Certifique-se de que o caminho esteja correto
      const colaboradoresFiltrados = colaboradores.filter(c => c.turno === turno);
      setColaboradores(colaboradoresFiltrados);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
    }
  };

  // Função para salvar as avaliações
  const salvarAvaliacoes = () => {
    const avaliacoes = colaboradores.map(colaborador => ({
      matricula: colaborador.matricula,
      pontualidade: document.querySelector(`input[name="pontualidade-${colaborador.matricula}"]:checked`)?.value || '',
      atendimento: document.querySelector(`input[name="atendimento-${colaborador.matricula}"]:checked`)?.value || '',
      responsabilidade: document.querySelector(`input[name="responsabilidade-${colaborador.matricula}"]:checked`)?.value || '',
      desafios: document.querySelector(`input[name="desafios-${colaborador.matricula}"]:checked`)?.value || ''
    }));
    setAvaliacoes(avaliacoes);
    console.log(avaliacoes); // Aqui você pode enviar os dados via fetch para salvar no backend
    alert("Avaliações salvas com sucesso!");
  };

  // Atualiza os formulários ao mudar o turno
  useEffect(() => {
    gerarFormularios(turno);
  }, [turno]);

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
        {colaboradores.map(colaborador => (
          <div key={colaborador.matricula} className={styles.colaboradorForm}>
            <h3>{colaborador.nome} - Matrícula: {colaborador.matricula}</h3>
            <label className={styles.customLabel}>Pontualidade:</label>
            <div className={styles.radioGroup}>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input type="radio" name={`pontualidade-${colaborador.matricula}`} value={value} />
                  {value}
                </label>
              ))}
            </div>
            <label>Atendimento:</label>
            <div className={styles.radioGroup}>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input type="radio" name={`atendimento-${colaborador.matricula}`} value={value} />
                  {value}
                </label>
              ))}
            </div>
            <label>Responsabilidade:</label>
            <div className={styles.radioGroup}>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input type="radio" name={`responsabilidade-${colaborador.matricula}`} value={value} />
                  {value}
                </label>
              ))}
            </div>
            <label>Desafios:</label>
            <div className={styles.radioGroup}>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input type="radio" name={`desafios-${colaborador.matricula}`} value={value} />
                  {value}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={salvarAvaliacoes} className={styles.salvarBtn}>Salvar Avaliações</button>
    </div>
  );
}

const salvarAvaliacoes = async () => {
    const avaliacoes = colaboradores.map(colaborador => ({
      matricula: colaborador.matricula,
      pontualidade: document.querySelector(`input[name="pontualidade-${colaborador.matricula}"]:checked`)?.value || '',
      atendimento: document.querySelector(`input[name="atendimento-${colaborador.matricula}"]:checked`)?.value || '',
      responsabilidade: document.querySelector(`input[name="responsabilidade-${colaborador.matricula}"]:checked`)?.value || '',
      desafios: document.querySelector(`input[name="desafios-${colaborador.matricula}"]:checked`)?.value || ''
    }));
  
    try {
      const response = await fetch('/api/salvar-avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(avaliacoes),
      });
      
      if (response.ok) {
        alert('Avaliações salvas com sucesso!');
      } else {
        alert('Erro ao salvar avaliações.');
      }
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
    }
};