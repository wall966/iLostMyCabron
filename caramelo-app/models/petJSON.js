var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth');

/*Declaration de chaque element dans la base de donnes par type*/
const PetsSchema = new mongoose.Schema({
    Id_Pets: Number,
    Name: String,
    Ricover: String,
    Vet: String,
    Status: String,
    Photo: String,
    Chip_number: String,
    Age: Number,
    Vaccination: String,
    Species: String,
    Breed: String,
    GPS_coordinates: String,
    Description: String,
    Date_time: String,
    Finder: String,
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }

}, {
    collection: 'pets',
    versionKey: false
});
const Pets = mongoose.model('pets', PetsSchema)


/* CRUD pour recuperer seulement les animaux avec le mem ID du user */
router.get('/pets/mine',authMiddleware, async (req, res) => {
    try {
        // liste vide = pas encore d'annonce (pas une erreur)
        const data = await Pets.find({Owner: req.user.id});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/*CRUD pour ajoute une nouvelle pet (CREATE), validation de token avec authMiddleware */
router.post('/pets',authMiddleware, async (req, res) => {
    try {   
        const pet = new Pets({...req.body,Owner: req.user.id});
        const data = await pet.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* CRUD c'est pour lire en liste les archives provenants de la base de donnes (READ) */
router.get('/pets', async (req, res) => {
    try {
        const data = await Pets.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* CRUD c'est pour lire une par une les archives provenants de la base de donnes (READ) */
router.get('/pets/:id', async (req, res) => {
    try {

        // un identifiant mal formé = annonce introuvable (et non une erreur serveur)
        const data = mongoose.isValidObjectId(req.params.id) && await Pets.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Aucune pet trouve avec notre recherche"
            });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Vérifie que la personne connectée est bien celle qui a créé l'annonce (ou un admin) */
async function findOwnPet(req, res) {
    const pet = mongoose.isValidObjectId(req.params.id) && await Pets.findById(req.params.id);
    if (!pet) {
        res.status(404).json({ message: "Pet non trouvé" });
        return null;
    }
    if (String(pet.Owner) !== String(req.user.id) && req.user.profile !== 'admin') {
        res.status(403).json({ message: "Vous ne pouvez modifier que vos propres annonces" });
        return null;
    }
    return pet;
}

/* CRUD actualiser pet (UPDATE), réservé au propriétaire de l'annonce */
router.put('/pets/:id', authMiddleware, async (req, res) => {
    try {
        const pet = await findOwnPet(req, res);
        if (!pet) return;

        // on empêche de changer le propriétaire ou l'identifiant de l'annonce
        const { _id, Owner, ...changes } = req.body;
        pet.set(changes);
        const data = await pet.save();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*CRUD delete une pet(DELETE), réservé au propriétaire de l'annonce */
router.delete('/pets/:id', authMiddleware, async (req, res) => {
    try {
        const pet = await findOwnPet(req, res);
        if (!pet) return;

        await pet.deleteOne();
        res.json(pet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
