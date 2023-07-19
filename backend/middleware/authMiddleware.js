const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Récupérer le cookie 'token'
    console.log(req.cookies);
    const token = req.cookies["token"];

    // Vérifier si le cookie est présent
    if (!token) {
        return res.status(401).json({ error: 'Authentification requise !' });
    }

    try {
        // Vérifier et décoder le jeton
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        req.userToken = decodedToken.userToken; // Ajouter l'ID de l'utilisateur à la requête

        // Passer au middleware suivant
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide !' });
    }
}

module.exports = authMiddleware;
