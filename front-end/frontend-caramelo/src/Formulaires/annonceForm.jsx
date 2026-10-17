// Champs communs aux formulaires "animal perdu" (FormPerdu) et "animal trouvé" (FormTrouve)
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { FORMAT_DATE } from "./useAnnonceForm";
import { usePreferences } from "../preferences";
import "./Styles.css";

/* Cadre commun : calendrier dans la langue choisie, carte du formulaire, titre, message d'erreur et bouton d'envoi */
export function CadreFormulaire({ titre, texteBouton, annonce, children }) {
    const { submit, submitError, isEditMode, form } = annonce;
    const { isSubmitting } = form.formState;
    const { t, tServeur, theme, localeDayjs } = usePreferences();

    // Le calendrier (MUI) a son propre thème : on le passe en sombre avec le site
    const themeMui = useMemo(() => createTheme({ palette: { mode: theme } }), [theme]);

    return (
        <ThemeProvider theme={themeMui}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={localeDayjs}
                localeText={{
                    fieldDayPlaceholder: () => t("form.placeholderDate.jour"),
                    fieldMonthPlaceholder: () => t("form.placeholderDate.mois"),
                    fieldYearPlaceholder: () => t("form.placeholderDate.annee"),
                    fieldHoursPlaceholder: () => t("form.placeholderDate.heures"),
                    fieldMinutesPlaceholder: () => t("form.placeholderDate.minutes"),
                }}
            >
                <section className="perdu-container">
                    <form className="perdu-form" onSubmit={submit} noValidate>
                        <h3>{titre}</h3>

                        {children}

                        {submitError && <p className="error-message">{tServeur(submitError)}</p>}

                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? t("form.envoiEnCours") : isEditMode ? t("form.enregistrer") : texteBouton}
                        </button>
                    </form>
                </section>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

/* Champ texte avec étiquette qui remonte quand on écrit */
export function ChampTexte({ form, name, label, rules, numeric = false }) {
    const { register, formState: { errors } } = form;
    return (
        <>
            <div className="floating-label">
                <input
                    type="text"
                    placeholder=" "
                    {...(numeric && { inputMode: "numeric", pattern: "[0-9]*" })}
                    className={errors[name] ? "input-error" : ""}
                    {...register(name, rules)}
                />
                <label>{label}</label>
            </div>
            {errors[name] && <p className="error-message">{errors[name].message}</p>}
        </>
    );
}

/* Question Oui / Non (vaccination, visite chez le vétérinaire) */
export function ChampOuiNon({ form, name, label, children }) {
    const { register } = form;
    const { t } = usePreferences();
    return (
        <div className="radio-block">
            <span className="radio-label">{label}</span>
            <div className="radio-group">
                <label><input type="radio" value="oui" {...register(name)} /> {t("form.oui")}</label>
                <label><input type="radio" value="non" {...register(name)} /> {t("form.non")}</label>
            </div>
            {children}
        </div>
    );
}

// Les valeurs envoyées restent en français (chien, chat...) : seule l'étiquette affichée est traduite
export function ChampEspece({ form }) {
    const { register, formState: { errors } } = form;
    const { t } = usePreferences();
    const majuscule = (texte) => texte.charAt(0).toUpperCase() + texte.slice(1);
    return (
        <>
            <select
                className={errors.Species ? "input-error" : ""}
                {...register("Species", { required: t("form.especeRequise") })}
            >
                <option value="">{t("form.espece")}</option>
                <option value="chien">{majuscule(t("especes.chien"))}</option>
                <option value="chat">{majuscule(t("especes.chat"))}</option>
                <option value="equides">{majuscule(t("especes.equides"))}</option>
            </select>
            {errors.Species && <p className="error-message">{errors.Species.message}</p>}
        </>
    );
}

export function ChampDate({ form, label }) {
    const { control, formState: { errors } } = form;
    const { t } = usePreferences();
    return (
        <div className="datetime-block">
            <Controller
                name="Date_time"
                control={control}
                rules={{ required: t("form.dateRequise") }}
                render={({ field }) => (
                    <DateTimePicker
                        label={label}
                        value={field.value ?? null}
                        onChange={(val) => field.onChange(val)}
                        format={FORMAT_DATE}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                        slotProps={{
                            textField: { className: errors.Date_time ? "input-error" : "" },
                        }}
                    />
                )}
            />
            {errors.Date_time && <p className="error-message">{errors.Date_time.message}</p>}
        </div>
    );
}

/* Lieu : à écrire ou à remplir avec le bouton "Ma position actuelle" */
export function ChampLieu({ annonce, label }) {
    const { register, formState: { errors } } = annonce.form;
    const { t } = usePreferences();
    return (
        <div className="lieu-block">
            <label className="field-label">{label}</label>
            <input
                type="text"
                placeholder={t("form.lieuPlaceholder")}
                className={errors.GPS_coordinates ? "input-error" : ""}
                {...register("GPS_coordinates", { required: t("form.lieuRequis") })}
            />
            {errors.GPS_coordinates && <p className="error-message">{errors.GPS_coordinates.message}</p>}
            <button type="button" className="btn-gps" onClick={annonce.handleGPS}>
                {t("form.maPosition")}
            </button>
        </div>
    );
}

export function ChampsPhotoDescription({ form }) {
    const { register } = form;
    const { t } = usePreferences();
    return (
        <>
            <div className="datetime-block">
                <label className="field-label">{t("form.photo")}</label>
                <input type="file" accept="image/*" className="input-file" {...register("Photo")} />
            </div>
            <textarea
                rows={3}
                placeholder={t("form.descriptionPlaceholder")}
                {...register("Description")}
            />
        </>
    );
}
