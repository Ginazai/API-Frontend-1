
# API Frontend

Esta aplicacion web desarrollada en **React** sirve como frontend de la _REST API_ desarrollada en SpringBoot que se encuentra en el repositorio: [Spring-JPA-Test-API](https://github.com/Ginazai/Spring-JPA-Test-API).



## Tecnologias utilizadas

**Cliente:** React, ```react-router-dom```, React-Bootstrap

**Servidor de pruebas:** Node


## Ejecucion local
Crea el directorio del proyecto

Clona el proyecto en el directorio creado

```bash
  git clone https://link-to-project
```

Ve al directorio del proyecto

```bash
  cd my-project
```

Instala las dependencias

```bash
  npm install
```

Inicializa el servidor

```bash
  npm run start
```
Alternativamente, puedes ejecutar
```bash
npm run build
```
Esto creara un `build` de la aplicacion que puedes desplegar en el servidor de tu preferencia, por ejemplo, ubicado en la carpeta `build` ejecuta
```bash
python -m http.server 3000
```
Esto desplegara la aplicacion en `localhost:3000` utilizando el servidor incluido por defecto en `Python`. 

Ten en cuenta que, la configuraicon CORS de la [API](https://github.com/Ginazai/Spring-JPA-Test-API) permite unicamente el puerto `3000` por lo que solicitudes entrantes de otros puertos no seran atendidas.

## Contribuciones

¡Estoy abierto a cualquier aporte! Si deseas colaborar, puedes hacer un fork, crear una nueva rama y enviar un pull request.


## Licencia
Este software esta cubierto bajo la licencia [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.es).

