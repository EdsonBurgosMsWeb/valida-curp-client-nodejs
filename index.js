/**
 * ValidaCurp Client for Node.js
 *
 * This library can validate, calculate and obtain CURP information in México.
 *
 * Copyright (c) Multiservicios Web JCA S.A. de C.V., https://multiservicios-web.com.mx
 * License: MIT (https://opensource.org/license/MIT)
 *
 * Author: Joel Rojas <me@hckdrk.mx>
 * Ported to Node.js by: Assistant
 */

const { ValidaCurp, ValidaCurpException } = require('./MultiServicioWeb/ValidaCurp');

module.exports = {
    ValidaCurp,
    ValidaCurpException
};