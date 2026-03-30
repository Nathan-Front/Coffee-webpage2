
async function mobileFooterFetch() {
    if(window.innerWidth > 599) return;
   
    mobileFooter();
}
document.addEventListener("DOMContentLoaded", mobileFooterFetch);

async function mobileFooter(e){
    const mobileAboutUsContainer = e.querySelector(".about-us-body-container");
    if(!mobileAboutUsContainer) return;
    const footerContainer = document.createElement("div");
    footerContainer.className = "mobile-footer-container";
     const mobileFooter = await fetch("mobileFooter.html");
    const footerHtml = await mobileFooter.text();
    mobileAboutUsContainer.innerHTML = footerHtml;
    mobileAboutUsContainer.append(footerContainer);
        
}
