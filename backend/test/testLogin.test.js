let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const should = chai.should();
chai.use(chaiHttp);
require('./test.env.js');
//const connection = require("../db/db");



describe('/POST login', () => {

//     let transaction;
// before(async () => {
//   try {
//     // Démarrez une transaction Sequelize
//     transaction = await connection.transaction();
//   } catch (err) {
//     console.error('Erreur lors du démarrage de la transaction de test :', err);
//   }
//   return Promise.resolve(); // Ajoutez cette ligne pour résoudre le problème
// });

// after(async () => {
//   try {
//     // Une fois que tous les tests sont terminés, faites un rollback de la transaction pour annuler les modifications dans la base de données.
//     await transaction.rollback();
//   } catch (err) {
//     console.error('Erreur lors de l\'annulation de la transaction de test :', err);
//   }
//   return Promise.resolve(); // Ajoutez cette ligne pour résoudre le problème
// });



    it('it should signup a new user', (done) => {
      chai.request(server)
        .post('/signup')
        .send({ email: 'test@user333844569874546565.com', password: 'testpassword', website: 'test' })
        .end((err, res) => {
          res.should.have.status(201);
          // Assurez-vous d'avoir une propriété appropriée dans la réponse pour le nouvel utilisateur créé.
          res.body.should.have.property('message').eql('Utilisateur créé !');
          done();
        });
    });
    it('erreur mot de passe - de 8 char ', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'test@user2.com', password: 'test', website: 'test' })
          .end((err, res) => {
            res.should.have.status(400);
            // Assurez-vous d'avoir une propriété appropriée dans la réponse pour le nouvel utilisateur créé.
            res.body.should.have.property('error').eql('Le mot de passe doit contenir entre 8 et 32 caractères.');
            done();
          });
      });
      it('erreur mot de passe + de 382 char ', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'test@user3.com', password: 'test12345678912345678912345678912', website: 'test' })
          .end((err, res) => {
            res.should.have.status(400);
            // Assurez-vous d'avoir une propriété appropriée dans la réponse pour le nouvel utilisateur créé.
            res.body.should.have.property('error').eql('Le mot de passe doit contenir entre 8 et 32 caractères.');
            done();
          });
      });
      it('erreur email sans @ ', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'testuser3.com', password: 'testtest', website: 'test' })
          .end((err, res) => {
            res.should.have.status(400);
            // Assurez-vous d'avoir une propriété appropriée dans la réponse pour le nouvel utilisateur créé.
            res.body.should.have.property('error').eql("L'adresse e-mail est invalide.");
            done();
          });
      });
      it('erreur email sans . ', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'testuser3@com', password: 'testtest', website: 'test' })
          .end((err, res) => {
            res.should.have.status(400);
            // Assurez-vous d'avoir une propriété appropriée dans la réponse pour le nouvel utilisateur créé.
            res.body.should.have.property('error').eql("L'adresse e-mail est invalide.");
            done();
          });
      });
      it('erreur email sans . ni @ ', (done) => {
        chai.request(server)
          .post('/signup')
          .send({ email: 'testuser3@com', password: 'testtest', website: 'test' })
          .end((err, res) => {
            res.should.have.status(400);
            // Assurez-vous d'avoir une propriété appropriée dans la réponse pour le nouvel utilisateur créé.
            res.body.should.have.property('error').eql("L'adresse e-mail est invalide.");
            done();
          });
      });
  
  });
