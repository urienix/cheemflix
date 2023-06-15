function selectAvatar(element){
    document.getElementById('selectedAvatar').src = element.src;
    document.getElementById('selectedAvatarLabel').innerHTML = element.title;
}