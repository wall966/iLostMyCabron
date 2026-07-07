import { useForm, Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import "dayjs/locale/fr";
import "./Styles.css";
dayjs.locale("fr");
import { supabase } from "../supabase";
import { useEffect, useState } from "react";



/*Permettre que le useForm recuperer les resultats em form d'une objet et les reagrouper */
const FormPerdu = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    //Rechargement de la page apres l'envoie du formulaire
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [currentPhoto, setCurrentPhoto] = useState("");

    useEffect(() => {
        if (!isEditMode) return;

        const fetchPet = async () => {

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/pets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const pet = response.data;
                setCurrentPhoto(pet.Photo);
                reset({
                    ...pet,
                    Date_time: dayjs(pet.Date_time, "DD/MM/YYYY HH:mm"),
                });
            } catch (error) {
                console.error("Erreur chargement pet:", error.response?.data || error.message);
            }
        };
        fetchPet();
    }, [id]);


    /* function pour recuperer les coordonnes gps de ta position */
    const handleGPS = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const address = response.data.address;
                    const ville =
                        address.city ||
                        address.town ||
                        address.village ||
                        address.municipality ||
                        coords;

                    setValue("GPS_coordinates", ville, { shouldValidate: true });
                } catch (error) {
                    console.error("Erreur géocodage:", error);
                    setValue("GPS_coordinates", coords, { shouldValidate: true });
                }
            },
            (err) => {
                if (err.code === 1) {
                    alert("Accès à la localisation refusé. Veuillez l'autoriser dans les paramètres de votre navigateur.");
                } else {
                    alert("Impossible d'obtenir votre position. Vérifiez que la localisation est activée.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    /* function pour agrouper les donnes reçus au formulaire et les envoyer a la base de donnes(mongoDB) plus supabasepour armazener les photos e returner une lien public */
    const onSubmit = async (data) => {
        const { Photo, ...resto } = data;
        let photoUrl = currentPhoto;
        const Status = "perdu";

        try {
                    if (Photo.length > 0) {
                const file = Photo[0];
                
                // Remove acentos, espaços e caracteres especiais do nome original
                const sanitizedName = file.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")   // remove acentos
                    .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // troca qualquer coisa que não seja letra/número/ponto/hífen/underline por "_"

                const fileName = `${Date.now()}_${sanitizedName}`;

                const { error: uploadError } = await supabase.storage
                    .from("photos")
                    .upload(fileName, file); 

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from("photos")
                    .getPublicUrl(fileName);

                photoUrl = publicUrlData.publicUrl;
            }

            const token = localStorage.getItem("token");
            /*O status est ajoute directement au back-end au moment de l'envoi du formulaire */
            const dataFormate = {
                ...resto,
                Date_time: data.Date_time.format("DD/MM/YYYY HH:mm"),
                Photo: photoUrl,
                Status: Status
            };

            if (isEditMode) {
                await axios.put(`http://localhost:3000/pets/${id}`, dataFormate, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("http://localhost:3000/pets", dataFormate, {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }});
            }

            navigate("/account");
        } catch (error) {
            console.log(error)
            console.error("Erreur:", error.response?.data || error.message);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}
            adapterLocale="fr"
            localeText={{
                fieldDayPlaceholder: () => "JJ",
                fieldMonthPlaceholder: () => "MM",
                fieldYearPlaceholder: () => "AAAA",
                fieldHoursPlaceholder: () => "HH",
                fieldMinutesPlaceholder: () => "mm",
            }}>
            <section className="perdu-container">
                <form className="perdu-form" onSubmit={handleSubmit(onSubmit)} noValidate>

                    <h3>J'AI PERDU MON ANIMAL 🐾</h3>

                    {/*Nom de l'animal */}
                    <div className="floating-label">
                        <input
                            type="text"
                            placeholder=" "
                            className={errors.Name ? "input-error" : ""}
                            {...register("Name", { required: "Le nom est obligatoire" })}
                        />
                        <label>Nom </label>
                    </div>
                    {errors.Name && <p className="error-message">{errors.Name.message}</p>}

                    {/*L'age de l'animal */}
                    <div className="floating-label">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder=" "
                            className={errors.Age ? "input-error" : ""}
                            {...register("Age", {
                                pattern: { value: /^[0-9]*$/, message: "Entrez un nombre valide" },
                            })}
                        />
                        <label>Age</label>
                    </div>
                    {errors.Age && <p className="error-message">{errors.Age.message}</p>}

                    {/*Numero de la pulse do chien */}
                    <div className="floating-label">
                        <input
                            type="text"
                            placeholder=""
                            {...register("Chip_number")}
                        />
                        <label>Numéro de puce (chip)</label>
                    </div>

                    {/*Radio para s s'il est vaccine */}
                    <div className="radio-block">
                        <span className="radio-label">Vaccination à jour ?</span>
                        <div className="radio-group" >
                            <label><input type="radio" value="oui" {...register("Vaccine")} /> Oui</label>
                            <label><input type="radio" value="non" {...register("Vaccine")} /> Non</label>
                        </div>
                    </div>

                    {/*Selector de species */}
                    <p></p>
                    <select
                        className={errors.Species ? "input-error" : ""}
                        {...register("Species", { required: "Veuillez choisir une espèce" })}
                    >
                        <option value="">Espèce </option>
                        <option value="chien">Chien</option>
                        <option value="chat">Chat</option>
                        <option value="equides">Équidés</option>
                    </select>
                    {errors.Species && <p className="error-message">{errors.Species.message}</p>}
                    <p></p>
                    <div className="floating-label">
                        <input
                            type="text"
                            placeholder=" "
                            {...register("Race")}
                        />
                        <label>Race — ex : Labrador, Berger allemand…</label>
                    </div>

                    {/* Date et Heure  */}
                    <div className="datetime-block">
                        <Controller
                            name="Date_time"
                            control={control}
                            rules={{ required: "La date et l'heure sont obligatoires" }}
                            render={({ field }) => (
                                <DateTimePicker
                                    label="Date et heure de disparition"
                                    value={field.value ?? null}
                                    onChange={(val) => field.onChange(val)}
                                    defaultValue={dayjs()}
                                    format="DD/MM/YYYY HH:mm"
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    slotProps={{
                                        textField: {
                                            className: errors.Date_time ? "input-error" : "",
                                        },
                                    }}
                                />
                            )}
                        />
                        {errors.Date_time && (
                            <p className="error-message">{errors.Date_time.message}</p>
                        )}
                    </div>

                    {/*Button ma position, plus place pour ecrire la ville ou vous avez perdu */}
                    <div className="lieu-block">
                        <label className="field-label">Lieu de disparition </label>
                        <input
                            type="text"
                            placeholder="Adresse ou nom de ville"
                            className={errors.GPS_coordinates ? "input-error" : ""}
                            {...register("GPS_coordinates", { required: "Indiquez un lieu" })}
                        />
                        {errors.GPS_coordinates && <p className="error-message">{errors.GPS_coordinates.message}</p>}
                        <button type="button" className="btn-gps" onClick={handleGPS}>
                            📍 Ma position actuelle
                        </button>
                    </div>

                    {/*Pour recuperer la photo chez la galerie */}
                    <div className="datetime-block">
                        <label className="field-label">Photo de l'animal</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-file"
                            {...register("Photo")}
                        />
                    </div>

                    {/*Text area pour decrire l'animal perdu */}
                    <textarea
                        rows={3}
                        placeholder="Description — ex : collier bleu, tache blanche sur le dos…"
                        {...register("Description")}
                    />

                    {/*Button pour signaliser le animal perdu */}
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? "Envoi en cours..." : "Signaler un animal perdu"}
                    </button>

                </form>
            </section>
        </LocalizationProvider>
    );
};

export default FormPerdu;