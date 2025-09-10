import React from 'react';
import ReactDOM from 'react-dom/client';
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import App from './App';

// Import des styles DSFR
import "@codegouvfr/react-dsfr/main.css";

startReactDsfr({
  defaultColorScheme: "system",
  Link: ({ href, ...props }: any) => <a href={href} {...props} />,
  useLang: () => "fr"
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);