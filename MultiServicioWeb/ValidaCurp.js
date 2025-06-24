/**
 * ValidaCurp Client for Node.js
 *
 * This library can validate, calculate and obtain CURP information in México.
 *
 * Copyright (c) Multiservicios Web JCA S.A. de C.V., https://multiservicios-web.com.mx
 * License: MIT (https://opensource.org/license/MIT)
 *
 * Author: Edson Burgos <edsonburgosmacedo@gmail.com.mx>
 * Ported to Node.js by: Assistant
 */

const axios = require('axios');
require('dotenv').config();

class ValidaCurpException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidaCurpException';
    }
}

class ValidaCurp {
    static URL_V1 = "https://api.valida-curp.com.mx/curp/";
    static URL_V2 = "https://version.valida-curp.com.mx/api/v2/curp/";
    static LIBRARY_VERSION = "1.0.0";
    static TYPE = "nodejs";

    /**
     * Initialize the ValidaCurp client.
     *
     * @param {string|null} token - The project token
     * @param {string|null} customEndpoint - Custom endpoint URL
     */
    constructor(token = null, customEndpoint = null) {
        this.token = token || process.env.TOKEN_VALIDA_API_CURP;
        this.version = 2;
        this.customEndpoint = customEndpoint;
        this.endpoint = customEndpoint || ValidaCurp.URL_V2;
    }

    /**
     * Get the current API version.
     *
     * @returns {number} Current API version
     */
    getVersion() {
        return this.version;
    }

    /**
     * Set the API version.
     *
     * Version 1 of the API is deprecated. Please use version 2 of the API.
     *
     * @param {number} version - API version (1 or 2)
     * @throws {ValidaCurpException} If version is invalid
     */
    setVersion(version = 2) {
        if (version === 1) {
            this.version = 1;
            this.endpoint = this.customEndpoint || ValidaCurp.URL_V1;
        } else if (version === 2) {
            this.version = 2;
            this.endpoint = this.customEndpoint || ValidaCurp.URL_V2;
        } else {
            throw new ValidaCurpException("The version is invalid");
        }
    }

    /**
     * Get the current endpoint URL.
     *
     * @returns {string} Current endpoint URL
     */
    getEndpoint() {
        return this.endpoint;
    }

    /**
     * Get the current token.
     *
     * @returns {string} Current token
     */
    getToken() {
        return this.token;
    }

    /**
     * Validate CURP structure.
     *
     * This method takes a CURP as a parameter and validates the structure.
     *
     * @param {string} curp - The CURP to validate
     * @returns {Promise<Object>} Validation response
     * @throws {ValidaCurpException} If token is not set or API error occurs
     */
    async isValid(curp) {
        if (!this.getToken()) {
            throw new ValidaCurpException("The token was not set");
        }

        if (this.getVersion() === 1) {
            return await this._validateV1(curp);
        } else {
            return await this._validateV2(curp);
        }
    }

    /**
     * Validate CURP using API v1.
     *
     * @private
     * @param {string} curp - The CURP to validate
     * @returns {Promise<Object>} Validation response
     */
    async _validateV1(curp) {
        const url = this._makeUrl("validar", curp);
        const response = await this._requestGet(url);
        return this._decodeResponse(response);
    }

    /**
     * Validate CURP using API v2.
     *
     * @private
     * @param {string} curp - The CURP to validate
     * @returns {Promise<Object>} Validation response
     */
    async _validateV2(curp) {
        const response = await this._makeRequest("validateCurpStructure", curp);
        return this._decodeResponse(response);
    }

    /**
     * Get CURP data from RENAPO.
     *
     * This method takes a CURP as a parameter and consults the CURP information in RENAPO.
     *
     * @param {string} curp - The CURP to query
     * @returns {Promise<Object>} CURP data response
     * @throws {ValidaCurpException} If token is not set or API error occurs
     */
    async getData(curp) {
        if (!this.getToken()) {
            throw new ValidaCurpException("The token was not set");
        }

        if (this.getVersion() === 1) {
            return await this._getDataV1(curp);
        } else {
            return await this._getDataV2(curp);
        }
    }

