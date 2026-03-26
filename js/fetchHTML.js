
async function fetchHtmlContent(){
    const resMobileFoot = await fetch("./mobileNavigation.html");
    const mobileFootHtml = await resMobileFoot.text();

    document.body.insertAdjacentHTML("afterend", mobileFootHtml);
}

async function initFetch(){
    if(window.innerWidth > 599)return;
    
    fetchHtmlContent();
    
}
document.addEventListener("DOMContentLoaded", initFetch);
window.addEventListener("resize", initFetch);