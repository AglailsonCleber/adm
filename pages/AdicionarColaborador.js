import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/AdicionarColaborador.module.css'; // Crie um arquivo CSS para estilizar

export default function AdicionarColaborador() {
  const [colaboradores, setColaboradores] = useState([]);
  const [turno, setTurno] = useState('ADM');
  const [avaliacoes, setAvaliacoes] = useState({});

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
      const colaboradores = await lerJson('/data/colaboradores.json'); // Certifique-se de que o caminho esteja correto
      const colaboradoresFiltrados = colaboradores.filter(c => c.turno === turno);
      setColaboradores(colaboradoresFiltrados);
      
      // Inicializar o estado das avaliações
      const avaliacoesIniciais = {};
      colaboradoresFiltrados.forEach(colaborador => {
        avaliacoesIniciais[colaborador.matricula] = {
          pontualidade: '',
          atendimento: '',
          responsabilidade: '',
          autonomia: '',
          desafios: '',
          observacao: '',
          alterado: false // Adicionando a propriedade 'alterado'
        };
      });
      setAvaliacoes(avaliacoesIniciais);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
    }
  };

  // Atualiza os formulários ao mudar o turno
  useEffect(() => {
    gerarFormularios(turno);
  }, [turno]);

  // Função para salvar as avaliações
  const salvarAvaliacoes = useCallback(async () => {
    // Obter as avaliações existentes para encontrar o próximo código
    let ultimoCodigo = 0;
    try {
      const response = await fetch('/data/avaliacoes.json'); // Certifique-se de que o caminho esteja correto
      if (response.ok) {
        const avaliacoesExistentes = await response.json();
        // Encontrar o maior código atual
        ultimoCodigo = Math.max(0, ...avaliacoesExistentes.map(avaliacao => parseInt(avaliacao.codigo, 10)));
      } else {
        console.error('Não foi possível carregar as avaliações existentes.');
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações existentes:', error);
    }
  
    // Obter a data atual no formato 'YYYY/MM/DD'
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getFullYear()}/${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataAtual.getDate().toString().padStart(2, '0')}`;
  
    // Filtrar avaliações que foram alteradas
    const avaliacoesParaSalvar = Object.keys(avaliacoes)
      .map(matricula => ({
        matricula,
        ...avaliacoes[matricula]
      }))
      .filter(avaliacao => avaliacao.alterado); // Apenas incluir as avaliações alteradas
  
    if (avaliacoesParaSalvar.length === 0) {
      alert('Nenhuma alteração detectada para salvar.');
      return;
    }
  
    // Remover a propriedade 'alterado' e adicionar 'codigo' e 'data' antes de enviar
    const avaliacoesFiltradas = avaliacoesParaSalvar.map((avaliacao, index) => {
      const { alterado, ...dadosSemAlterado } = avaliacao; // Desestruturando para remover 'alterado'
      return {
        codigo: (ultimoCodigo + index + 1).toString(), // Definir o próximo código
        data: dataFormatada, // Adicionar a data atual
        ...dadosSemAlterado
      };
    });
  
    try {
      const response = await fetch('/api/salvar-avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(avaliacoesFiltradas), // Enviando dados com 'codigo' e 'data'
      });
  
      if (response.ok) {
        alert('Avaliações salvas com sucesso!');
        // Resetar os valores das avaliações
        await gerarFormularios(turno); // Recarregar os colaboradores do turno selecionado
      } else {
        alert('Erro ao salvar avaliações.');
      }
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
    }
  }, [avaliacoes, turno]);
  
  // Função para lidar com as mudanças nos campos de avaliação
  const handleChange = (matricula, campo, valor) => {
    setAvaliacoes(prevAvaliacoes => ({
      ...prevAvaliacoes,
      [matricula]: {
        ...prevAvaliacoes[matricula],
        [campo]: valor,
        alterado: true // Marcar como alterado sempre que houver mudança
      }
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
        {colaboradores.map(colaborador => (
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
              name={`observacao-${colaborador.matricula}`}
              rows="4"
              cols="50"
              className={styles.observacaoInput}
              value={avaliacoes[colaborador.matricula]?.observacao || ''}
              onChange={(e) => handleChange(colaborador.matricula, 'observacao', e.target.value)}
            ></textarea>
          </div>
        ))}
      </div>

      <button onClick={salvarAvaliacoes} className={styles.salvarBtn}>Salvar Avaliações</button>
    </div>
  );
}
