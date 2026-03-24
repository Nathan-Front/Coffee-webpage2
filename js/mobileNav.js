
async function mobileNavFetch(){
  if(window.innerWidth > 540) return; 
  const mobileNav = await fetch("./mobileNavigation.html");
  const navHtml =await mobileNav.text();
  document.body.insertAdjacentHTML("beforeend", navHtml);

  toUser();
  burgerContent();
  mobileNavigationBtn();
  toSignupForm();
}
document.addEventListener("DOMContentLoaded", mobileNavFetch);

let mobileNavBound = false;
function mobileNavigationBtn(){
  if(window.innerWidth > 540) return; 
  if(mobileNavBound) return;
  mobileNavBound = true;
  document.addEventListener("click", (e)=>{
    const homeBtn = e.target.closest("#mobile-home-button");
    if(homeBtn){
      window.location.href = "index.html";
    }

    const coffeeBeanBtn = e.target.closest("#mobile-beans-button");
    if(coffeeBeanBtn){
      window.location.href = "coffeeBeans.html";
    }

    const reserveBtn = e.target.closest("#mobile-reserve-button");
    if(reserveBtn){
      window.location.href = "reservation.html";
    }
  });
}

let userBtn;
function toUser(){
  if(window.innerWidth > 540) return;
  userBtn = document.getElementById("mobile-user-button");
  if(!userBtn) return;
  
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-input-field";
  closeBtn.textContent = "X";
  
  userBtn.addEventListener("click", async () =>{
    //if(formOpen) return; //Prevent multiple clicks
    if(document.querySelector(".input-field-container")) return; //If currently opened, do nothing
    userBtn.disabled = true; //Disable button to prevent multiple clicks
    removeExistingAboutUs();
     const loggedUserContainer = document.createElement("div");
     const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
     const inputFieldContainer = document.createElement("div");
    /*When user is logged in*/
    if(loggedUser){
      loggedUserContainer.className = "logged-user-container";
      loggedUserContainer.innerHTML = `
      <span class="close-input-field-mobile">X</span>
        <h1>Welcome</h1>
        <div class="user-icon-mobile-container">
          <img src="./images/user-icon.png" alt="User Icon" class="user-icon-mobile" id="user-profile-pic"/>
          <input type="file" id="profile-pic-upload" accept="image/*" hidden/>
          <img src="./images/mobileLogo/addCamera/camera-add-photo-svgrepo-com.svg" alt="Upload Image" class="upload-image-button" />
        </div>
        <h2>${loggedUser}</h2>
        <button id="logout-button-mobile">Logout</button>
      `;
      document.body.append(loggedUserContainer);
      requestAnimationFrame(() => {
        loggedUserContainer.offsetHeight; //forces a layout reflow, it locks in the initial state (without .activeInput)
        loggedUserContainer.classList.add("activeInput");
      });
      const uploadButton = loggedUserContainer.querySelector(".upload-image-button");
      const profilePicUpload = loggedUserContainer.querySelector("#profile-pic-upload");
      const userProfilePic = loggedUserContainer.querySelector("#user-profile-pic");
      /*This will make the profile pic remain even when page reloads*/
      const users = JSON.parse(localStorage.getItem("userData")) || [];
      const currentUser = users.find(u => u.userName === loggedUser);
      if (currentUser?.profilePic) { //?. optional chaining to prevent errors if currentUser is undefined
        userProfilePic.src = currentUser.profilePic;
      }

      uploadButton.addEventListener("click", () =>{
        profilePicUpload.click();
      });
      profilePicUpload.addEventListener('change', ()=>{
        const file = profilePicUpload.files[0]; //Get only one picture at a time
        if(!file) return;

        if(!file.type.startsWith('image/')){ //Check if the selected file's MIME type is not an image
          alert('Select only an image file');
          return;
        }
        const reader = new FileReader();
        reader.onload = () =>{
          const imageUrl = reader.result;
          userProfilePic.src = imageUrl;
          const user = JSON.parse(localStorage.getItem("userData")) || [];
          const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
          if(!loggedInUser) return;
          const userIndex = user.findIndex(u => u.userName === loggedInUser);
          if(userIndex === -1) return;
          user[userIndex].profilePic = imageUrl;
          localStorage.setItem("userData", JSON.stringify(user));
        }
        reader.readAsDataURL(file);
      });
      const logoutButtonMobile = document.querySelector("#logout-button-mobile");
      logoutButtonMobile.addEventListener("click", () =>{
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully");
        loggedUserContainer.remove();
        userBtn.disabled = false; //Need this flag to re-enable the button
      });
      const closeUserInfo = loggedUserContainer.querySelector(".close-input-field-mobile");
      closeUserInfo.addEventListener("click", () =>{
        removeExistingUserDisplay();
        userBtn.disabled = false; //Need this flag to re-enable the button
      });
    /*When user is not logged in*/ 
    }else{
      const inputField = await fetch("./login.html"); //Get the login html content
      inputFieldContainer.className = "input-field-container";
      const html = await inputField.text(); //Convert to text to be able to display
      inputFieldContainer.innerHTML = html;
      const closeButtonPos = inputFieldContainer.querySelector("main");
      closeButtonPos.prepend(closeBtn);
      //removeExistingFetched();
      removeExistingAboutUs()
      document.body.append(inputFieldContainer);
      loginUser();
      requestAnimationFrame(() => {
        inputFieldContainer.offsetHeight; //forces a layout reflow, it locks in the initial state (without .activeInput)
        inputFieldContainer.classList.add("activeInput");
      });
    }
  });
  closeBtn.addEventListener("click", () =>{
    //inputFieldContainer.classList.remove("activeInput");
    
    setTimeout(() => { //Delay to allow CSS transition
      removeExistingFetched();
      userBtn.disabled = false; //Need this flag to re-enable the button
    }, 400); //This is needed to match the CSS transition duration which is 0.4s
  });
}
function removeExistingUserDisplay() {
  const existing = document.querySelector(".logged-user-container");
  if (!existing) return;

  existing.classList.remove("activeInput");
  setTimeout(() => {
    existing.remove();
    formOpen = false;
  }, 400);
}

