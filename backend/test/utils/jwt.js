const jwt = require("jsonwebtoken");

function generateJWTAndCookie(user) {
    const token = jwt.sign(
        {
            userToken: user.api_token,
            userEmail: user.email,
            userRole: user.role,
            userId: user.id,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
    );

    // Créer le cookie contenant le token JWT
    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: false,
        signed: false,
    };

    return { token, cookieOptions };
}

module.exports = {
    generateJWTAndCookie,
};