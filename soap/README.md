# Exemplos usando SOAP

Há dois serviços no `docker-compose.yml`:

- `node`: Página e api em Node
- `php`: Página e api em PHP

Suba somente UM dos dois serviços, pois ambos expões a porta 80 no host.

```bash
docker compose up -d php
```
OU
```bash
docker compose up -d node
```

# Web server

Você pode acessar a página em `http://localhost`;
A página chama a API node/php pela rota `/number`

# API

Só há uma rota:

- `/number`: Faz uma chamada externa ao serviço disponível em https://www.dataaccess.com/webservicesserver/NumberConversion.wso

# Serviço SOAP externo

Documentação pode ser acessada no link: https://www.dataaccess.com/webservicesserver/NumberConversion.wso

## WSDL

XML com a descrição do serviço:

https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL

# SOAP client

## Node

Pacote [soap](https://www.npmjs.com/package/soap) do npm.

## PHP

Classe SoapClient. Olhe o [Dockerfile](./php/Dockerfile) para instruções do que precisa ser instalado no container para usar a classe no PHP.