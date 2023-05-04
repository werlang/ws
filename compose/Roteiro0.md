# Roteiro 0: Serviços Web e API

## Para subir os containers:

```bash
docker compose -f docker-compose-basic.yml up -d

```

## Serviço Web

Acessível em http://localhost:3000

## Serviço API

Acessível em http://localhost:3001

### Query params:

- `name`: nome do usuário

### Exemplo:

http://localhost:3001?name=João

### Resposta:

```json
{
  "message": "Hello João!"
}
```

## Rota `/greeting`

Acessível em http://localhost:3001/greeting

### Query params:

- `name`: nome do usuário
- `title`: título do usuário

### Exemplo:

http://localhost:3001/greeting?name=João&title=Mr.

### Resposta:

```json
{
  "message": "Hello Mr. João!"
}
```

## Para derrubar os containers:

```bash
docker compose -f docker-compose-basic.yml down
```
