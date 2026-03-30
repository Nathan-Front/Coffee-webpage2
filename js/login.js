
window.loginUser = function loginUser(){
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;
    if (loginForm.dataset.bound) return;
    loginForm.dataset.bound = "true";
    const usernameField = document.getElementById("loginName");
    const rememberMe = document.getElementById("remember-me");
    loginForm.addEventListener("submit", async (e) =>{
        //if (!e.target.matches("#loginForm")) return;
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem("userData")) || [];
        const userName = document.getElementById("loginName").value.trim();
        const userPassword = document.getElementById("loginPassword").value;
        if(userName === "" || userPassword === ""){
            alert("Please enter username/password.");
            return;
        }
        const hashedPassword = await hashPassword(userPassword);
        const user = userData.find(user => user.userName === userName && user.password === hashedPassword);
        if(user){  
            localStorage.setItem("loggedInUser", JSON.stringify(user.userName)); 
            if(rememberMe.checked){
                localStorage.setItem("rememberMe", JSON.stringify(user.userName));
            } else {
                localStorage.removeItem("rememberMe");
            }
            alert("Login successful.");
            displayUser();
            window.location.href = "index.html";
        } else {
            alert("Wrong username or password");
            displayUser("Guest");
            return;
        }
    });
 
    const rememberMeStorage = JSON.parse(localStorage.getItem("rememberMe"));
    if(rememberMeStorage){
        usernameField.value = rememberMeStorage;
        rememberMe.checked = true;
    }
    
    document.addEventListener("DOMContentLoaded", () =>{//To keep display even when page is reloaded
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const displayUsername = document.querySelectorAll(".logged-in-user");
        if (loggedInUser) {
            displayUsername.forEach(el => el.textContent = loggedInUser);
        } else {
            displayUsername.forEach(el => el.textContent = "Guest");
        }
    });
}

function alreadyLog(){//Allow only access to login page if not logged in 
    const loginBtn = document.querySelectorAll(".to-login-html-button");
        loginBtn.forEach(btn =>{
            btn.addEventListener("click", () =>{
        const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(loggedUser) {
            alert("Already logged in.")
            return;
        } else {
            window.location.href = "login.html"
        }
        });
    });
} 
document.addEventListener("DOMContentLoaded", alreadyLog);

function displayUser(forceValue){//Display username 
    const user = forceValue ?? JSON.parse(localStorage.getItem("loggedInUser")) ?? "Guest";
    document.querySelectorAll(".logged-in-user").forEach(el => {
        el.textContent = user;
    });
}
document.addEventListener("DOMContentLoaded", () => {displayUser(); loginUser();});

function logoutUser(){//Delete localstorage of logged user
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully.");
}

function logoutHandler(){//Handler for user logout
    const logoutBtn = document.querySelectorAll(".logout-button");
    logoutBtn.forEach(btn => {
        btn.addEventListener("click", () => {logoutUser(); displayUser();}); 
    });
}
document.addEventListener('DOMContentLoaded', () =>{logoutHandler();});

function hoverUserName(){//Display full username for a long username if hovered
 const hoverUser = document.querySelectorAll(".logged-in-user");
 hoverUser.forEach(e => {
e.addEventListener("mouseenter", () =>{
        if(e.scrollWidth > e.clientWidth){
            e.title = e.textContent;
        } else {
            e.removeAttribute("title");
        }
    });
 })
}
document.addEventListener("DOMContentLoaded", hoverUserName);



