# docker-compose.yml

Arquivo que contém as configurações do projeto. É o arquivo principal do docker-compose.

# Extensão VSCode

[Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker): Com essa extensão, você pode gerenciar os containers do Docker pelo VSCode, subindo, parando, removendo, etc. com apenas alguns cliques.

# Estrutura

```yaml
version: 'number'
services:
    ...
volumes:
    ...
networks:
    ...
```

## Version

A versão do docker-compose. A versão mais recente é a 3.7.

## Services

Aqui é onde você configura os containers que serão criados. Cada container é um serviço.

## Volumes

Aqui é onde você descreve os volumes que serão criados. Os volumes são locais onde os dados são armazenados. Eles podem ser mapeados para dentro dos containers.

## Networks

As redes são usadas para conectar os containers entre si. Você pode criar uma rede para cada serviço ou criar uma rede para todos os serviços. Por padrão, todos os containers são conectados à `PROJETO_default`.

## Exemplo

```yaml
version: '3'
services:
    web: # nome do serviço
        image: aula-ws-web # nome da imagem
        build: # configuração de build
            context: ./web # diretório onde está o Dockerfile
            dockerfile: Dockerfile # nome do Dockerfile
        volumes: # volumes que serão mapeados
            - ./web:/app # mapeia o diretório ./web para dentro do container no diretório /app
            - node_modules:/app/node_modules # mapeia o volume node_modules para dentro do container no diretório /app/node_modules
        ports: # portas que serão expostas
            - "3000:3000" # expõe a porta 3000 do container para a porta 3000 do host
        command: npm start # comando que será executado ao iniciar o container
    api:
        image: aula-ws-api
        build:
            context: ./api
            dockerfile: Dockerfile
        volumes:
            - ./api:/app
            - node_modules:/app/node_modules
        ports:
            - "3001:3000" # expõe a porta 3000 do container para a porta 3001 do host
        command: npm start
volumes: # volumes que serão criados
    node_modules: 
    mysql:
```

### Image

Aqui você informa o nome da imagem que será usada para criar o container. Caso a imagem não exista, o docker-compose tenta fazer o build da imagem. Para fazer o pull da imagem do Docker Hub, basta informar o nome da imagem e a versão (ex.: `image: node:10`)

### Build

Quando a imagem não é encontrada, o docker-compose tenta fazer o build da imagem. Para isso, é necessário informar o diretório onde está o Dockerfile e o nome do Dockerfile. Caso não seja informado, o docker-compose procura por um arquivo chamado `Dockerfile` no diretório atual.

### Ports

Aqui você informa quais portas serão expostas do container para o host. Para isso, você informa a porta do host e a porta do container separadas por dois pontos. Ex.: `4200:80` expõe a porta 80 do container para a porta 4200 do host. A porta poderá então ser acessada pelo endereço `localhost:4200`.

Caso queira que somente a máquina local acesse a porta, você pode informar o endereço `127.0.0.1:4200:80`. Desta forma, o host continua tendo acesso à porta, mas a porta não é exposta para outras máquinas.

Caso não mapeie nenhuma porta, os outros containers ainda poderão acessar o serviço, mas não será possível acessar o serviço do host.

### Command

Aqui você informa o comando que será executado ao iniciar o container. Caso não seja informado, o docker-compose executa o comando `CMD` do Dockerfile.

Uma técnica muito utilizada é informar o comando `npm start` ou `npm run TASK` para iniciar o container.