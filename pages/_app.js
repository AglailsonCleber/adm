// pages/_app.js
import '../styles/globals.css'; // Importe o CSS global
import '../styles/Home.module.css'; // Importe o CSS específico da Home, se necessário

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
