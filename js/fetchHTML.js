
async function fetchFoot(){
  const body = document.body;
  const main = body.querySelector("main")
  const resFoot = await fetch("footer.html");
  const footHTML = await resFoot.text();
  main.insertAdjacentHTML("afterend", footHTML)
}
document.addEventListener("DOMContentLoaded", fetchFoot);

let mobileLoaded = false;
async function fetchHtmlContent(){
    const resMobileFoot = await fetch("./mobileNavigation.html");
    const mobileFootHtml = await resMobileFoot.text();
    document.body.insertAdjacentHTML("beforeend", mobileFootHtml);
}

async function initFetch(){
    if(window.innerWidth > 599) return;
    if(mobileLoaded) return;
    mobileLoaded = true;
    fetchHtmlContent();
}
document.addEventListener("DOMContentLoaded", initFetch);
window.addEventListener("resize", initFetch);