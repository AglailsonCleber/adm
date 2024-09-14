import React, { useEffect } from 'react';
import styles from '../styles/VisualizarColaborador.module.css'; // Importe o CSS Module específico

const VisualizarColaborador = () => {
  useEffect(() => {
    const openTab = (evt, tabId) => {
      document.querySelectorAll(`.${styles.tabContent}`).forEach(tabContent => {
        tabContent.style.display = 'none';
      });

      document.querySelectorAll(`.${styles.tabLink}`).forEach(tabLink => {
        tabLink.classList.remove(styles.tabLinkActive);
      });

      document.getElementById(tabId).style.display = 'block';
      evt.currentTarget.classList.add(styles.tabLinkActive);
    };

    // Aguarde o DOM estar pronto antes de selecionar o elemento
    const defaultTab = document.querySelector(`#${styles.turnoAdm}`);
    if (defaultTab) {
      defaultTab.click();
    }

    document.querySelectorAll(`.${styles.tabLink}`).forEach(button => {
      button.addEventListener('click', (evt) => openTab(evt, button.dataset.tabId));
    });

    return () => {
      document.querySelectorAll(`.${styles.tabLink}`).forEach(button => {
        button.removeEventListener('click', (evt) => openTab(evt, button.dataset.tabId));
      });
    };
  }, []);

  return (
    <div className={styles.tabMenu}>
      {/* Menu de Abas */}
      <div className={styles.tabMenu}>
        <button id={styles.turnoAdm} className={styles.tabLink} data-tab-id="tab1">ADM</button>
        <button id={styles.turno1} className={styles.tabLink} data-tab-id="tab2">Turno 1</button>
        <button id={styles.turno2} className={styles.tabLink} data-tab-id="tab3">Turno 2</button>
        <button id={styles.turno3} className={styles.tabLink} data-tab-id="tab4">Turno 3</button>
      </div>

      {/* Conteúdos das Abas */}
      <div id="tab1" className={styles.tabContent}>
        {/* Conteúdo da Aba 1 */}
        <table className={styles.table}>
          {/* Tabela será preenchida pelo JS */}
        </table>
      </div>

      {/* Outras abas */}
      <div id="tab2" className={styles.tabContent} style={{ display: 'none' }}>
        <h2>Conteúdo da Aba 2</h2>
        <p>Este é o conteúdo da segunda aba.</p>
      </div>

      <div id="tab3" className={styles.tabContent} style={{ display: 'none' }}>
        <h2>Conteúdo da Aba 3</h2>
        <p>Este é o conteúdo da terceira aba.</p>
      </div>

      <div id="tab4" className={styles.tabContent} style={{ display: 'none' }}>
        <h2>Conteúdo da Aba 4</h2>
        <p>Este é o conteúdo da quarta aba.</p>
      </div>
    </div>
  );
};

export default VisualizarColaborador;
