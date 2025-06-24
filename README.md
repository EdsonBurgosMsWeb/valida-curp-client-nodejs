# ValidaCurp Node.js Client

[![npm version](https://img.shields.io/npm/v/multiserviciosweb)](https://www.npmjs.com/package/multiserviciosweb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/MIT)
[![Node.js version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

Node.js client for validating, calculating, and obtaining CURP (Clave Única de Registro de Población) information in México. This library provides a simple interface to interact with the Valida CURP API service.

## Features

- ✅ Validate CURP structure
- 🔍 Retrieve CURP data from RENAPO
- 🧮 Calculate CURP from personal data
- 🗺️ Get list of Mexican entities (states)
- 🔄 Support for both v1 and v2 API versions
- 🔐 Secure token-based authentication

## Requirements

- Node.js >= 14.0.0
- API token from [valida-curp.com.mx](https://valida-curp.com.mx/)

## Installation

Install the package using npm:

```bash
npm install multiserviciosweb
```

## Account Setup

### 1. Create an account
Register at: [https://valida-curp.tawk.help/article/registro-de-usuario](https://valida-curp.tawk.help/article/registro-de-usuario)

### 2. Create a project
Create a project at: [https://valida-curp.tawk.help/article/creaci%C3%B3n-de-proyecto](https://valida-curp.tawk.help/article/creaci%C3%B3n-de-proyecto)

### 3. Get your API token
Obtain your token at: [https://valida-curp.tawk.help/article/obtener-token-llave-privada-proyecto](https://valida-curp.tawk.help/article/obtener-token-llave-privada-proyecto)

## Configuration

Add your token to a `.env` file in your project root:

```env
TOKEN_VALIDA_API_CURP=your_api_token_here
```

## Usage

### Importing the Client

```javascript
const { ValidaCurp, ValidaCurpException } = require('multiserviciosweb');
```

### Creating an Instance

```javascript
// Using token from .env file
const client = new ValidaCurp();

// Or explicitly passing token
const clientWithToken = new ValidaCurp('your_api_token_here');
```

### Setting API Version

```javascript
// Set API version (1 or 2, default is 2)
client.setVersion(2);
```

## API Methods

### 1. Validate CURP Structure

Validates the structure of a CURP.

```javascript
async function validateCURP() {
    try {
        const result = await client.isValid('XXXX980528XXXXXX02');
        console.log('Validation Result:', result);
    } catch (error) {
        console.error('Validation Error:', error.message);
    }
}
```

**Response Example:**
```json
{
  "valid": true,
  "curp": "XXXX980528XXXXXX02",
  "details": "Valid CURP structure"
}
```

### 2. Get CURP Data

Retrieves CURP information from RENAPO.

```javascript
async function getCURPData() {
    try {
        const data = await client.getData('XXXX980528XXXXXX02');
        console.log('CURP Data:', data);
    } catch (error) {
        console.error('Data Retrieval Error:', error.message);
    }
}
```

**Response Example:**
```json
{
  "nombres": "EDSON EDIAN",
  "apellidoPaterno": "BURGOS",
  "apellidoMaterno": "MACEDO",
  "sexo": "H",
  "fechaNacimiento": "1998-05-28",
  "entidadNacimiento": "CIUDAD DE MÉXICO",
  "nacionalidad": "MEXICANA"
}
```

### 3. Calculate CURP

Calculates a CURP from personal data.

```javascript
async function calculateCURP() {
    const personData = {
        names: 'Edson Edian',
        lastName: 'Burgos',
        secondLastName: 'Macedo',
        birthDay: '28',
        birthMonth: '05',
        birthYear: '1998',
        gender: 'H',  // H = Hombre, M = Mujer
        entity: '15'  // Estado de México
    };

    try {
        const result = await client.calculate(personData);
        console.log('Calculated CURP:', result);
    } catch (error) {
        console.error('Calculation Error:', error.message);
    }
}
```

**Response Example:**
```json
{
  "curp": "XXXX980528XXXXXX02",
  "digitoVerificador": "2"
}
```

### 4. Get Mexican Entities

Retrieves a list of Mexican entities (states).

```javascript
async function getEntities() {
    try {
        const entities = await client.getEntities();
        console.log('Mexican Entities:', entities);
    } catch (error) {
        console.error('Entities Retrieval Error:', error.message);
    }
}
```

**Response Example:**
```json
{
  "01": "AGUASCALIENTES",
  "02": "BAJA CALIFORNIA",
  "03": "BAJA CALIFORNIA SUR",
  "04": "CAMPECHE",
  "05": "COAHUILA",
  ...
}
```

## Full Example

```javascript
const { ValidaCurp, ValidaCurpException } = require('multiserviciosweb');

async function main() {
    try {
        // Initialize client
        const client = new ValidaCurp();
        
        // Set API version to 2 (recommended)
        client.setVersion(2);
        
        console.log("=== ValidaCurp Node.js Client Example ===");
        
        // 1. Validate CURP
        console.log("\n1. Validating CURP...");
        const validation = await client.isValid('XXXX980528XXXXXX02');
        console.log('Validation Result:', validation);
        
        // 2. Get CURP data
        console.log("\n2. Retrieving CURP data...");
        const data = await client.getData('XXXX980528XXXXXX02');
        console.log('CURP Data:', data);
        
        // 3. Calculate CURP
        console.log("\n3. Calculating CURP...");
        const personData = {
            names: 'Edson Edian',
            lastName: 'Burgos',
            secondLastName: 'Macedo',
            birthDay: '28',
            birthMonth: '05',
            birthYear: '1998',
            gender: 'H',
            entity: '15'
        };
        const calculated = await client.calculate(personData);
        console.log('Calculated CURP:', calculated);
        
        // 4. Get entities
        console.log("\n4. Retrieving entities...");
        const entities = await client.getEntities();
        console.log('Entities Count:', Object.keys(entities).length);
        
        // 5. API version info
        console.log("\n5. API Information:");
        console.log('Current Version:', client.getVersion());
        console.log('Current Endpoint:', client.getEndpoint());
        
    } catch (error) {
        if (error instanceof ValidaCurpException) {
            console.error('API Error:', error.message);
        } else {
            console.error('Unexpected Error:', error.message);
        }
    }
}

main();
```

## Personal Data Structure for CURP Calculation

| Property         | Description                                                                 | Example       |
|------------------|-----------------------------------------------------------------------------|---------------|
| `names`          | First name(s)                                                               | 'Juan Carlos' |
| `lastName`       | Paternal last name                                                          | 'Pérez'       |
| `secondLastName` | Maternal last name                                                          | 'López'       |
| `birthDay`       | Day of birth (2 digits)                                                     | '15'          |
| `birthMonth`     | Month of birth (2 digits)                                                   | '09'          |
| `birthYear`      | Year of birth (4 digits)                                                    | '1990'        |
| `gender`         | Gender: 'H' for male, 'M' for female                                        | 'H'           |
| `entity`         | Entity code (2-digit code for Mexican state)                                | '09' (CDMX)   |

## Error Handling

Handle API errors using try/catch blocks:

```javascript
try {
    const result = await client.getData('INVALID_CURP');
} catch (error) {
    if (error instanceof ValidaCurpException) {
        // Handle API-specific errors
        console.error('API Error:', error.message);
    } else {
        // Handle other errors (network issues, etc.)
        console.error('Unexpected Error:', error.message);
    }
}
```

## API Version Information
- **v1**: Deprecated (default endpoint: `https://api.valida-curp.com.mx/curp/`)
- **v2**: Current version (default endpoint: `https://version.valida-curp.com.mx/api/v2/curp/`)

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

GitHub Repository:  
[https://github.com/EdsonBurgosMsWeb/valida-curp-client-nodejs](https://github.com/EdsonBurgosMsWeb/valida-curp-client-nodejs)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
- Copyright (c) **Multiservicios Web JCA S.A. de C.V.**, [https://multiservicios-web.com.mx](https://multiservicios-web.com.mx)
- **Author:** Edson Burgos <edsonburgosmacedo@gmail.com>
- **Node.js Port:** Assistant

## Support
For support, please visit: [https://valida-curp.com.mx](https://valida-curp.com.mx)

---

**Disclaimer**: This library is not affiliated with or endorsed by the Mexican government. CURP validation and data retrieval services are provided through third-party API services.