# ValidaCurp Node.js Client

[![npm version](https://img.shields.io/npm/v/multiserviciosweb)](https://www.npmjs.com/package/multiserviciosweb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/MIT)
[![Node.js version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

Node.js client for validating, calculating, and obtaining CURP (Clave Única de Registro de Población) information in México.

- Copyright (c) Multiservicios Web JCA S.A. de C.V., https://multiservicios-web.com.mx
- More information: https://valida-curp.com.mx
- License: MIT (https://opensource.org/license/MIT)

## 1. Requirements

- Node.js >= 14.0.0

## 2. Installation

```bash
npm install multiserviciosweb
```

## 3. Account

### 3.1. Create an account
Create an account by following this link: https://valida-curp.tawk.help/article/registro-de-usuario

### 3.2. Create a project
Create a project by following this link: https://valida-curp.tawk.help/article/creaci%C3%B3n-de-proyecto

### 3.3. Get a token
Get your token by following this link: https://valida-curp.tawk.help/article/obtener-token-llave-privada-proyecto

## 4. Usage

### 4.1. Import the library

```javascript
const { ValidaCurp, ValidaCurpException } = require('multiserviciosweb');
```

### 4.2. Create an instance

The constructor receives the token as first parameter. Optionally you can pass a custom endpoint.

```javascript
// Passing token directly
const client = new ValidaCurp('YOUR-TOKEN');
```

You can also set the token via environment variable. Create a `.env` file:

```env
TOKEN_VALIDA_API_CURP=YOUR-TOKEN
```

Then instantiate without arguments:

```javascript
const client = new ValidaCurp();
```

### 4.3. (Optional) Set API version

You can set the API version to query. Default value is 2.

```javascript
client.setVersion(2); // 1 or 2
```

> Version 1 of the API is deprecated. Please use version 2.

### 4.4. (Optional) Custom endpoint

```javascript
const client = new ValidaCurp('YOUR-TOKEN', 'https://custom.valida-curp.com.mx/curp/');
```

## 5. Methods

### 5.1. Validate CURP

The method `isValid()` takes a CURP as parameter and validates its structure.

```javascript
const result = await client.isValid('PXNE660720HMCXTN06');
console.log(result);
```

Response:

```json
{
  "valido": 1
}
```

### 5.2. Get CURP data

The method `getData()` takes a CURP as parameter and consults the CURP information in RENAPO.

```javascript
const data = await client.getData('PXNE660720HMCXTN06');
console.log(data);
```

Response:

```json
{
  "Applicant": {
    "CURP": "PXNE660720HMCXTN06",
    "Names": "ENRIQUE",
    "LastName": "PEÑA",
    "SecondLastName": "NIETO",
    "GenderKey": "H",
    "Gender": "Hombre",
    "DateOfBirth": "1966-07-20",
    "Nacionality": "MEX",
    "CodeEntityBirth": "",
    "EntityBirth": "",
    "KeyEvidentiaryDocument": 1,
    "EvidentiaryDocument": "Acta de nacimiento",
    "CurpStatusKey": "AN",
    "CurpStatus": "Alta Normal"
  },
  "EvidentiaryDocument": {
    "YearRegistration": 1966,
    "KeyIssuingEntity": "",
    "KeyMunicipalityRegistration": 14,
    "MunicipalityRegistration": "",
    "Foja": 0,
    "FolioLetter": "",
    "Book": 0,
    "CertificateNumber": 985,
    "RegistrantNumber": 15,
    "RegistrationEntity": "México",
    "ForeignRegistrationNumber": "",
    "Volume": 0
  }
}
```

### 5.3. Calculate a CURP

The method `calculate()` takes an object as parameter and calculates the CURP structure from the provided data.

```javascript
const result = await client.calculate({
    names: 'Enrique',
    lastName: 'Peña',
    secondLastName: 'Nieto',
    birthDay: '20',
    birthMonth: '07',
    birthYear: '1966',
    gender: 'H',
    entity: '15',
});
console.log(result);
```

**Required fields:**

| Field            | Description                             | Example  |
|------------------|-----------------------------------------|----------|
| `names`          | First name(s)                           | `'Juan'` |
| `lastName`       | Paternal last name                      | `'Pérez'`|
| `secondLastName` | Maternal last name                      | `'López'`|
| `birthDay`       | Day of birth (2 digits)                 | `'15'`   |
| `birthMonth`     | Month of birth (2 digits)               | `'09'`   |
| `birthYear`      | Year of birth (4 digits)                | `'1990'` |
| `gender`         | `'H'` for male, `'M'` for female        | `'H'`    |
| `entity`         | Entity code (2-digit state code)        | `'09'`   |

Response:

```json
{
  "curp": "PXNE660720HMCXTN06"
}
```

### 5.4. Get entities

The method `getEntities()` doesn't take any parameters and returns the list of entities.

```javascript
const entities = await client.getEntities();
console.log(entities);
```

Response:

```json
{
  "clave_entidad": [
    { "clave_entidad": "01", "nombre_entidad": "AGUASCALIENTES", "abreviatura_entidad": "AS" },
    { "clave_entidad": "02", "nombre_entidad": "BAJA CALIFORNIA", "abreviatura_entidad": "BC" }
  ]
}
```

## 6. Error handling

All methods throw `ValidaCurpException` on API errors.

```javascript
const { ValidaCurp, ValidaCurpException } = require('multiserviciosweb');

try {
    const result = await client.getData('PXNE660720HMCXTN06');
} catch (error) {
    if (error instanceof ValidaCurpException) {
        console.error('API Error:', error.message);
    } else {
        console.error('Unexpected Error:', error.message);
    }
}
```

## 7. Full example

```javascript
const { ValidaCurp, ValidaCurpException } = require('multiserviciosweb');

async function main() {
    try {
        const client = new ValidaCurp('YOUR-TOKEN');

        // Validate CURP structure
        console.log(await client.isValid('PXNE660720HMCXTN06'));

        // Get CURP data from RENAPO
        console.log(await client.getData('PXNE660720HMCXTN06'));

        // Calculate CURP
        console.log(await client.calculate({
            names: 'Enrique',
            lastName: 'Peña',
            secondLastName: 'Nieto',
            birthDay: '20',
            birthMonth: '07',
            birthYear: '1966',
            gender: 'H',
            entity: '15',
        }));

        // Get entities
        console.log(await client.getEntities());

    } catch (error) {
        if (error instanceof ValidaCurpException) {
            console.error('ValidaCurp Exception:', error.message);
        } else {
            console.error('Unexpected Error:', error.message);
        }
    }
}

main();
```

To see the full example click on this link: https://github.com/EdsonBurgosMsWeb/valida-curp-client-nodejs/blob/main/example.js

## 8. Credits

- Copyright (c) **Multiservicios Web JCA S.A. de C.V.**, https://multiservicios-web.com.mx
- **Author:** Edson Burgos <edsonburgosmacedo@gmail.com>

## 9. License

This project is released under the MIT License. See the **[LICENSE](./LICENSE)** file for details.
