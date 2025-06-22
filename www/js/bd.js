// js/db.js

const DB_NAME = 'CalculadoraDB';
const DB_VERSION = 1;
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Cria a "tabela" de usuários se não existir
            if (!db.objectStoreNames.contains('users')) {
                const usersStore = db.createObjectStore('users', { keyPath: 'username' });
                // Cria um usuário padrão para demonstração
                usersStore.transaction.oncomplete = () => {
                    const transaction = db.transaction('users', 'readwrite');
                    const store = transaction.objectStore('users');
                    store.add({ username: 'admin', password: '1234' }); 
                };
            }

            // Cria a "tabela" de projetos se não existir
            if (!db.objectStoreNames.contains('projects')) {
                db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Banco de dados aberto com sucesso.');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("Banco de dados não inicializado.");
            return;
        }
        const transaction = db.transaction('users', 'readonly');
        const store = transaction.objectStore('users');
        const request = store.get(username);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            reject('Erro ao buscar usuário:', event.target.errorCode);
        };
    });
}