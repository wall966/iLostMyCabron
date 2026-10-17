import { useAnnonceForm } from "./useAnnonceForm";
import { usePreferences } from "../preferences";
import {
    CadreFormulaire, ChampTexte, ChampOuiNon,
    ChampEspece, ChampDate, ChampLieu, ChampsPhotoDescription,
} from "./annonceForm";

// Formulaire "J'ai perdu mon animal" (création et modification : /formperdu et /formperdu/:id)
const FormPerdu = () => {
    const annonce = useAnnonceForm("perdu");
    const { form } = annonce;
    const { t } = usePreferences();

    return (
        <CadreFormulaire titre={t("form.perdu.titre")} texteBouton={t("form.perdu.bouton")} annonce={annonce}>
            <ChampTexte form={form} name="Name" label={t("form.perdu.nom")} rules={{ required: t("form.perdu.nomRequis") }} />
            <ChampTexte
                form={form}
                name="Age"
                label={t("form.perdu.age")}
                numeric
                rules={{ pattern: { value: /^[0-9]*$/, message: t("form.nombreInvalide") } }}
            />
            <ChampTexte form={form} name="Chip_number" label={t("form.perdu.puce")} />
            <ChampOuiNon form={form} name="Vaccination" label={t("form.perdu.vaccination")} />
            <ChampEspece form={form} />
            <ChampTexte form={form} name="Breed" label={t("form.perdu.race")} />
            <ChampDate form={form} label={t("form.perdu.date")} />
            <ChampLieu annonce={annonce} label={t("form.perdu.lieu")} />
            <ChampsPhotoDescription form={form} />
        </CadreFormulaire>
    );
};

export default FormPerdu;
