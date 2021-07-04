# bienestar_cliente
Cliente para el **Bienestar institucional** que recibe el nombre *Sistema de Informacion Bienestar Universidad Distrital SIBUD*.

 Donde actualmente se tienen los modulos:
 - Apoyo alimentario
 - Citas medicas
 - Reliquidacion
 
## Especificaciones Técnicas

### Tecnologías Implementadas y Versiones
* [ngxAdmin](https://github.com/akveo/ngx-admin)
* [Angular 8.0](https://angular.io/)
* [Bootstrap 4](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
* [Nebular 4](https://akveo.github.io/nebular/4.6.0/)

### Variables de Entorno
```shell
# En Pipeline
SLACK_AND_WEBHOOK: WEBHOOK de Slack Grupo ci-covid-serverles
AWS_ACCESS_KEY_ID: llave de acceso ID Usuario AWS
AWS_SECRET_ACCESS_KEY: Secreto de Usuario AWS
```
### Ejecución del Proyecto

Clonar el proyecto del repositorio de git
```bash
# clone the project
git clone https://github.com/udistrital/bienestar_cliente.git
# enter the project directory
cd bienestar_cliente
```
Iniciar el servidor en local
```bash
# install dependency
npx npm install
or
npm install
# start server
npx ng serve
# Whenever you want to change the port just run
npx ng dev --port = 9528
```

Linter
```bash
# Angular linter
npm run lint
# run linter and auto fix
npm run lint:fix
# run linter on styles
npm run lint:styles
# run lint UI
npm run lint:ci
```

### Ejecución Dockerfile
```bash
# Does not apply
```
### Ejecución docker-compose
```bash
# Does not apply
```
### Ejecución Pruebas

Pruebas unitarias powered by Jest
```bash
# run unit test
npm run test
# Runt linter + unit test
npm run test:ui
```

## Mockups
Los siguientes mockups representan la estructura general de la aplicación, módulos, submódulos, estructura de información en vista formulario y vista tabla.

[Para visualizar los mockups acceder a este enlace](https://bit.ly/2Y0CGoC)

## Dependencias Utilizadas

**API MID**
- [Plan Cuentas MID](https://github.com/udistrital/plan_cuentas_mid/)

**API CRUD**
- [Plan Cuentas CRUD](https://github.com/udistrital/plan_cuentas_crud)
- [Plan Cuentas MONGO CRUD](https://github.com/udistrital/plan_cuentas_mongo_crud)


## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/bienestar_cliente/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/bienestar_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/bienestar_cliente/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/bienestar_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/bienestar_cliente/status.svg?ref=refs/heads/master)](https://hubci.portaloas.udistrital.edu.co/udistrital/bienestar_cliente) |

## Licencia

[This file is part of bienestar_cliente.](LICENSE)

bienestar_cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (atSara Sampaio your option) any later version.

bienestar_cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with bienestar_cliente. If not, see https://www.gnu.org/licenses/.
