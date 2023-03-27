// Menu d'édition des styles ----------------------------------
function style_menu_func() {
    if (document.getElementById("bouton_style").checked) {
        const style_menu = document.createElement("div");
        style_menu.id = "style_menu";
        style_menu.style = "position: absolute;top: 200px;left: 200px;background-color: rgb(248, 248, 255, 1);z-index: 2;";

        const label_champ = document.createElement("label");
        label_champ.innerText = "Champ";
        style_menu.appendChild(label_champ);

        const input_champ = document.createElement("input");
        input_champ.type = "text";
        label_champ.appendChild(input_champ);

        const label_couleur = document.createElement("label");
        label_couleur.innerText = "Couleur";
        style_menu.appendChild(label_couleur);

        const input_couleur = document.createElement("input");
        input_couleur.type = "text";
        label_couleur.appendChild(input_couleur);

        const le_bon_bouton = document.createElement("button");
        le_bon_bouton.innerText = "Ok";
        style_menu.appendChild(le_bon_bouton);
        le_bon_bouton.addEventListener("click", () => {
            //TODO
        });

        document.body.appendChild(style_menu);
    } else {
        const style_menu = document.getElementById("style_menu");
        document.body.removeChild(style_menu);
    }
}

// ----------------------------------------------------------


export function setUpMenu() {
    //const menu = document.getElementById("menu");
    //const bouton_afficher_menu = document.getElementById("bouton_afficher_menu");
    const bouton_style = document.getElementById("bouton_style");

    /*
    //Fonction pour afficher/cacher le menu
    bouton_afficher_menu.addEventListener("click", () => {
        if (!bouton_afficher_menu.checked) {
            //Ici on cache le menu
            menu.innerHTML = "<h2>Menu</h2><input type='checkbox' name='bouton_afficher_menu' id='bouton_afficher_menu'><label for='bouton_afficher_menu'>Afficher le menu</label>";
            setUpMenu();
        } else {
            //Ici on affiche le menu
            menu.innerHTML = "<h2>Menu</h2><p>test</p><input type='checkbox' name='bouton_afficher_menu' id='bouton_afficher_menu' checked><label for='bouton_afficher_menu'>Afficher le menu</label>";
            setUpMenu();
        }
    });
    */

    bouton_style.addEventListener("click", style_menu_func);
}