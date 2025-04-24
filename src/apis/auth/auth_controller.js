import AuthService from './auth_service.js';

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      console.log('Request data:', req.body); 

      const newUser = await AuthService.register(name, email, password);

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: newUser
      });
    } catch (err) {
      console.error('Error during registration:', err); 
      return res.status(400).json({
        success: false,
        message: err.message || 'Đã xảy ra lỗi'
      });
    }
  }
}

export default new AuthController();