    /**
     * Get CURP data using API v1.
     *
     * @private
     * @param {string} curp - The CURP to query
     * @returns {Promise<Object>} CURP data response
     */
    async _getDataV1(curp) {
        const url = this._makeUrl("obtener_datos", curp);
        const response = await this._requestGet(url);
        return this._decodeResponse(response);
    }

    /**
     * Get CURP data using API v2.
     *
     * @private
     * @param {string} curp - The CURP to query
     * @returns {Promise<Object>} CURP data response
     */
    async _getDataV2(curp) {
        const response = await this._makeRequest("getData", curp);
        return this._decodeResponse(response);
    }

    /**
     * Calculate CURP structure.
     *
     * Calculates the structure of a CURP with provided data.
     *
     * @param {Object} data - Dictionary with required fields:
     *   - names: First names
     *   - lastName: Last name (apellido paterno)
     *   - secondLastName: Second last name (apellido materno)
     *   - birthDay: Birth day
     *   - birthMonth: Birth month
     *   - birthYear: Birth year
     *   - gender: Gender (H/M)
     *   - entity: Entity code
     * @returns {Promise<Object>} Calculated CURP response
     * @throws {ValidaCurpException} If token is not set, required data is missing, or API error occurs
     */
    async calculate(data) {
        if (!this.getToken()) {
            throw new ValidaCurpException("The token was not set");
        }

        if (this.getVersion() === 1) {
            return await this._calculateV1(data);
        } else {
            return await this._calculateV2(data);
        }
    }

    /**
     * Calculate CURP using API v1.
     *
     * @private
     * @param {Object} data - Personal data
     * @returns {Promise<Object>} Calculated CURP response
     */
    async _calculateV1(data) {
        this._validateDataCalculate(data);

        const dataV1 = {
            nombres: data.names,
            apellido_paterno: data.lastName,
            apellido_materno: data.secondLastName,
            dia_nacimiento: data.birthDay,
            mes_nacimiento: data.birthMonth,
            anio_nacimiento: data.birthYear,
            sexo: data.gender,
            entidad: data.entity,
        };

        const url = this._makeUrl("calcular_curp", null, dataV1);
        const response = await this._requestGet(url);
        return this._decodeResponse(response);
    }

    /**
     * Calculate CURP using API v2.
     *
     * @private
     * @param {Object} data - Personal data
     * @returns {Promise<Object>} Calculated CURP response
     */
    async _calculateV2(data) {
        this._validateDataCalculate(data);

        // Adjust data for v2 API
        const dataV2 = {...data};
        dataV2.birthday = dataV2.birthDay;
        dataV2.yearBirth = dataV2.birthYear;
        delete dataV2.birthDay;

        const response = await this._makeRequest("calculateCURP", null, dataV2);
        return this._decodeResponse(response);
    }

