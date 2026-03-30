
function serviceToHome(){
  if(window.innerWidth <= 599){
    if(window.location.pathname.includes("service.html") 
        || window.location.pathname.includes("aboutus.html")
        || window.location.pathname.includes("login.html")
        || window.location.pathname.includes("signup.html")) {
      window.location.href = "index.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", serviceToHome);
window.addEventListener("resize", serviceToHome);