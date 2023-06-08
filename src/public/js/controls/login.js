function login(){
    let email = document.getElementById('emailInput');
    let password = document.getElementById('passwordInput');
    let remember = document.getElementById('rememberCheck');
    let loginButton = document.getElementById('loginButton');
    let errorMessage = document.getElementById('loginErrorMessage');

     // Button and input disabling during the request
     loginButton.setAttribute('disabled', 'true');
     loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden"> &nbsp; Iniciando...</span>';
 
     email.setAttribute('disabled', 'true');
     password.setAttribute('disabled', 'true');
     remember.setAttribute('disabled', 'true');

     if (!errorMessage.getAttribute('hidden')) errorMessage.setAttribute('hidden', true);
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            email: email.value.trim(), 
            password: password.value.trim(),
            remember: remember.checked
        })
    })
    .then( async res => {
        if (res.ok) {
            if (res.redirected) {
                setTimeout(() => {
                    location.href = res.url;
                }, 500);
            }
        }else{
            throw (await res.json());
        }
    })
    .catch(err => {
        console.log(err);
        if (err.title) {
            errorMessage.innerHTML = err.title;
        }else{
            errorMessage.innerHTML = 'Error desconocido';
        }
        errorMessage.removeAttribute('hidden');
        loginButton.removeAttribute('disabled');
        loginButton.innerHTML = 'Iniciar sesión';
        email.removeAttribute('disabled');
        password.removeAttribute('disabled');
        remember.removeAttribute('disabled');
    });
}

document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    login();
});