const bcrypt = require('bcrypt');

const plainPassword = 'admin123'; // Change this if needed

bcrypt.hash(plainPassword, 10).then(hash => {
  console.log('✅ Hashed password for insertion:');
  console.log(hash);
}).catch(err => {
  console.error('❌ Error hashing password:', err);
});
