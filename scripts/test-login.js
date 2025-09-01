const { loginSchema } = require('../dist/lib/validations/auth.js');

async function testLoginValidation() {
  try {
    console.log('Testing login validation...');

    const testCredentials = {
      email: 'admin@nambakadai.com',
      password: 'password123',
      deviceToken: 'test-token'
    };

    console.log('Input credentials:', testCredentials);

    const validated = loginSchema.parse(testCredentials);
    console.log('✅ Validation passed:', validated);

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    console.error('Error details:', error);
  }
}

testLoginValidation();