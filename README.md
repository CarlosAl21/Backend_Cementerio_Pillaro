<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

**Descripción del Proyecto**

Este repositorio contiene el backend del sistema de gestión del Cementerio de Píllaro. Es una API REST construida con `NestJS` y `TypeORM` para gestionar entidades como inhumaciones, exhumaciones, nichos, propietarios y otros recursos relacionados.

**Estructura de carpetas (resumen)**

- **`/src`**: Código fuente principal.
  - **`auth/`**: Autenticación y autorización (JWT, roles).
  - **`cementerio/`**, **`exumacion/`**, **`inhumaciones/`**, **`nicho/`**, **`personas/`**, **`propietarios-nichos/`**, **`requisitos-inhumacion/`**, **`huecos-nichos/`**: Módulos principales del dominio.
  - **`common/`**, **`shared/`**: DTOs, interceptores, utilidades y generadores (ej. PDF).
  - **`database/`**: Configuración y scripts de seeds (`/src/database/seeds`).
  - **`main.ts`**, **`app.module.ts`**, **`app.controller.ts`**, **`app.service.ts`**: Entrada y wiring de la aplicación.
- **`assets/`**: Fuentes e imágenes usadas por el proyecto.
- **`test/`**: Pruebas e2e y configuración de Jest.
- `package.json`, `tsconfig.json`, `docker-compose.yml`, etc.: Configuración del proyecto.

**Instalación**

- **Requisitos**: Node.js (recomendado v16+ o v18+), `npm` o `pnpm`.
- **Instalar dependencias**: ejecutar en la raíz del repositorio:

```
npm install
```

- **Variables de entorno**: configurar las variables necesarias (base de datos, credenciales AWS S3, JWT_SECRET, etc.). Se recomienda crear un archivo `.env` o usar `@nestjs/config` según la configuración del proyecto.

**Dependencias principales**

- **Framework y utilidades**: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/config`, `rxjs`, `reflect-metadata`.
- **ORM / BD**: `typeorm` (soporta drivers `pg` y `oracledb` según configuración). Dependencias incluidas: `pg`, `oracledb`.
- **Autenticación**: `@nestjs/jwt`, `passport`, `passport-jwt`, `@nestjs/passport`, `bcrypt`, `bcryptjs`.
- **Almacenamiento / archivos**: `multer`, `multer-s3`, `@aws-sdk/client-s3`.
- **Documentación / utilidades**: `@nestjs/swagger`, `pdfmake`.

DevDependencies importantes:

- `typescript`, `ts-node`, `ts-jest`, `jest`, `eslint`, `prettier`, `@nestjs/cli`.

Si prefieres la lista completa, se encuentran en `package.json` bajo `dependencies` y `devDependencies`.

**Ejecución**

- **Modo desarrollo (watch)**:

```
npm run dev
```

- **Iniciar en modo producción** (compilar luego ejecutar):

```
npm run build
npm run start:prod
```

- **Otros scripts disponibles** (ver `package.json`):

- **`npm run start`**: iniciar sin watch.
- **`npm run lint`**: ejecutar ESLint y arreglar donde sea posible.
- **`npm run test`**, **`npm run test:e2e`**, **`npm run test:cov`**: pruebas unitarias, e2e y cobertura.
- **`npm run seed`**: ejecutar seeds (`src/database/seeds/*`).

**Notas y recomendaciones**

- Mantén las variables de entorno seguras y fuera del control de versiones.
- Para desarrollo con Oracle use la configuración y credenciales adecuadas; si usas Postgres asegúrate de ajustar `ormconfig` o `TypeOrmModule` en `app.module`.
- Considera usar `docker-compose.yml` incluido para levantar dependencias (BD) en desarrollo.

Si quieres, puedo:

- Añadir ejemplos de `.env` y `.env.example`.
- Crear instrucciones para desplegar con `docker-compose`.

---

Archivo actualizado: `README.md` — Si quieres cambios de estilo o más detalles (ej. ejemplo de llamadas a la API), dime y lo añado.
