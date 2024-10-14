"use client";

import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openIframe = (src: string) => {
    setIframeSrc(src);
    closeMenu(); // Fecha o menu ao abrir um iframe
  };

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ADM</title>
      </Head>

      <header className={styles.header}>
      <div className={styles.buttonContainer}>
        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.preventDefault();
            openIframe('./VisualizarColaborador');
          }}
        >
          Visualizar Dados
        </button>
        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.preventDefault();
            openIframe('./AdicionarAvaliacoes');
          }}
        >
          Adicionar Dados
        </button>
      </div>
        <button className={styles.openbtn} onClick={openMenu}>
          ☰ Menu
        </button>
        <h1 className={styles.title}>Avaliação de Desempenho da Manutenção</h1>
      </header>

      <div className={`${styles.sidemenu} ${menuOpen ? styles.open : ''}`}>
        <a
          className={styles.closebtn}
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
          }}
        >
          &times;
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            openIframe('./VisualizarColaborador');
          }}
        >
          Visualizar Dados
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            openIframe('./AdicionarAvaliacoes');
          }}
        >
          Adicionar Dados
        </a>
      </div>

      <div id="main-content" className={styles.mainContent}>
        {iframeSrc ? (
          <iframe
            id="content-frame"
            src={iframeSrc}
            frameBorder="0"
            style={{ width: '100%', height: '100%' }} // Adicionando estilos para o iframe
          />
        ) : (
          <p>Selecione uma opção no menu para visualizar os dados.</p> // Mensagem quando não há iframe
        )}
      </div>
    </div>
  );
}
