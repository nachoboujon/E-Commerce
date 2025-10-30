/* =================================================================
   VALIDADORES - AUTENTICACIÓN
   Express-Validator para validación robusta de inputs
   ================================================================= */

const { body, validationResult } = require('express-validator');

// Middleware para verificar resultados de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// ============================================================
// VALIDACIONES PARA REGISTRO
// ============================================================
const registroValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 30 }).withMessage('El username debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('El username solo puede contener letras, números y guiones bajos')
        .escape(),
    
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email muy largo'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre completo es requerido')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .escape(),
    
    body('telefono')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/).withMessage('Teléfono inválido')
        .escape(),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Dirección muy larga')
        .escape(),
    
    validate
];

// ============================================================
// VALIDACIONES PARA LOGIN
// ============================================================
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
    
    validate
];

// ============================================================
// VALIDACIONES PARA VERIFICACIÓN DE EMAIL
// ============================================================
const verificarEmailValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    body('codigo')
        .trim()
        .notEmpty().withMessage('El código es requerido')
        .isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 caracteres')
        .isNumeric().withMessage('El código debe ser numérico'),
    
    validate
];

// ============================================================
// VALIDACIONES PARA RECUPERAR PASSWORD
// ============================================================
const recuperarPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    validate
];

const resetPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    body('codigo')
        .trim()
        .notEmpty().withMessage('El código es requerido')
        .isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 caracteres'),
    
    body('nuevaPassword')
        .notEmpty().withMessage('La nueva contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    
    validate
];

module.exports = {
    registroValidation,
    loginValidation,
    verificarEmailValidation,
    recuperarPasswordValidation,
    resetPasswordValidation,
    validate
};

