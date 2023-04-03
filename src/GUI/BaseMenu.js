// Menu d'édition des styles ----------------------------------
function style_menu_func() {
    const style_menu = document.getElementById("style_menu");
    if (document.getElementById("bouton_style").checked) {
        style_menu.style.zIndex = 2;
    } else {
        style_menu.style.zIndex = -1;
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