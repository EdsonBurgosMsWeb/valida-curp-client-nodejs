# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-XX

### Added
- Initial release of ValidaCurp Node.js client
- Support for CURP validation, data retrieval, and calculation
- Support for both API v1 and v2 (v2 recommended)
- Token support via constructor argument or `TOKEN_VALIDA_API_CURP` environment variable
- Custom endpoint support
- Comprehensive error handling with `ValidaCurpException`

### Features
- `isValid()` - Validate CURP structure
- `getData()` - Get CURP information from RENAPO
- `calculate()` - Calculate CURP from personal data
- `getEntities()` - Get list of Mexican entities
- `setVersion()` - Switch between API versions
- `getVersion()` - Get current API version
- `getEndpoint()` - Get current endpoint URL
- `getToken()` - Get current token

### Dependencies
- Node.js >= 14.0.0
- axios >= 1.10.0
- dotenv >= 16.5.0
