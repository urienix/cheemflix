function deleteProfile(profileId, profileName){
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará el perfil " + profileName + " y no se podrá recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        reverseButtons: true
    })
    .then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando...',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: ()=>{Swal.showLoading()},
                willClose: () => {Swal.hideLoading()}
            });
            fetch('/profiles', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
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
    })
}