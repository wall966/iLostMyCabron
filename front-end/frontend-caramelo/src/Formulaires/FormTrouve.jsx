import { useAnnonceForm } from "./useAnnonceForm";
import { usePreferences } from "../preferences";
import {
    CadreFormulaire, ChampTexte, ChampOuiNon,
    ChampEspece, ChampDate, ChampLieu, ChampsPhotoDescription,
} from "./annonceForm";

// Formulaire "J'ai trouvé un animal" (création et modification : /formtrouve et /formtrouve/:id)
const FormTrouve = () => {
    const annonce = useAnnonceForm("trouvé");
    const { form } = annonce;
    const { t } = usePreferences();
    const vet = form.watch("Vet");

    return (
        <CadreFormulaire titre={t("form.trouve.titre")} texteBouton={t("form.trouve.bouton")} annonce={annonce}>
            <ChampOuiNon form={form} name="Vet" label={t("form.trouve.vet")}>
                {vet === "non" && (
                    <p className="info-message">{t("form.trouve.conseilVet")}</p>
                )}
            </ChampOuiNon>
            <ChampTexte form={form} name="Chip_number" label={t("form.trouve.puce")} />
            <ChampTexte form={form} name="Name" label={t("form.trouve.nom")} />
            <ChampTexte
                form={form}
                name="Age"
                label={t("form.trouve.age")}
                numeric
                rules={{ pattern: { value: /^[0-9]*$/, message: t("form.nombreInvalide") } }}
            />
            <ChampEspece form={form} />
            <ChampTexte form={form} name="Breed" label={t("form.trouve.race")} />
            <ChampDate form={form} label={t("form.trouve.date")} />
            <ChampLieu annonce={annonce} label={t("form.trouve.lieu")} />
            <ChampsPhotoDescription form={form} />
        </CadreFormulaire>
    );
};

export default FormTrouve;
