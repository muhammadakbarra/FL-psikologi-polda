const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient();

// Verifikasi token user atau admin
const verifyToken = async (req, res, next) => {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const decoded = jwt.verify(token, config.jwtSecret);

        if (decoded.type === 'admin') {
            const admin = await prisma.admin.findUnique({
                where: { id: decoded.id },
            });

            if (!admin) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Admin not found',
                });
            }

            req.user = admin;
            req.userType = 'admin';
            req.role = admin.role;
        } else if (decoded.type === 'user') {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                });
            }

            req.user = user;
            req.userType = 'user';
            req.role = 'USER';
        } else {
            return res.status(403).json({
                status: 'error',
                message: 'Invalid token type',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token',
        });
    }
};

// Verifikasi khusus admin
const verifyAdmin = (req, res, next) => {
    if (req.userType !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Admin access required',
        });
    }
    next();
};

// Verifikasi khusus superadmin
const verifySuperAdmin = (req, res, next) => {
    if (req.userType !== 'admin' || req.role !== 'SUPERADMIN') {
        return res.status(403).json({
            status: 'error',
            message: 'Superadmin access required',
        });
    }
    next();
};

// Helper function to extract token
const getTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifySuperAdmin,
};
