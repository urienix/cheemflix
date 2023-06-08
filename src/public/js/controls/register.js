function register(){
    let fullname = document.getElementById('fullnameInput');
    let email = document.getElementById('emailInput');
    let password = document.getElementById('passwordInput');
    let repassword = document.getElementById('passwordConfirmInput');

    let registerError = document.getElementById('registerErrorMessage');

    let registerButton = document.getElementById('registerFormButton');

    // Button and input disabling during the request
    registerButton.setAttribute('disabled', 'true');
    registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden"> &nbsp; Registrando...</span>';

    fullname.setAttribute('disabled', 'true');
    email.setAttribute('disabled', 'true');
    password.setAttribute('disabled', 'true');
    repassword.setAttribute('disabled', 'true');

    if (!registerError.getAttribute('hidden')) registerError.setAttribute('hidden', true);

    if(fullname.value.length < 3){
        registerError.innerHTML = 'El nombre debe tener al menos 3 caracteres';
        return;
    }

    if(email.value.length < 3){
        registerError.innerHTML = 'El email debe tener al menos 3 caracteres';
        return;
    }

    if(password.value.length < 5){
        registerError.innerHTML = 'La contraseña debe tener al menos 5 caracteres';
        return;
    }

    if(password.value != repassword.value){
        registerError.innerHTML = 'Las contraseñas no coinciden';
        return;
    }

    let data = {
        fullname: fullname.value,
        email: email.value,
        password: password.value,
        repassword: repassword.value
    };

    fetch('/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        if(res.type === 'success'){
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Se ha enviado un correo de verificación a tu email',
                icon: 'success',
                confirmButtonText: 'Confirmar',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                location.href = '/login';
            })
        }else{
            throw res;
        }
    }).catch(err => {
        console.log(err);
        if(err.title){
            registerError.innerHTML = err.title;
        }else{
            registerError.innerHTML = 'Error desconocido';
        }
        registerError.removeAttribute('hidden');
        registerButton.removeAttribute('disabled');
        registerButton.innerHTML = 'Registrarse';
        fullname.removeAttribute('disabled');
        email.removeAttribute('disabled');
        password.removeAttribute('disabled');
        repassword.removeAttribute('disabled');
    });
}

document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    register();
});