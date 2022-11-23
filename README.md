# ENCOINFO 2022

## Microsserviços com NodeJS

### Microsserviço de Cursos

Acesse:
```
cd cursos
```

Execute:
```
npm install
```

Criar as tabelas
```
npx knex migrate:latest --knexfile ./banco/knexfile.js
```

Preencher as tabelas com dados de exemplo
```
npx knex seed:run --knexfile ./banco/knexfile.js
```

Executar o servidor
```
npx nodemon app.js
```