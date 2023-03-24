export function setUpMenu() {
    const menu = document.getElementById("menu");
    const bouton_afficher_menu = document.getElementById("bouton_afficher_menu");

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
}