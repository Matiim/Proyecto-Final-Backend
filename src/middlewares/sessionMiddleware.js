const customError = require('../service/customErrors')
const EErrors = require('../service/enums')

const isAuth = (req,res,next) =>{
	if(req.headers && req.headers.cookie && req.headers.cookie.replace('authTokenCookie=', '')){
		return res.redirect('/login')
	}
	return next()
}

//middleware para admin
const authorizationMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
			const error = customError.createError({
				name: 'Error de autirizacion',
				cause: 'No tienes autorizacion',
				message:'No tienes autorizacion',
				code: EErrors.AUTHORIZATION_ERROR
			})
            return next(error)
        }

        next()
    };
};

module.exports = {
	isAuth,
	authorizationMiddleware
}