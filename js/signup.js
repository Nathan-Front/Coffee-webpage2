
window.signUp = function signUp() {
    const form = document.getElementById('signup-form');
  if (!form) return; 
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formInput ={};
        const inputData = document.querySelectorAll('.signup-input');
        const userData = JSON.parse(localStorage.getItem("userData")) || [];
        inputData.forEach(input => {
            formInput[input.name] = input.value;
        });
        
        const emailAddress = document.getElementById("eAddress");
        const createPass = document.getElementById("pWord");
        //this is for warning error if not correct e-mail format
        document.querySelectorAll("small.error").forEach(el => el.textContent = ""); 
        document.querySelectorAll("input").forEach(el => el.classList.remove("error-border"));
        //Check if input is an e-mail
        if (!validateEmail(emailAddress.value)) {
            showError(emailAddress, "Enter a valid email");
            return;
        }

        //Duplicate check functions
        //Email duplicate check
        const email = emailAddress.value.trim().toLowerCase();
        const emailExists = userData.some(user => user.emailAddress?.toLowerCase() === email);
        if (emailExists) {
            alert("An account with this email already exists.");
            showTaken(emailAddress, "");
            emailAddress.value="";
            return;
        }
        //Username duplicate check
        const userNameInput = document.getElementById('uName');
        const userName = userNameInput.value.trim();
        const usernameExists = userData.some(user => user.userName === userName);
        if (usernameExists) {
            alert("Username already taken");
            showTaken(userNameInput, "");
            userNameInput.value = '';
            return;
        }
        //Password duplicate check
        const hashedPass = await hashPassword(createPass.value);
        const passwordExists = userData.some(user => user.password === hashedPass);
        if (passwordExists) {
            alert('Password already taken');
            showTaken(createPass, "");
            createPass.value = '';
            return;
        }
        formInput.password = hashedPass; //Store hashed password instead of plain text
        userData.push(formInput);
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Account created successfully!");
        if(window.innerWidth <= 540){
            openLoginForm();
        }else{
            window.location.href = "login.html";
        }
    });
} 
//For mobileviewport login form opening after signup
async function openLoginForm() {
    removeExistingFetched();
    removeExistingAboutUs();
    const inputFieldContainer = document.createElement("div");
    inputFieldContainer.className = "input-field-container";
    const logiForm = await fetch("login.html");
    inputFieldContainer.innerHTML = await logiForm.text();
    document.body.append(inputFieldContainer);
    loginUser();
    requestAnimationFrame(() => {
      inputFieldContainer.classList.add("activeInput");
    });
}
//email validator
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email)
}

//error message when incorrect e-mail format was input
function showError(input, message) {
    const small = input.parentElement.querySelector("small");
    small.textContent = message;
    input.classList.add("error-border");
}
//error display when e-mail already taken
function showTaken(input, message) {
    const small = input.parentElement.querySelector("small");
    input.classList.add("error-border");
}

function toggleEye(){
    document.addEventListener("DOMContentLoaded", () =>{
        document.addEventListener("click", (e) =>{
            const eye = e.target.closest(".toggle-password");
            if(!eye) return;

            const passwordField = document.getElementById(eye.dataset.target);
            if(!passwordField) return;

            const isPassword = passwordField.type === "password";
            passwordField.type = isPassword? "text":"password";

            eye.classList.toggle("fa-eye");
            eye.classList.toggle("fa-eye-slash");
        });
    });
}
toggleEye();