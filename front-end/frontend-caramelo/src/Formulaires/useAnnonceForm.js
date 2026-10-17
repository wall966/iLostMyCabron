// Logique commune aux formulaires "animal perdu" et "animal trouvé" : chargement, position GPS et envoi
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/fr";
import "dayjs/locale/pt-br";
import { uploadPhoto } from "../supabase";
import { getValidToken } from "../auth";
import { usePreferences } from "../preferences";
import { API_URL } from "../config";

dayjs.locale("fr");
// Permet de relire une date au format "JJ/MM/AAAA HH:mm" (sinon dayjs inverse jour et mois)
dayjs.extend(customParseFormat);

export const FORMAT_DATE = "DD/MM/YYYY HH:mm";

/* Gère le formulaire d'une annonce : chargement en mode modification, position GPS et envoi.
   status = "perdu" ou "trouvé" (ajouté automatiquement à l'annonce) */
export function useAnnonceForm(status) {
    const form = useForm();
    const { reset, setValue } = form;
    const navigate = useNavigate();
    const { t } = usePreferences();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [currentPhoto, setCurrentPhoto] = useState("");
    const [submitError, setSubmitError] = useState("");

    // En modification : on pré-remplit le formulaire avec l'annonce existante
    useEffect(() => {
        if (!id) return;
        axios.get(`${API_URL}/pets/${id}`, {
            headers: { Authorization: `Bearer ${getValidToken()}` }
        })
            .then((response) => {
                // La photo actuelle est gardée à part : le champ fichier ne peut pas contenir un lien
                const { Photo, ...pet } = response.data;
                setCurrentPhoto(Photo);
                reset({
                    ...pet,
                    Date_time: pet.Date_time ? dayjs(pet.Date_time, FORMAT_DATE) : null,
                });
            })
            .catch((error) => console.error("Erreur chargement pet:", error.response?.data || error.message));
    }, [id, reset]);

    // Remplit le champ lieu avec la ville de la position actuelle
    const handleGPS = () => {
        if (!navigator.geolocation) {
            alert(t("form.geoNonSupportee"));
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
                    const ville = address.city || address.town || address.village || address.municipality || coords;
                    setValue("GPS_coordinates", ville, { shouldValidate: true });
                } catch (error) {
                    console.error("Erreur géocodage:", error);
                    setValue("GPS_coordinates", coords, { shouldValidate: true });
                }
            },
            (err) => {
                if (err.code === 1) {
                    alert(t("form.geoRefusee"));
                } else {
                    alert(t("form.geoImpossible"));
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Envoie la photo sur supabase puis l'annonce au back-end (création ou modification)
    const onSubmit = async (data) => {
        const { Photo, ...resto } = data;
        setSubmitError("");
        try {
            const annonce = {
                ...resto,
                Date_time: data.Date_time.format(FORMAT_DATE),
                Photo: await uploadPhoto(Photo, currentPhoto),
                Status: status,
            };
            const config = { headers: { Authorization: `Bearer ${getValidToken()}` } };
            if (isEditMode) {
                await axios.put(`${API_URL}/pets/${id}`, annonce, config);
            } else {
                await axios.post(`${API_URL}/pets`, annonce, config);
            }
            navigate("/account");
        } catch (error) {
            console.error("Erreur:", error.response?.data || error.message);
            setSubmitError(error.response?.data?.message || t("form.erreurEnregistrement"));
        }
    };

    return { form, isEditMode, submitError, handleGPS, submit: form.handleSubmit(onSubmit) };
}
