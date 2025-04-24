import bcrypt from 'bcrypt';
import UserRepository from '../../repositories/user.repositories.js';  
const userRepo = new UserRepository();

class AuthService {
  async register(username, email, password) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await userRepo.getOneByEmail(email);
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await userRepo.create({
      name: username,
      email,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }
}

export default new AuthService();
