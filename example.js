#!/usr/bin/env node
/**
 * Example usage of ValidaCurp Node.js client.
 *
 * This example demonstrates how to use the ValidaCurp client to:
 * - Validate CURP structure
 * - Get CURP data from RENAPO
 * - Calculate CURP from personal data
 * - Get list of entities
 */

const { ValidaCurp, ValidaCurpException } = require('./index');

async function main() {
    try {
        // Initialize client with your token
        const validaCurp = new ValidaCurp();

        // Example CURP for testing
        const testCurp = "BUME980528HDFRCD02";

        console.log("=== ValidaCurp Node.js Client Example ===\n");

        // 1. Validate CURP structure
        console.log("1. Validating CURP structure...");
        try {
            const validationResult = await validaCurp.isValid(testCurp);
            console.log("Validation result:", JSON.stringify(validationResult, null, 2));
        } catch (error) {
            console.log("Validation error:", error.message);
        }
        console.log();

        // 2. Get CURP data
        console.log("2. Getting CURP data...");
        try {
            const curpData = await validaCurp.getData(testCurp);
            console.log("CURP data:", JSON.stringify(curpData, null, 2));
        } catch (error) {
            console.log("Get data error:", error.message);
        }
        console.log();

        // 3. Calculate CURP
        console.log("3. Calculating CURP...");
        const personData = {
            names: 'Edson Edian',
            lastName: 'Burgos',
            secondLastName: 'Macedo',
            birthDay: '28',
            birthMonth: '05',
            birthYear: '1998',
            gender: 'H',
            entity: '15',
        };

        try {
            const calculatedCurp = await validaCurp.calculate(personData);
            console.log("Calculated CURP:", JSON.stringify(calculatedCurp, null, 2));
        } catch (error) {
            console.log("Calculate error:", error.message);
        }
        console.log();

        // 4. Get entities
        console.log("4. Getting entities...");
        try {
            const entities = await validaCurp.getEntities();
            console.log("Entities:", JSON.stringify(entities, null, 2));
        } catch (error) {
            console.log("Get entities error:", error.message);
        }
        console.log();

        // Optional: Change API version (v1 is deprecated)
        console.log("5. Testing API version change...");
        try {
            console.log("Current version:", validaCurp.getVersion());
            console.log("Current endpoint:", validaCurp.getEndpoint());

            // Switch to v1 (deprecated)
            validaCurp.setVersion(1);
            console.log("After setting to v1:");
            console.log("Version:", validaCurp.getVersion());
            console.log("Endpoint:", validaCurp.getEndpoint());

            // Switch back to v2
            validaCurp.setVersion(2);
            console.log("After setting back to v2:");
            console.log("Version:", validaCurp.getVersion());
            console.log("Endpoint:", validaCurp.getEndpoint());
        } catch (error) {
            console.log("Version change error:", error.message);
        }

    } catch (error) {
        if (error instanceof ValidaCurpException) {
            console.error("Valida CURP Exception:", error.message);
        } else {
            console.error("General Exception:", error.message);
        }
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = main;