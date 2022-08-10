# Instala docker

```
yum install -y docker
systemctl enable docker
```

# Comandos

* `docker run`: baixa, cria, roda container
* `docker images`: lista imagens
* `docker ps`: lista containeres
  * `-a`: all
  * `-q`: quiet, só os ids
* `docker rm`: remove container
  * `-f`: force
* `docker rmi`: remove imagem
* `docker build`: cria imagem


# docker run

Roda os containeres

* `-it`: interactive, tty
* `-d`: detached
* `-p`: remap port (*to*:*from*)
* `-e`: send env var
* `--name`: use a name for container


# Hello world

```
docker run hello-world
```

# Bash no container

```
docker run -it ubuntu bash
```

# Servindo app pelo docker

```
docker run -p 8888:80 prakhar1989/static-site
```

# Criando uma imagem

Usa o arquivo Dockerfile para montar a imagem. **Ver exemplo**.

```
docker build -t 'node-rest-api' .
```

# Push para o dockerhub

Dockerhub - Publica imagem na nuvem: https://hub.docker.com/

```
docker login --username pswerlang
docker tag 7f14a887c24f docker.io/pswerlang/node-rest-api
docker push docker.io/pswerlang/node-rest-api
```

# Mysq-server container

Run mysql server on port 3310

```
docker run -d -p 3310:3306 --name mysql -e MYSQL_ROOT_PASSWORD=asdf1234 mysql:5.7
```

Enter container executing mysql cli

```
docker exec -it mysql mysql -u root -p
```

Execute script to create db

```
mysql> source database.sql
```

# Connect api to Mysql container

Get ip from mysql container

```
docker network inspect bridge
```

Use the ip as env var to connect to mysql in api

```
docker run -d -p 4210:4200 --name api -e HOST="172.17.0.2" node-rest-api
```