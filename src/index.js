import app from './app';

app.listen(app.get('port'), () => {
    console.log('Aplicación servida en', `http://127.0.0.1:${app.get('port')}`.blue);    
});