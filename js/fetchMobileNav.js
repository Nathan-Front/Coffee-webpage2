
let mobileLoaded = false;
async function fetchMobileNav(){
    const resMobileFoot = await fetch("./mobileNavigation.html");
    const mobileFootHtml = await resMobileFoot.text();
    document.body.insertAdjacentHTML("beforeend", mobileFootHtml);
}

async function initFetch(){
    if(window.innerWidth > 599) return;
    if(mobileLoaded) return;
    mobileLoaded = true;
    fetchMobileNav();
}
document.addEventListener("DOMContentLoaded", initFetch);
window.addEventListener("resize", initFetch);