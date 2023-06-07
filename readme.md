## Recuerda generar las llaves publicas y privadas en rsa

### llave privada
```bash
openssl genrsa -out rs256-4096-private.rsa 4096
```

### llave publica
```bash
openssl rsa -in rs256-4096-private.rsa -pubout > rs256-4096-public.pem
```