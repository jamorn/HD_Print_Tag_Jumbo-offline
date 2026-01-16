/**
 * Unit Configuration
 * Configuration for different product units (HDPE, PP, PPC)
 * Based on React-like-V2 pattern
 */

export const UNIT_CONFIG = {
    HDPE: {
        id: 'HDPE',
        name: 'HDPE',
        fullName: 'High-Density Polyethylene',
        description: 'HDPE Pellet Production Unit',
        qrPrefix: 'HDPE',

        // Available templates for this unit
        availableTemplates: ['template1', 'template2', 'template3'],
        defaultTemplate: 'template3',

        // Default values
        defaults: {
            grade: 'P901BK',
            netweight: '750',
            title1: 'HDPE',
            title2: 'HIGH DENSITY POLYETHYLENE',
            sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
            sirim_title2: 'Certified No. : PC004152',
            sirim_title3: 'Designation : PE100',
            tis: 'Y',
            backgroundImage: 'images/polimaxx.jpg',
            qrCodeUrl: 'https://appdb.tisi.go.th/Q/i.php?d=1351525040'
        },

        // Specifications
        defaultSpecs: {
            density: '0.941-0.965 g/cm³',
            mfi: 'Variable',
            tensile: '> 20 MPa'
        },

        // Certifications
        certifications: ['TIS', 'SIRIM', 'NSF'],
        hasLogo: true,
        hasSirimLogo: true,

        // Grade data with auto-fill netweight
        gradeData: [
            { "grade": "P901BK", "netweightArray": [750, 800, 900, 16500, 18000], "description": "Black Pipe Grade", "status": true, "sub": false },
            { "grade": "P921BK", "netweightArray": [750, 800], "description": "Black Pipe Grade", "status": true, "sub": false },
            { "grade": "P921NT", "netweightArray": [750], "description": "Natural Pipe Grade", "status": true, "sub": false },
            { "grade": "AM3245PC", "netweightArray": [750], "description": "Injection Grade", "status": true, "sub": true },
            { "grade": "P900BK", "netweightArray": [750], "description": "Black Pipe Grade", "status": true, "sub": true },
            { "grade": "P900NT", "netweightArray": [750], "description": "Natural Pipe Grade", "status": true, "sub": false },
            { "grade": "I055BK", "netweightArray": [750], "description": "Injection Black", "status": true, "sub": false },
            { "grade": "I055NT", "netweightArray": [750], "description": "Injection Natural", "status": true, "sub": false },
            { "grade": "B640BK", "netweightArray": [750], "description": "Blow Molding Black", "status": true, "sub": false },
            { "grade": "B640NT", "netweightArray": [750], "description": "Blow Molding Natural", "status": false, "sub": false }
        ],

        // Validation rules
        validation: {
            lotLength: 10,
            lotPattern: /^\d{10}$/,
            requiredFields: ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate']
        }
    },

    PP: {
        id: 'PP',
        name: 'PP',
        fullName: 'Polypropylene',
        description: 'PP Pellet Production Unit',
        qrPrefix: 'PP',

        // Available templates for this unit
        availableTemplates: ['template1', 'template2'],
        defaultTemplate: 'template2',

        // Default values
        defaults: {
            grade: '1105SC',
            netweight: '750',
            title1: 'PP',
            title2: 'POLYPROPYLENE',
            qrCodeImage: './images/svg/pp-qr-code-simple.svg',
            backgroundImage: 'images/polimaxx.jpg',
            qrCodeUrl: 'https://appdb.tisi.go.th/Q/i.php?d=3828891212'
        },

        // Specifications
        defaultSpecs: {
            density: '0.895-0.92 g/cm³',
            mfi: 'Variable',
            tensile: '> 25 MPa'
        },

        // Certifications
        certifications: ['TIS'],
        hasLogo: true,
        hasSirimLogo: false,

        // Grade data
        gradeData: [
            { "grade": "1032L", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100NK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100PK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100RC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100S", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100XC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100YC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1100ZC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            {
                "grade": "1102H",
                "netweightArray": [750, 800, 900, 16500, 18000],
                "description": "PP Standard Grade",
                "status": true,
                "sub": false
            },
            { "grade": "1102K", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1102M", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1105RC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            {
                "grade": "1105RCN",
                "netweightArray": [750, 800, 900, 16500, 18000],
                "description": "PP Standard Grade SC",
                "status": true,
                "sub": false
            },
            {
                "grade": "1105SC",
                "netweightArray": [750, 800, 900, 16500, 18000],
                "description": "PP Standard Grade SC",
                "status": true,
                "sub": false
            },
            { "grade": "1105TC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1111R", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1120NK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1125NA", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1126NK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            {
                "grade": "1140H",
                "netweightArray": [750, 800, 900],
                "description": "PP High Flow",
                "status": true,
                "sub": false
            },
            { "grade": "1140U", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "1140VC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            {
                "grade": "1150H",
                "netweightArray": [750, 800, 900],
                "description": "PP High Stiffness",
                "status": true,
                "sub": false
            },
            { "grade": "1202J", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2300K", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2300NC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2300NCA", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2363LC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2500H", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2500M", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "2500PC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3312E", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3325M", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3340H", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3340HMD", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3375RM", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3375SM", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
            { "grade": "3380SM", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false }
        ],

        // Validation rules
        validation: {
            lotLength: 10,
            lotPattern: /^\d{10}$/,
            requiredFields: ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate']
        }
    },

    PPC: {
        id: 'PPC',
        name: 'PPC',
        fullName: 'Polypropylene Compound',
        description: 'PPC Pellet Production Unit',
        qrPrefix: 'PPC',

        // Available templates for this unit
        availableTemplates: ['template1', 'template2'],
        defaultTemplate: 'template1',

        // Default values
        defaults: {
            grade: 'FL203D',
            netweight: '750',
            title1: 'PPC',
            title2: 'POLYPROPYLENE COMPOUND',
            qrCodeImage: './images/svg/pp-qr-code-simple.svg',
            backgroundImage: 'images/polimaxx.jpg',
            qrCodeUrl: 'https://appdb.tisi.go.th/Q/i.php?d=3828891212'
        },

        // Specifications
        defaultSpecs: {
            density: '0.90-0.92 g/cm³',
            mfi: 'Variable',
            tensile: '> 23 MPa'
        },

        // Certifications
        certifications: ['TIS'],
        hasLogo: true,
        hasSirimLogo: false,

        // Grade data
        gradeData: [
            { "grade": "B1101", "netweightArray": [750, 800, 900], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC03B", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC03BS", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC03BSW", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC04NN", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC05B", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC09CHA", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC3AWT", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC3N", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "BC3NSW", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "F1003B", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "FL203D", "netweightArray": [750, 800], "description": "PPC Standard Grade", "status": true, "sub": false },
            { "grade": "K1104", "netweightArray": [750, 800], "description": "PPC K Series", "status": true, "sub": false },
            { "grade": "K1111", "netweightArray": [750, 800], "description": "PPC K Series", "status": true, "sub": false },
            { "grade": "K4510B", "netweightArray": [750, 800, 900, 16500, 18000], "description": "PPC K4510 Black", "status": true, "sub": false },
            { "grade": "K4510ET", "netweightArray": [750, 800], "description": "PPC K4510 Enhanced", "status": true, "sub": false },
            { "grade": "K4520UB", "netweightArray": [750, 800], "description": "PPC K4520 Ultra Black", "status": true, "sub": false },
            { "grade": "K4527B", "netweightArray": [750, 800], "description": "PPC K4527 Black", "status": true, "sub": false },
            { "grade": "K4527ET", "netweightArray": [750, 800], "description": "PPC K4527 Enhanced", "status": true, "sub": false },
            { "grade": "K4527GR", "netweightArray": [750, 800], "description": "PPC K4527 Green", "status": true, "sub": false },
            { "grade": "NBC03HRA", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "NBC03HRAM", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
            { "grade": "S1003", "netweightArray": [750, 800], "description": "PPC Standard Grade", "status": true, "sub": false }
        ],

        // Validation rules
        validation: {
            lotLength: 8,
            lotPattern: /^\d{8}$/,
            requiredFields: ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate']
        }
    }
};

/**
 * Get unit configuration by unit name
 * @param {string} unit - Unit name (HDPE, PP, PPC)
 * @returns {Object} Unit configuration
 */
export function getUnitConfig(unit) {
    const upperUnit = unit?.toUpperCase();
    return UNIT_CONFIG[upperUnit] || UNIT_CONFIG.HDPE;
}

/**
 * Check if unit is valid
 * @param {string} unit - Unit name
 * @returns {boolean} True if valid
 */
export function isValidUnit(unit) {
    const upperUnit = unit?.toUpperCase();
    return upperUnit in UNIT_CONFIG;
}

/**
 * Generate grade options with SUB variants
 * @param {string} unit - Unit name (HDPE, PP, PPC)
 * @returns {Array} Array of grade option objects { grade, netweight, isSub, displayText }
 */
export function generateGradeOptions(unit) {
    const config = getUnitConfig(unit);
    const options = [];

    config.gradeData.forEach(gradeConfig => {
        // Skip inactive grades
        if (gradeConfig.status === false) return;

        gradeConfig.netweightArray.forEach(netweight => {
            // Add premium version
            options.push({
                grade: gradeConfig.grade,
                netweight: netweight,
                isSub: false,
                displayText: `${gradeConfig.grade}/${netweight}`,
                description: gradeConfig.description
            });

            // Add SUB version if configured
            if (gradeConfig.sub === true) {
                options.push({
                    grade: gradeConfig.grade,
                    netweight: netweight,
                    isSub: true,
                    displayText: `${gradeConfig.grade} SUB/${netweight}`,
                    description: `${gradeConfig.description} (SUB)`
                });
            }
        });
    });

    return options;
}
