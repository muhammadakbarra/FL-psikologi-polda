const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username dan password harus diisi',
            });
        }

        // Coba login dengan admin dulu, kemudian user jika admin gagal
        const result = await authService.login(username, password);

        res.status(200).json({
            status: 'success',
            message: 'Login berhasil',
            data: result,
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: error.message || 'Login gagal',
        });
    }
};

module.exports = {
    login,
};
