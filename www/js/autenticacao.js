// js/auth.js

document.addEventListener('DOMContentLoaded', async () => {
    // Se estamos na página de dashboard, verifica se o usuário está logado
    if (document.body.classList.contains('dashboard-container')) {
        checkAuth();
    }

    // Se estamos no login, inicializa o DB e o formulário
    if (document.getElementById('login-form')) {
        await initDB();
        
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    console.log("1. Botão 'Entrar' clicado. Função handleLogin iniciada.");

    const username = event.target.username.value;
    const password = event.target.password.value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = ''; // Limpa erros antigos

    console.log(`2. Tentando logar com usuário: '${username}'`);

    try {
        console.log("3. Chamando a função getUser do bd.js...");
        const user = await getUser(username);
        console.log("4. Resposta recebida do getUser:", user);

        if (user && user.password === password) {
            console.log("5. Usuário e senha CORRETOS. Redirecionando para o dashboard...");
            sessionStorage.setItem('loggedInUser', username);
            window.location.href = 'dashboard.html';
        } else {
            console.error("ERRO DE LÓGICA: Usuário não encontrado ou senha incorreta.");
            errorEl.textContent = 'Usuário ou senha inválidos.';
        }
    } catch (error) {
        console.error("ERRO CRÍTICO: Ocorreu uma exceção no bloco try/catch.", error);
        errorEl.textContent = 'Ocorreu um erro inesperado ao tentar fazer login.';
    }
}

function checkAuth() {
    const user = sessionStorage.getItem('loggedInUser');
    if (!user) {
        // Se não há usuário logado na sessão, redireciona para o login
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}