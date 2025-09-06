const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'password123';
  console.log('Original password:', password);

  // Hash the password (same as in create-admin.js)
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log('Hashed password:', hashedPassword);

  // Test comparison
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password comparison result:', isValid);

  // Test with wrong password
  const isValidWrong = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('Wrong password comparison result:', isValidWrong);
}

testPassword();