const menuIcon = document.getElementById("icon")
const close = document.getElementById("close")
const menu = document.querySelector(".sidebar")
menuIcon.addEventListener('click', function(){
    menu.style.right = 0;
    menuIcon.style.display = "none"
})
close.addEventListener('click', function(){
    menu.style.right = "-110%";
    menuIcon.style.display = "inline"

})
let addIngridents = document.getElementById("addIngridents")
let ingredientList = document.querySelector(".ingredientList")
let ingredeintDiv = document.querySelectorAll(".ingredeintDiv")[0];

addIngridents.addEventListener('click', function(){
    let newIngredient = ingredeintDiv.cloneNode(true)
    let input = newIngredient.getElementsByTagName('input')[0]
    input.value = '';
    ingredientList.appendChild(newIngredient)

})