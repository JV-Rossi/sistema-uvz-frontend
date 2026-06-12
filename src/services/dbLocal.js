import Dexie from 'dexie';

// 1. Damos um nome para o banco de dados do tablet
export const db = new Dexie('AppUVZ_OfflineDB');

// 2. Criamos as tabelas (stores) e definimos os índices de pesquisa
db.version(1).stores({
    // A tabela 'boletins_pendentes' vai guardar a produção do dia.
    // O '++id' significa que o próprio Dexie vai gerar um ID automático (1, 2, 3...)
    // Os outros nomes são os campos pelos quais você talvez queira fazer buscas rápidas depois.
    boletins_pendentes: '++id, data, bairro, ciclo, titular',
    
    // No futuro, se quiser salvar dados de apoio offline, podemos adicionar aqui:
    // cache_bairros: 'nome',
    // cache_equipe: 'login'
});

// Mensagem opcional para debugar e ter certeza que conectou
db.on('ready', () => {
    console.log('✅ Banco de dados local (Dexie) pronto para uso!');
});