#!/bin/bash

echo "Correction des imports DSFR en cours..."

find src -name "*.tsx" -o -name "*.ts" | while read file; do
    echo "Traitement de $file"
    
    # Remplacer les imports Container
    sed -i 's/import { Container } from "@codegouvfr\/react-dsfr\/Container";/import { fr } from "@codegouvfr\/react-dsfr";/g' "$file"
    
    # Remplacer les imports Modal
    sed -i 's/import { Modal } from "@codegouvfr\/react-dsfr\/Modal";/import { createModal } from "@codegouvfr\/react-dsfr\/Modal";/g' "$file"
    
    # Remplacer les utilisations de Container
    sed -i 's/<Container>/<div className={fr.cx("fr-container")}>/g' "$file"
    sed -i 's/<\/Container>/<\/div>/g' "$file"
    
    # Marquer les problèmes Card pour révision manuelle
    sed -i 's/labelLeft="/\/\* FIXME: labelLeft -> \*\/ textLeft="/g' "$file"
    sed -i 's/labelRight="/\/\* FIXME: labelRight -> \*\/ textRight="/g' "$file"
    
done

echo "Remplacements terminés."

# Chercher les imports restants à corriger
echo -e "\nImports restants à vérifier :"
grep -rn "@codegouvfr.*Container\|@codegouvfr.*Modal" src/ 2>/dev/null || echo "Aucun import Container/Modal trouvé"

echo -e "\nFichiers avec Card ayant des children à corriger :"
grep -rn "children.*Card\|Card.*children" src/ 2>/dev/null || echo "Vérifiez manuellement les composants Card"
