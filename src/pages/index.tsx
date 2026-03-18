import React from 'react';
import { SofiaAvatar } from '../components/SofiaAvatar';

export default function Home() {
  return (
    <main className="container">
      <header>
        <h1>Humanos Digitais</h1>
        <p>Plataforma de Avatares IA Inteligentes</p>
      </header>

      <section className="hero">
        <h2>Converse com Sofia</h2>
        <p>Nossa IA host principal, especializada em engajamento e conversão</p>
        
        <SofiaAvatar
          onResponse={(response) => {
            console.log('Sofia responded:', response);
          }}
        />
      </section>

      <section className="features">
        <h2>Recursos</h2>
        <ul>
          <li>✨ Avatares IA com sincronização de lábios</li>
          <li>🎯 Personalização de personas</li>
          <li>📊 Analytics de engajamento</li>
          <li>🔗 Integração com redes sociais</li>
        </ul>
      </section>
    </main>
  );
}
