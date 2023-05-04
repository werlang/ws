# Roteiro 1: Multi Serviços

## Para subir os containers:

```bash
docker compose -f docker-compose.yml up -d

```

## Serviço Web

Acessível em http://aulaws.localhost

O serviço *nginx* está configurado para responder a requisições para o domínio `aulaws.localhost` e encaminhar para o serviço `web` (porta 3000).

Para testart a integração com o serviço `api`, digite algo na caixa de texto e clique no botão `Click me`. A rota `GET /greeting` do serviço `api` será chamada e o resultado será exibido na tela.

## Serviço API

Acessível em http://api.aulaws.localhost

O serviço *nginx* está configurado para responder a requisições para o domínio `api.aulaws.localhost` e encaminhar para o serviço `api` (porta 3001).

Este serviço possui as seguintes rotas:

- `GET /greeting` - Retorna uma mensagem de boas vindas
- `GET /counter` - Retorna o valor atual do contador (Veja serviço `background`)
- `POST /user` - Cria um novo usuário, inserindo-o na tabela do banco de dados. Envie no `body` da requisição um JSON com o seguinte formato:
    
    ```json
    {
        "name": "João",
    }
    ```
- `GET /user/:name` - Retorna o usuário com o nome especificado na URL. Exemplo: `/user/João`

## Serviço MySQL

Serviço de banco de dados MySQL. Ao criar a imagem, o banco de dados `aulaws` é criado e a tabela `user` é criada com a seguinte estrutura:

```sql
CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
```

O Serviço `api` está configurado para se conectar a este banco de dados (Teste usando as rotas `POST /user` e `GET /user/:name`).

## Serviço Redis

Serviço de banco de dados Redis. O serviço `background` está configurado para se conectar a este banco de dados (Teste usando a rota `GET /counter`).

## Serviço Background

Serviço que executa um script em que incrementa o valor do contador a cada segundo. O valor do contador é armazenado no banco de dados Redis.

O valor do contador pode ser obtido através da rota `GET /counter` do serviço `api`.

## Para derrubar os containers:

```bash
docker compose -f docker-compose-basic.yml down
```
