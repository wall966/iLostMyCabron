import { Card, Accordion, ListGroup } from "react-bootstrap";

function AnimalCard({ animal }) {
    return (
        <Card className="animal-card">
            <div className="card-img-wrapper">
                <Card.Img variant="top" src={animal.Photo} />
                <span className={`status-badge ${animal.Status === 'perdu' ? 'status-perdu' : 'status-trouve'}`}>
                    {animal.Status}
                </span>
            </div>
            <Card.Body className="animal-card-body">
                <Card.Title>{animal.Name}</Card.Title>

                <ListGroup className="list-group-flush">
                    <ListGroup.Item>{animal.Breed}</ListGroup.Item>
                    <ListGroup.Item>Date et heure : {animal.Date_time}</ListGroup.Item>
                    <ListGroup.Item>Localisation : {animal.GPS_coordinates || 'Non renseignée'}</ListGroup.Item>
                </ListGroup>
                <Accordion className="mt-2">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Voir la description</Accordion.Header>
                        <Accordion.Body>
                            {animal.Description}
                            <hr />
                            Contact :
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    );
}

function Cards({ filtre, animals, filters }) {
    // Ignore les accents et majuscules (la base de données utilise "trouvé")
    const normalise = (str) => (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filteredAnimals = animals.filter((animal) => {
        // Filtre par statut (menu latéral du header)
        if (filtre !== "tous" && normalise(animal.Status) !== normalise(filtre)) return false;

        // Filtre par la barre de recherche (venant du Welcome.jsx)
        return filters.every((f) => {
            if (f.type === 'Nom') return animal.Name === f.value;
            if (f.type === 'Statut') return animal.Status === f.value;
            if (f.type === 'Espèce') return animal.Species === f.value;
            if (f.type === 'Race') return animal.Breed === f.value;
            if (f.type === 'Numéro de puce') return animal.Chip_number === f.value;
            if (f.type === 'Description') return animal.Description === f.value;
            return true;
        });
    });

    return (
        <div className="cards-layout">
            <div className='cards-row'>
                {filteredAnimals.map((animal) => (
                    <AnimalCard key={animal._id} animal={animal} />
                ))}
            </div>
        </div>
    );
}

export default Cards;