    /**
     * Validate required data for calculate method.
     *
     * @private
     * @param {Object} data - Data to validate
     * @throws {ValidaCurpException} If required field is missing
     */
    _validateDataCalculate(data) {
        const requiredFields = [
            "names", "lastName", "secondLastName",
            "birthDay", "birthMonth", "birthYear",
            "gender", "entity"
        ];

        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new ValidaCurpException(`The ${field} was not set`);
            }
        }
    }

    /**
     * Get list of entities.
     *
     * @returns {Promise<Object>} List of entities response
     * @throws {ValidaCurpException} If token is not set or API error occurs
     */
    async getEntities() {
        if (!this.getToken()) {
            throw new ValidaCurpException("The token was not set");
        }

        if (this.getVersion() === 1) {
            return await this._getEntitiesV1();
        } else {
            return await this._getEntitiesV2();
        }
    }

    /**
     * Get entities using API v1.
     *
     * @private
     * @returns {Promise<Object>} Entities response
     */
    async _getEntitiesV1() {
        const url = this._makeUrl("entidades");
        const response = await this._requestGet(url);
        return this._decodeResponse(response);
    }

    /**
     * Get entities using API v2.
     *
     * @private
     * @returns {Promise<Object>} Entities response
     */
    async _getEntitiesV2() {
        const response = await this._makeRequest("getEntities");
        return this._decodeResponse(response);
    }

    /**
     * Make GET request.
     *
     * @private
     * @param {string} url - URL to request
     * @returns {Promise<Object>} Axios response
     * @throws {Error} If HTTP request fails
     */
    async _requestGet(url) {
        try {
            const response = await axios.get(url);
            return response;
        } catch (error) {
            if (error.response) {
                this._decodeResponse(error.response);
            }
            throw error;
        }
    }

    /**
     * Make POST request.
     *
     * @private
     * @param {string} url - URL to request
     * @param {Object} data - Data to send
     * @returns {Promise<Object>} Axios response
     * @throws {Error} If HTTP request fails
     */
    async _requestPost(url, data) {
        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            if (error.response) {
                this._decodeResponse(error.response);
            }
            throw error;
        }
    }

    /**
     * Decode API response.
     *
     * @private
     * @param {Object} response - HTTP response object
     * @returns {Object} Decoded response data
     * @throws {ValidaCurpException} For API errors
     */
    _decodeResponse(response) {
        const attr = this.getVersion() === 1 ? "error_message" : "msn";

        if (response.status === 200) {
            const responseData = response.data;
            return responseData.response || responseData;
        } else if (response.status === 401 || response.status === 403) {
            const errorData = response.data;
            const errorMsg = errorData[attr] || "Authentication failed";
            throw new ValidaCurpException(`Failed authentication: ${errorMsg}`);
        } else if (response.status === 400) {
            const errorData = response.data;
            const errorMsg = errorData[attr] || "Bad request";
            throw new ValidaCurpException(`Bad request: ${errorMsg}`);
        } else {
            throw new ValidaCurpException(`The request failed: ${response.statusText}`);
        }
    }

    /**
     * Build URL for API v1.
     *
     * @private
     * @param {string} method - API method
     * @param {string|null} curp - CURP value
     * @param {Object|null} extraData - Additional data
     * @returns {string} Complete URL
     */
    _makeUrl(method, curp = null, extraData = null) {
        const data = {token: this.getToken()};

        if (curp) {
            data.curp = curp;
        }

        if (extraData) {
            Object.assign(data, extraData);
        }

        // Add library information
        Object.assign(data, {
            library: ValidaCurp.TYPE,
            library_version: ValidaCurp.LIBRARY_VERSION,
            api_version: this.getVersion(),
        });

        const queryString = new URLSearchParams(data).toString();
        return `${this.getEndpoint()}${method}?${queryString}`;
    }

    /**
     * Make request for API v2.
     *
     * @private
     * @param {string} method - API method
     * @param {string|null} curp - CURP value
     * @param {Object|null} extraData - Additional data
     * @returns {Promise<Object>} Axios response
     */
    async _makeRequest(method, curp = null, extraData = null) {
        const data = {token: this.getToken()};

        if (curp) {
            data.curp = curp;
        }

        if (extraData) {
            Object.assign(data, extraData);
        }

        // Add library information to query string
        const queryParams = {
            library: ValidaCurp.TYPE,
            library_version: ValidaCurp.LIBRARY_VERSION,
            api_version: this.getVersion(),
        };

        const queryString = new URLSearchParams(queryParams).toString();
        const url = `${this.getEndpoint()}${method}?${queryString}`;

        return await this._requestPost(url, data);
    }
}

module.exports = {ValidaCurp, ValidaCurpException};