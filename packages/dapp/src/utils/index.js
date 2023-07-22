import JSConfetti from 'js-confetti';

export const confetti = (_i) => {
    const arr = [
        () => new JSConfetti().addConfetti(),
        () => new JSConfetti().addConfetti({
            emojis: ['🌈', '🚀', '💥', '✨', '💫', '🦄'],
        }),
        () => new JSConfetti().addConfetti({
            emojis: ['🇦', '🇱', '🇾', '🇷', '🦄'],
        })
    ]
    if (_i === -1) _i = Math.floor(Math.random() * (arr.length))

    return arr[_i]()
}

export const ADMIN_DEFAULT_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"
export const MEMBER_ROLE = "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636"
export const CREATOR_ROLE = "0x828634d95e775031b9ff576b159a8509d3053581a8c9c4d7d86899e0afcd882f"
export const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775"

export const createArrayByLength = (length) => {
    // Vérifier si le paramètre est un nombre positif
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('La longueur doit être un nombre positif.');
    }

    // Créer un tableau vide pour stocker les ID
    const arr = [];

    // Remplir le tableau avec des ID uniques basés sur la longueur
    for (let i = 0; i < length; i++) {
        // Ajouter l'ID généré au tableau
        arr.push({
            id: i,
            uuid: `uuid_${i}`
        });
    }

    return arr
}