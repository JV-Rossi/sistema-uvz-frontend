import Dexie from 'dexie';

export const db = new Dexie('AppUVZ_OfflineDB');

db.version(1).stores({
    // 1. A Gaveta: Guarda as fichas que o ACE fez na rua, mas ainda não botou na grade.
    fichas_soltas: '++id, titular_login',
    
    // 2. O Malote: Guarda o resumão da semana inteira depois que ele clica no botão verde.
    resumos_pendentes_envio: '++id, titular_login, status'
});

db.on('ready', () => {
    console.log('✅ Banco de dados local pronto para o Resumo Semanal!');
});