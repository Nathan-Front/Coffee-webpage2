async function fetchFoot(){
  if(document.getElementById("footer")) return;
  const body = document.body;
  const main = body.querySelector("main")
  const resFoot = await fetch("footer.html");
  const footHTML = await resFoot.text();
  main.insertAdjacentHTML("afterend", footHTML)
}
document.addEventListener("DOMContentLoaded", fetchFoot);