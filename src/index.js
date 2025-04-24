import jwt from 'jsonwebtoken';
// Tạo JWT
const token = jwt.sign({ userId: 1 }, 'yourSecretKey', { expiresIn: '1h' });

// Xác thực JWT
jwt.verify(token, 'yourSecretKey', (err, decoded) => {
  if (err) {
    console.log('Token is invalid or expired');
  } else {
    console.log('Decoded data:', decoded);
  }
});
