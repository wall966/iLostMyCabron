import { createClient } from '@supabase/supabase-js'

/*partie responsable pour gerer tout lentre et sortie des url des photos*/
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY


export const supabase = createClient(supabaseUrl, supabaseKey)

/* Envoie la photo choisie sur supabase et renvoie son lien public.
   Si aucun nouveau fichier n'a été choisi (ex : modification d'une annonce), on garde l'ancienne photo */
export async function uploadPhoto(photo, currentPhoto) {
    if (!(photo instanceof FileList) || photo.length === 0) {
        return currentPhoto;
    }
    const file = photo[0];

    // Enlève les accents, espaces et caractères spéciaux du nom du fichier
    const sanitizedName = file.name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
    return data.publicUrl;
}
