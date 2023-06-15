function selectAvatar(element){
    document.getElementById('selectedAvatar').src = element.src;
    document.getElementById('selectedAvatarLabel').innerHTML = element.title;
}


function saveChanges(){

    Swal.fire({
        title: 'Guardando...',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: ()=>{Swal.showLoading()},
        willClose: () => {Swal.hideLoading()}
    });  

    let avatar = document.getElementById('selectedAvatar').src;
    let name = document.getElementById('name').value;
    let type = document.getElementById('type').value;

    let profileId = document.getElementById('profileId').value;

    fetch('/profiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            avatar,
            name,
            type,
            profileId
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.type != 'success') throw data;
        Swal.fire({
            title: data.title,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        })
        .then(() => {
            window.location.href = '/profiles';
        })
    })
    .catch(err => {
        console.log(err);
        Swal.fire({
            title: err.title || 'Error',
            text: err.message || 'Error desconocido',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
    })
}

document.getElementById('profileForm').addEventListener('submit', e => {
    e.preventDefault();
    saveChanges();
});