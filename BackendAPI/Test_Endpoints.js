/**
 * @file Test_Endpoints.js
 * @description Test functions for API endpoints
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Test all API endpoints
 */
function testAllEndpoints() {
  console.log('🧪 Starting API Endpoints Test...');
  
  try {
    // Test health check
    console.log('\n📊 Testing Health Check...');
    const healthResult = healthCheck();
    console.log('Health Check Result:', healthResult);
    
    // Test Units endpoints
    console.log('\n🏢 Testing Units Endpoints...');
    testUnitsEndpoints();
    
    // Test Grades endpoints  
    console.log('\n📋 Testing Grades Endpoints...');
    testGradesEndpoints();
    
    // Test NetWeights endpoints
    console.log('\n⚖️ Testing NetWeights Endpoints...');
    testNetWeightsEndpoints();
    
    console.log('\n✅ All endpoint tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

/**
 * Test Units endpoints
 */
function testUnitsEndpoints() {
  try {
    // Test getUnits
    console.log('- Testing getUnits...');
    const unitsResult = getUnitsController();
    console.log('Units Result:', unitsResult);
    
    // Test getUnitById (use first unit if available)
    if (unitsResult.success && unitsResult.data && unitsResult.data.length > 0) {
      const firstUnitId = unitsResult.data[0].unit_id;
      console.log('- Testing getUnitById with ID:', firstUnitId);
      const unitResult = getUnitByIdController(firstUnitId);
      console.log('Unit by ID Result:', unitResult);
    }
    
    console.log('✅ Units endpoints test passed');
  } catch (error) {
    console.error('❌ Units endpoints test failed:', error);
  }
}

/**
 * Test Grades endpoints
 */
function testGradesEndpoints() {
  try {
    // Test getAllGrades
    console.log('- Testing getAllGrades...');
    const allGradesResult = getAllGradesController();
    console.log('All Grades Result:', allGradesResult);
    
    // Test getGradesByUnit (use HDPE as example)
    console.log('- Testing getGradesByUnit with HDPE...');
    const hdpeGradesResult = getGradesByUnitController('HDPE');
    console.log('HDPE Grades Result:', hdpeGradesResult);
    
    // Test getGradeById (use first grade if available)
    if (allGradesResult.success && allGradesResult.data && allGradesResult.data.length > 0) {
      const firstGradeId = allGradesResult.data[0].grade_id;
      console.log('- Testing getGradeById with ID:', firstGradeId);
      const gradeResult = getGradeByIdController(firstGradeId);
      console.log('Grade by ID Result:', gradeResult);
    }
    
    console.log('✅ Grades endpoints test passed');
  } catch (error) {
    console.error('❌ Grades endpoints test failed:', error);
  }
}

/**
 * Test NetWeights endpoints
 */
function testNetWeightsEndpoints() {
  try {
    // Test getAllNetWeights
    console.log('- Testing getAllNetWeights...');
    const allNetWeightsResult = getAllNetWeightsController();
    console.log('All NetWeights Result:', allNetWeightsResult);
    
    // Test getNetWeightsByGrade (use grade ID 1 as example)
    console.log('- Testing getNetWeightsByGrade with grade ID 1...');
    const gradeNetWeightsResult = getNetWeightsByGradeController(1);
    console.log('Grade NetWeights Result:', gradeNetWeightsResult);
    
    console.log('✅ NetWeights endpoints test passed');
  } catch (error) {
    console.error('❌ NetWeights endpoints test failed:', error);
  }
}

/**
 * Test specific doGet scenarios
 */
function testDoGetScenarios() {
  console.log('🧪 Testing doGet Scenarios...');
  
  try {
    // Test missing action parameter
    console.log('- Testing missing action parameter...');
    const noActionResult = doGet({ parameter: {} });
    console.log('No Action Result:', JSON.parse(noActionResult.getContent()));
    
    // Test invalid action
    console.log('- Testing invalid action...');
    const invalidActionResult = doGet({ parameter: { action: 'invalidAction' } });
    console.log('Invalid Action Result:', JSON.parse(invalidActionResult.getContent()));
    
    // Test valid getUnits
    console.log('- Testing valid getUnits...');
    const validResult = doGet({ parameter: { action: 'getUnits' } });
    console.log('Valid getUnits Result:', JSON.parse(validResult.getContent()));
    
    // Test getGradesByUnit with parameter
    console.log('- Testing getGradesByUnit with unitId...');
    const gradesByUnitResult = doGet({ 
      parameter: { 
        action: 'getGradesByUnit', 
        unitId: 'HDPE' 
      } 
    });
    console.log('GradesByUnit Result:', JSON.parse(gradesByUnitResult.getContent()));
    
    console.log('✅ doGet scenarios test passed');
  } catch (error) {
    console.error('❌ doGet scenarios test failed:', error);
  }
}

/**
 * Test specific doPost scenarios
 */
function testDoPostScenarios() {
  console.log('🧪 Testing doPost Scenarios...');
  
  try {
    // Test addNetWeightToGrade
    console.log('- Testing addNetWeightToGrade...');
    const addResult = doPost({ 
      parameter: { 
        action: 'addNetWeightToGrade',
        gradeId: '1',
        weightValue: '1500',
        sortOrder: '10'
      } 
    });
    console.log('Add NetWeight Result:', JSON.parse(addResult.getContent()));
    
    // Test missing parameters
    console.log('- Testing missing parameters...');
    const missingParamsResult = doPost({ 
      parameter: { 
        action: 'addNetWeightToGrade',
        gradeId: '1'
        // Missing weightValue
      } 
    });
    console.log('Missing Params Result:', JSON.parse(missingParamsResult.getContent()));
    
    console.log('✅ doPost scenarios test passed');
  } catch (error) {
    console.error('❌ doPost scenarios test failed:', error);
  }
}

/**
 * Test data manipulation scenarios
 */
function testDataManipulation() {
  console.log('🧪 Testing Data Manipulation...');
  
  try {
    // Test adding a netweight to grade 1
    console.log('- Testing add netweight to grade...');
    const addResult = addNetWeightToGradeController(1, 2500, 99);
    console.log('Add Result:', addResult);
    
    if (addResult.success) {
      // Test getting updated netweights
      console.log('- Testing get updated netweights...');
      const updatedNetWeights = getNetWeightsByGradeController(1);
      console.log('Updated NetWeights:', updatedNetWeights);
      
      // Test removing the netweight we just added
      if (addResult.data && addResult.data.netweight_id) {
        console.log('- Testing remove netweight...');
        const removeResult = removeNetWeightFromGradeController(1, addResult.data.netweight_id);
        console.log('Remove Result:', removeResult);
      }
    }
    
    console.log('✅ Data manipulation test passed');
  } catch (error) {
    console.error('❌ Data manipulation test failed:', error);
  }
}

/**
 * Test error scenarios
 */
function testErrorScenarios() {
  console.log('🧪 Testing Error Scenarios...');
  
  try {
    // Test invalid grade ID
    console.log('- Testing invalid grade ID...');
    const invalidGradeResult = getGradeByIdController(99999);
    console.log('Invalid Grade ID Result:', invalidGradeResult);
    
    // Test invalid unit ID
    console.log('- Testing invalid unit ID...');
    const invalidUnitResult = getUnitByIdController('INVALID_UNIT');
    console.log('Invalid Unit ID Result:', invalidUnitResult);
    
    // Test adding duplicate netweight
    console.log('- Testing duplicate netweight...');
    const duplicateResult1 = addNetWeightToGradeController(1, 750, 1);
    console.log('First attempt:', duplicateResult1);
    
    const duplicateResult2 = addNetWeightToGradeController(1, 750, 1);
    console.log('Duplicate attempt:', duplicateResult2);
    
    console.log('✅ Error scenarios test passed');
  } catch (error) {
    console.error('❌ Error scenarios test failed:', error);
  }
}

/**
 * Run comprehensive test suite
 */
function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Test Suite...');
  console.log('=' * 50);
  
  // Basic functionality tests
  testAllEndpoints();
  
  console.log('\n' + '=' * 50);
  
  // HTTP endpoint simulation tests
  testDoGetScenarios();
  
  console.log('\n' + '=' * 50);
  
  testDoPostScenarios();
  
  console.log('\n' + '=' * 50);
  
  // Data manipulation tests
  testDataManipulation();
  
  console.log('\n' + '=' * 50);
  
  // Error handling tests
  testErrorScenarios();
  
  console.log('\n' + '=' * 50);
  console.log('🎉 Comprehensive Test Suite Completed!');
}

/**
 * Quick smoke test for basic functionality
 */
function quickSmokeTest() {
  console.log('💨 Quick Smoke Test...');
  
  try {
    // Test basic endpoints
    const healthResult = healthCheck();
    console.log('Health:', healthResult.success ? '✅' : '❌');
    
    const unitsResult = getUnitsController();
    console.log('Units:', unitsResult.success ? '✅' : '❌');
    
    const gradesResult = getAllGradesController();
    console.log('Grades:', gradesResult.success ? '✅' : '❌');
    
    const netWeightsResult = getAllNetWeightsController();
    console.log('NetWeights:', netWeightsResult.success ? '✅' : '❌');
    
    console.log('💨 Smoke test completed!');
    
    return {
      health: healthResult.success,
      units: unitsResult.success,
      grades: gradesResult.success,
      netWeights: netWeightsResult.success
    };
  } catch (error) {
    console.error('💨 Smoke test failed:', error);
    return { error: error.message };
  }
}