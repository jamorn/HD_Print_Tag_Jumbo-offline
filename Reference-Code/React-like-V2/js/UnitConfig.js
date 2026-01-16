/**
 * Unit Configuration - Modern Tag Printing System V2
 * Centralized configuration for all production units
 */

export const UnitConfig = {
  UNITS: {
    HDPE: {
      id: 'HDPE',
      name: 'HDPE',
      fullName: 'High Density Polyethylene',
      description: 'HDPE Pellet Production Unit',
      
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

      // Grade data with auto-fill netweight
      gradeData: [
        { grade: 'P901BK', netweightArray: [750, 800, 900, 16500, 18000], description: 'Black Pipe Grade' },
        { grade: 'P921BK', netweightArray: [750, 800], description: 'Black Pipe Grade' },
        { grade: 'P921NT', netweightArray: [750], description: 'Natural Pipe Grade' },
        { grade: 'AM3245PC SUB', netweightArray: [750], description: 'Injection Grade' },
        { grade: 'P900BK', netweightArray: [750], description: 'Black Pipe Grade' },
        { grade: 'P900NT', netweightArray: [750], description: 'Natural Pipe Grade' },
        { grade: 'I055BK', netweightArray: [750], description: 'Injection Black' },
        { grade: 'I055NT', netweightArray: [750], description: 'Injection Natural' },
        { grade: 'B640BK', netweightArray: [750], description: 'Blow Molding Black' },
        { grade: 'B640NT', netweightArray: [750], description: 'Blow Molding Natural' }
      ],

      // Available templates for this unit
      availableTemplates: ['template1', 'template2', 'template3'],
      
      // Default template
      defaultTemplate: 'template3',

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
      
      defaults: {
        grade: '1105SC',
        netweight: '750',
        title1: 'PP',
        title2: 'POLYPROPYLENE',
        qrCodeImage: './images/svg/pp-qr-code-simple.svg',
        backgroundImage: 'images/polimaxx.jpg',
        qrCodeUrl: 'https://appdb.tisi.go.th/Q/i.php?d=3828891212'
      },

      gradeData: [
        { grade: '1102H', netweightArray: [750, 800, 900, 16500, 18000], description: 'PP Standard Grade', status: true },
        { grade: '1140H', netweightArray: [750, 800], description: 'PP High Flow', status: true },
        { grade: '1150H', netweightArray: [750], description: 'PP High Stiffness', status: true },
        { grade: '1202J', netweightArray: [750, 800], description: 'PP Injection Grade', status: true },
        { grade: '1102K', netweightArray: [750, 800, 900], description: 'PP Standard Grade', status: true },
        { grade: '1032L', netweightArray: [750], description: 'PP Low Flow', status: true },
        { grade: '1102M', netweightArray: [750, 800, 900, 16500, 18000], description: 'PP Medium Flow', status: true },
        { grade: '1100NK', netweightArray: [750, 800], description: 'PP Natural Grade', status: true },
        { grade: '1125NA', netweightArray: [750], description: 'PP Natural Grade A', status: true },
        { grade: '1126NK', netweightArray: [750, 800], description: 'PP Natural Grade NK', status: true },
        { grade: '1120NK', netweightArray: [750], description: 'PP Natural Grade 1120', status: true },
        { grade: '1100PK', netweightArray: [750, 800], description: 'PP Prime Grade', status: true },
        { grade: '1100RC', netweightArray: [750, 800, 900], description: 'PP Raffia Grade', status: true },
        { grade: '1111R', netweightArray: [750], description: 'PP Raffia Grade R', status: true },
        { grade: '1100S', netweightArray: [750, 800], description: 'PP Standard Grade S', status: true },
        { grade: '1140U', netweightArray: [750], description: 'PP Ultra Grade', status: true },
        { grade: '1140VC', netweightArray: [750, 800], description: 'PP VC Grade', status: true },
        { grade: '1105RC', netweightArray: [750, 800, 900], description: 'PP Raffia Grade RC', status: true },
        { grade: '1105SC', netweightArray: [750, 800, 900, 16500, 18000], description: 'PP Standard Grade SC', status: true },
        { grade: '1105TC', netweightArray: [750, 800], description: 'PP TC Grade', status: true },
        { grade: '1100XC', netweightArray: [750], description: 'PP XC Grade', status: true },
        { grade: '1100YC', netweightArray: [750, 800], description: 'PP YC Grade', status: true },
        { grade: '1100ZC', netweightArray: [750], description: 'PP ZC Grade', status: true },
        { grade: '2300K', netweightArray: [750, 800], description: 'PP 2300 Series', status: true },
        { grade: '2300NC', netweightArray: [750], description: 'PP 2300 Natural', status: true },
        { grade: '2300NCA', netweightArray: [750, 800], description: 'PP 2300 Natural A', status: true },
        { grade: '2500H', netweightArray: [750, 800, 900], description: 'PP 2500 High Flow', status: true },
        { grade: '2500M', netweightArray: [750, 800], description: 'PP 2500 Medium', status: true },
        { grade: '2500PC', netweightArray: [750], description: 'PP 2500 PC', status: true },
        { grade: '2363LC', netweightArray: [750, 800], description: 'PP 2363 LC', status: true },
        { grade: '3340H', netweightArray: [750, 800, 900], description: 'PP 3340 High Flow', status: true },
        { grade: '3340HMD', netweightArray: [750], description: 'PP 3340 HMD', status: true },
        { grade: '3325M', netweightArray: [750, 800], description: 'PP 3325 Medium', status: true },
        { grade: '3375RM', netweightArray: [750, 800, 900], description: 'PP 3375 RM', status: true },
        { grade: '3375SM', netweightArray: [750], description: 'PP 3375 SM', status: true },
        { grade: '3380SM', netweightArray: [750, 800], description: 'PP 3380 SM', status: true },
        { grade: '3312E', netweightArray: [750], description: 'PP 3312 E', status: true }
      ],

      availableTemplates: ['template1', 'template2'],
      defaultTemplate: 'template2',
      hasLogo: true,
      hasSirimLogo: false,

      validation: {
        lotLength: 10,
        lotPattern: /^\d{10}$/,
        requiredFields: ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate']
      }
    },

    PPC: {
      id: 'PPC',
      name: 'PPC',
      fullName: 'Polypropylene Copolymer',
      description: 'PPC Pellet Production Unit',
      
      defaults: {
        grade: 'FL203D',
        netweight: '750',
        title1: 'PPC',
        title2: 'POLYPROPYLENE COMPOUND',
        qrCodeImage: './images/svg/pp-qr-code-simple.svg',
        backgroundImage: 'images/polimaxx.jpg',
        qrCodeUrl: 'https://appdb.tisi.go.th/Q/i.php?d=3828891212'
      },

      gradeData: [
        { grade: 'B1101', netweightArray: [750, 800, 900], description: 'PPC Block Copolymer', status: true },
        { grade: 'FL203D', netweightArray: [750, 800], description: 'PPC Standard Grade', status: true },
        { grade: 'K1104', netweightArray: [750, 800], description: 'PPC K Series', status: true },
        { grade: 'K1111', netweightArray: [750], description: 'PPC K Series 1111', status: true },
        { grade: 'S1003', netweightArray: [750, 800, 900], description: 'PPC S Series', status: true },
        { grade: 'F1003B', netweightArray: [750, 800], description: 'PPC F Series Black', status: true },
        { grade: 'BC03B', netweightArray: [750, 800, 900], description: 'PPC BC Series Black', status: true },
        { grade: 'BC03BS', netweightArray: [750], description: 'PPC BC03 Black Special', status: true },
        { grade: 'BC03BSW', netweightArray: [750, 800], description: 'PPC BC03 Black SW', status: true },
        { grade: 'BC05B', netweightArray: [750, 800, 900], description: 'PPC BC05 Black', status: true },
        { grade: 'BC04NN', netweightArray: [750], description: 'PPC BC04 Natural', status: true },
        { grade: 'BC09CHA', netweightArray: [750, 800], description: 'PPC BC09 CHA', status: true },
        { grade: 'BC3AWT', netweightArray: [750, 800, 900], description: 'PPC BC3 AWT', status: true },
        { grade: 'BC3N', netweightArray: [750, 800], description: 'PPC BC3 Natural', status: true },
        { grade: 'BC3NSW', netweightArray: [750], description: 'PPC BC3 Natural SW', status: true },
        { grade: 'NBC03HRA', netweightArray: [750, 800, 900], description: 'PPC NBC03 HRA', status: true },
        { grade: 'NBC03HRAM', netweightArray: [750, 800], description: 'PPC NBC03 HRAM', status: true },
        { grade: 'K4510B', netweightArray: [750, 800, 900, 16500, 18000], description: 'PPC K4510 Black', status: true },
        { grade: 'K4510ET', netweightArray: [750, 800], description: 'PPC K4510 ET', status: true },
        { grade: 'K4520UB', netweightArray: [750, 800, 900], description: 'PPC K4520 UB', status: true },
        { grade: 'K4527B', netweightArray: [750, 800, 900, 16500, 18000], description: 'PPC K4527 Black', status: true },
        { grade: 'K4527ET', netweightArray: [750], description: 'PPC K4527 ET', status: true },
        { grade: 'K4527GR', netweightArray: [750, 800], description: 'PPC K4527 GR', status: true }
      ],

      availableTemplates: ['template1', 'template2'],
      defaultTemplate: 'template1',
      hasLogo: true,
      hasSirimLogo: false,

      validation: {
        lotLength: 10,
        lotPattern: /^\d{10}$/,
        requiredFields: ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate']
      }
    }
  }
};
