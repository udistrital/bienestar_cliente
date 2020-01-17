# :ledger: Cliente Subsistema de Presupuesto

 En este repositorio se define la tecnología que se renderizara del lado del cliente para el subsistema de Presupuesto del Sistema de Gestión Financiera KRONOS.

El cliente del Sistema de Gestión Financiero-KRONOS permite centralizar y gestionar el manejo de la información de la universidad Distrital por medio de diferentes subsistemas, puntualmente se gestionan los procesos relacionados con la preasignación de presupuesto inicial, modificaciones presupuestales, gestión de las fuentes de financiamiento, gestión de los  certificados de disponibilidad presupuestal y los certificados de registro presupuestal, así como la gestión de las vigencias y los reportes financieros.


 La plantilla cuenta con los componentes :
 * **Plantilla ngxAdmin** ~ [link_documentación](https://github.com/akveo/ngx-admin)
 * **Angular 8.0**
 * **Bootstrap 4**
 * **Nebular 4**

<summary><h2> :writing_hand: Mockups</h2></summary>
  Los siguientes mockups grafican la estructura general de la aplicación, como sus principales vistas.
  Para visualizar los mockups acceder a este enlace
  [Moc](https://bit.ly/2Y0CGoC)

<summary><h2> 🛠️ Configuracion del proyecto</h2></summary>

  - Clonar el proyecto del repositorio de git
  ```bash
  # clone the project
  git clone https://github.com/udistrital/presupuesto_cliente.git

  # enter the project directory
  cd presupuesto_cliente
  ```

  - Iniciar el servidor en local
  ```bash
  # install dependency
  npx npm install ##instalación de dependencias
  or
  npm install

  # start server
  npx ng serve

  # Whenever you want to change the port just run
  npx ng dev --port = 9528
  ```

  - Linter
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
  - Pruebas unitarias powered by Jest
  ```bash
  # run unit test
  npm run test

  # Runt linter + unit test
  npm run test:ui

  ```

<summary><h2> :pick: Dependencias Utilizadas</h2></summary>

  - **Nebular 4** (https://github.com/akveo/nebular)
  - **Angular 8**
  - **Bootstrap 4**
  - **ng2-smart-table**

  ### API MID
  - Plan Cuentas MID . [Repositorio](https://github.com/udistrital/plan_cuentas_mid/)

  ### API CRUD

   - Plan Cuentas CRUD . [Repositorio](https://github.com/udistrital/plan_cuentas_crud)
   - Plan Cuentas MONGO CRUD . [Repositorio](https://github.com/udistrital/plan_cuentas_mongo_crud)

  ### Herramientas usadas
  - **ngx-admin:** este [template](https://github.com/akveo/ngx-admin) es el que utiliza ngxGenerator, esta basado en Angular 8+, Bootstrap 4 y Nebular.
  
  ## LICENCIA
 
 [Licencia](LICENSE)
 
 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
