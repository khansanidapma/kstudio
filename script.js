const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {

if(window.scrollY > 30){

navbar.style.background="rgba(7,17,31,.75)";
navbar.style.backdropFilter="blur(15px)";
navbar.style.padding="18px 5%";
navbar.style.borderRadius="20px";

}else{

navbar.style.background="transparent";
navbar.style.backdropFilter="blur(0)";
navbar.style.padding="25px 0";

}

});

const icons = document.querySelectorAll(".control i");

icons.forEach(icon=>{

icon.addEventListener("click",()=>{

icon.style.transform="scale(1.4)";

setTimeout(()=>{

icon.style.transform="scale(1)";

},150)

})

})
