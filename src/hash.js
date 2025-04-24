// file: hashPassword.mjs hoặc .js nếu đã set "type": "module"
import bcrypt from 'bcrypt';

const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Mật khẩu gốc:', plainPassword);
    console.log('Mật khẩu đã hash:', hashedPassword);
  } catch (err) {
    console.error('Lỗi khi hash mật khẩu:', err.message);
  }
};

hashPassword('mySecret123');
const comparePasswords = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (isMatch) {
      console.log('✅ Mật khẩu đúng');
    } else {
      console.log('❌ Mật khẩu sai');
    }
  };
  
  // Ví dụ dùng:
  // Giả sử hashedPassword lấy từ DB
  const hashedFromDB = '2b$10$KIw73fUaCyHEelo0LwcEbehhapke752kQ/bbF36QnSGgCktEBtdUK'; // chuỗi hash mẫu
  comparePasswords('mySecret123', hashedFromDB);
  