function toSignupForm(){
  let closeBtn = document.createElement("button");
  document.addEventListener("click", async (e) =>{
    const signupTrigger = e.target.closest("#mobile-signup-form");
    if(signupTrigger){
    removeExistingFetched();
    removeExistingAboutUs();
    //removeExistingUserDisplay();
    const toSignupForm = e.target.closest("#mobile-signup-form");
    
    closeBtn.className = "close-signup-form";
    closeBtn.textContent = "X";
    if (!toSignupForm) return;
    const signupForm = await fetch("./signup.html"); //Get the signup html content
    const signupFormContainer = document.createElement("div");
    signupFormContainer.className = "input-field-container";
    const html = await signupForm.text(); //Convert to text to be able to display
    signupFormContainer.innerHTML = html;
    const closeButtonPos = signupFormContainer.querySelector("main");
    closeButtonPos.prepend(closeBtn);
    document.body.append(signupFormContainer);
    signUp();
    requestAnimationFrame(() => {
        signupFormContainer.offsetHeight; //forces a layout reflow, it locks in the initial state (without .activeInput)
        signupFormContainer.classList.add("activeInput");
      });
      return;
    }
   
    closeBtn.addEventListener("click", () =>{
      setTimeout(() => { //Delay to allow CSS transition
      removeExistingFetched();
      userBtn.disabled = false; //Need this flag to re-enable the button
    }, 400); 
    });
  });
}
function removeExistingFetched() {
   const existing = document.querySelector(".input-field-container");
  if (!existing) return;

  existing.classList.remove("activeInput");
  setTimeout(() => {
    existing.remove();
    formOpen = false;
  }, 400);
}

let burgerOpen;
let burgerClose;
function burgerContent(){
  burgerOpen = document.getElementById("burger");
  burgerClose = document.getElementById("burger-close");
  if (!burgerOpen || !burgerClose) return;
  burgerOpen.addEventListener("click", async () =>{
    removeExistingFetched();
    removeExistingAboutUs()
    removeExistingUserDisplay();
    const aboutUsContainer = document.createElement("div");
    aboutUsContainer.className = "about-us-mobile-container";
    const aboutUsSection = await fetch("./aboutus.html");
    const aboutUsHtml = await aboutUsSection.text();
    aboutUsContainer.innerHTML = aboutUsHtml;
    document.body.append(aboutUsContainer);
    const barista = await fetch("./service.html");
    const HTNLtext = await barista.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(HTNLtext, "text/html");
    const baristaSection = doc.querySelector(".service-second-section-container");
    aboutUsContainer.append(baristaSection);
   
    const mobileFooterContainer = await fetch("./mobileFooter.html");
    const mobileFooterHtml = await mobileFooterContainer.text();
    const footerContainer = document.createElement("div");
    footerContainer.innerHTML = mobileFooterHtml;
    aboutUsContainer.append(...footerContainer.children)
    requestAnimationFrame(() => {
      aboutUsContainer.offsetHeight; //forces a layout reflow, it locks in the initial state (without .activeInput)
      aboutUsContainer.classList.add("activeInput");
    });
    if (userBtn) userBtn.disabled = false;
    burgerOpen.style.display = "none";
    burgerClose.style.display = "flex";
  });
  burgerClose.addEventListener("click", () =>{
    removeExistingAboutUs();
    burgerOpen.style.display = "flex";
    burgerClose.style.display = "none";
  });
}
function removeExistingAboutUs() {
  const existing = document.querySelector(".about-us-mobile-container");
    if (!existing) return;
    existing.classList.remove("activeInput");
    setTimeout(() => { //Delay to allow CSS transition
        existing.remove();
      }, 400);
  burgerOpen.style.display = "flex";
  burgerClose.style.display = "none";
  
}