
let seatReserved = 0;
let seatLoc;
function selectSeatToReserve(){
    const radios = document.querySelectorAll(
        ".single-window-table input[type='radio'], \
         .double-seat-window-table input[type='radio'], \
         .group-center-table input[type='radio']"
    );
    let lastChecked = null;
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            const li = radio.closest("li");
            const imgEl = radio.closest("label").querySelector("img");
            const seat = radio.value;          
            const seatRes = JSON.parse(localStorage.getItem("reserveSeat")) || [];
            if (lastChecked && lastChecked !== radio) {
                const prevImg = lastChecked.closest("li").querySelector("img");
                prevImg.src = getDefaultImg(prevImg);
            }
            imgEl.src = getSelectedImg(imgEl);
            lastChecked = radio;
            seatLoc = seat;
            console.log("Selected seat:", seatLoc);
        });
    });
}

function reserveSeat(){
    const reserveBtn = document.getElementById("reserve-button");
    
    reserveBtn.addEventListener("click", async () =>{
      const loginUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(!seatLoc){
            alert("Select seat");
            return;
        }
        if (!document.querySelector(".form-panel-container")) {
          const response = await fetch("reservationForm.html");
          const reservationFormHTML = await response.text();
          document.body.insertAdjacentHTML("beforeend", reservationFormHTML);
          initReservationForm();
          timeInputStepHandler();
        }

        const userReservationEl = document.querySelector(".user-name-logged");
        const loggedUserEl = document.querySelector(".logged-in-user");
        if (loggedUserEl) loggedUserEl.textContent = loginUser || "Guest";
        if (userReservationEl) userReservationEl.textContent = loginUser || "Guest";

        const seatRes = JSON.parse(localStorage.getItem("reserveSeat")) || [];
       
        if (loggedUserEl) loggedUserEl.textContent = loginUser || "Guest";
        const loggedUser = loggedUserEl.textContent;
        if(seatRes.some(user => user.user === loggedUser)){
            alert("This user had already a reservation");
            return;
        }
        document.querySelector(".form-panel-container").style.display = "flex";
        loggedUserEl.textContent = loginUser;
        userReservationEl.textContent = loginUser;
        if(!loginUser){
         userReservationEl.textContent = "Guest";
        }
        document.body.classList.add("no-scroll");
    });
}

function getDefaultImg(img) {
  if (img.src.includes("single")) return "./images/services/reservation/singleseat1.png"; 
  if (img.src.includes("double")) return "./images/services/reservation/doubleseat1.png"; 
  if (img.src.includes("four")) return "./images/services/reservation/fourseat1.png"; 
  if (img.src.includes("six")) return "./images/services/reservation/sixseat1.png";
}

function getSelectedImg(img) {
    const type = img.dataset.seatType;
    switch (type) {
    case "single":
      return "./images/services/reservation/singleseat2.png";
    case "double":
      return "./images/services/reservation/doubleseat2.png";
    case "four":
      return "./images/services/reservation/fourseat2.png";
    case "six":
      return "./images/services/reservation/sixseat2.png";
    default:
      return img.src;
  }
}
 
function getMarkedSeat(){
    const resSeat = JSON.parse(localStorage.getItem("reserveSeat")) || [];
    if(!resSeat.length) return;

    const selectedDate = nextSaturday();
    const selectedTime = "15:00";

    const usedSeats = getUsedSeats(selectedDate, selectedTime);
    const radios = document.querySelectorAll(
      ".group-center-table input[type='radio']"
    );
    const singleDoubleRadios = document.querySelectorAll(
      ".single-window-table input[type='radio'], \
       .double-seat-window-table input[type='radio']"
    );
    singleDoubleRadios.forEach(radio => {
      const li = radio.closest("li");
      const imgEl = radio.closest("label").querySelector("img");
      const seatId = radio.value;
      const used = usedSeats[seatId] || 0;
      if (used > 0) {
        imgEl.src = getSelectedImg(imgEl);
        radio.disabled = true;
        li.classList.add("seat-full");
      }
    });
    radios.forEach(radio =>{
        const li = radio.closest("li");
        const imgEl = radio.closest("label").querySelector("img");
        const spanEl = li.querySelector("span");
        const seatId = radio.value;

        const used = usedSeats[seatId] || 0;
        const capacity = getSeatCapacity(radio);
        const available = Math.max(0, capacity - used);

        if (available === 0) {
          imgEl.src = getSelectedImg(imgEl);
          radio.disabled = true;
          li.classList.add("seat-full");
        }

        if (used > 0 && capacity > 2) {
            spanEl.textContent = available > 0
            ? `${available} seat${available !== 1 ? "s" : ""} left`
            : "Full";
        }

        if (available === 0 && used > 0) {
            radio.disabled = true;
            li.classList.add("seat-full");
        }
    });
}

/*
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.querySelector("#inputReserveDate");
  const timeInput = document.querySelector("#inputReserveTime");
  if(!dateInput || !timeInput) return;
  dateInput.value = nextSaturday();
  timeInput.value = "15:00";
  getMarkedSeat();
  dateInput.addEventListener("change", getMarkedSeat);
  timeInput.addEventListener("change", getMarkedSeat);
  
  selectSeatToReserve(); 
});*/

function initReservationForm() {
  const dateInput = document.querySelector("#inputReserveDate");
  const timeInput = document.querySelector("#inputReserveTime");

  if (!dateInput || !timeInput) return;
  timeInput.step = 900;
  dateInput.value = nextSaturday();
  timeInput.value = "15:00";

  dateInput.addEventListener("change", getMarkedSeat);
  timeInput.addEventListener("change", getMarkedSeat);

  dateInput.addEventListener("change", () => {
    if (!isSaturday(dateInput.value)) {
      alert("Reservations are only available on Saturdays.");
      dateInput.value = "";
    }
  });

  timeInput.addEventListener("change", () => {
    if (!isTimeAllowed(timeInput.value)) {
      alert("Reservations are only available between 13:00 and 19:00.");
      timeInput.value = "";
    }
  });
  reserveButton();
  closeReservePanel();
  console.log("Time step:", timeInput.step);
}

const SEAT_TYPE_CAPACITY = {
  four: 4,
  six: 6,
  single: 1,
  double: 2
};
function getSeatCapacity(radio) {
  const img = radio.closest("label").querySelector("img");
  const seatType = img?.dataset.seatType;
  return SEAT_TYPE_CAPACITY[seatType] || 1;
}
function getUsedSeats(date, time) {
  const data = JSON.parse(localStorage.getItem("reserveSeat")) || [];
  const seatMap = {};

  data.forEach(item => {
     if (item.dateReserve !== date) return;
    if (item.timeReserve !== time) return;
    const seat = item.seat;
    const cnt = Number(item.personCnt) || 0;
    seatMap[seat] = (seatMap[seat] || 0) + cnt;
  });

  return seatMap;
}

function isSaturday(dateStr) {
  const date = new Date(dateStr);
  return date.getDay() === 6;
}

function dateInputChangeHandler() {
const dateInput = document.querySelector("#inputReserveDate");
dateInput.addEventListener("change", () => {
  if (!isSaturday(dateInput.value)) {
    alert("Reservations are only available on Saturdays.");
    dateInput.value = "";
  }
});
}

function saveReservation(reservation) {
  if (!isSaturday(reservation.dateReserve)) {
    alert("Only Saturdays are allowed.");
    return;
  }

  if (!isTimeAllowed(reservation.timeReserve)) {
    alert("Only 15:00–19:00 reservations are allowed.");
    return;
  }

  const data = JSON.parse(localStorage.getItem("reserveSeat")) || [];
  data.push(reservation);
  localStorage.setItem("reserveSeat", JSON.stringify(data));
}
function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  return d.toISOString().split("T")[0];
}

const ALLOWED_TIME = {
  start: "15:00",
  end: "19:00"
};

function isTimeAllowed(timeStr) {
  if (!timeStr) return false;
  const toMinutes = t => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const t = toMinutes(timeStr);
  return (
    t >= toMinutes(ALLOWED_TIME.start) &&
    t <= toMinutes(ALLOWED_TIME.end)
  );
}
//const timeInput = document.querySelector("#inputReserveTime");
function timeInputChangeHandler() {
  const timeInput = document.querySelector("#inputReserveTime");
  if(!timeInput) return;
  timeInput.addEventListener("change", () => {
  if (!isTimeAllowed(timeInput.value)) {
    alert("Reservations are only available between 15:00 and 19:00.");
    timeInput.value = "";
  }
});
}
function timeInputStepHandler() {
  const timeInput = document.getElementById("inputReserveTime");
  if (!timeInput) return;

  timeInput.addEventListener("change", () => {
    const [hour, minute] = timeInput.value.split(":").map(Number);

    if (minute % 15 !== 0) {
      alert("Please select time in 15 minute increments (00, 15, 30, 45).");
      timeInput.value = "";
    }
  });
}

function reserveButton(){
  const reserveBtn = document.querySelector(".submit-reserve-button");
  const person = document.getElementById("selectNumber");
  const dateReservation = document.getElementById("inputReserveDate");
  const timeReservation = document.getElementById("inputReserveTime");
  const userContact = document.getElementById("inputContact");
  const userEmail = document.getElementById("inputEmail");
  if(!reserveBtn) return;
  reserveBtn.addEventListener("click", () => {
    const loginUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loginUser) {
      alert("Must be logged in to reserve seat");
      return;
    }

    if (!seatLoc) {
      alert("Select a seat first");
      return;
    }

    const radio = document.querySelector(
      `input[type="radio"][value="${seatLoc}"]`
    );

    if (!radio) {
      alert("Seat not found");
      return;
    }

    //const usedSeats = getUsedSeats();
    const usedSeats = getUsedSeats(
      dateReservation.value,
      timeReservation.value
    );
    const capacity = getSeatCapacity(radio);
    const used = usedSeats[seatLoc] || 0;
    const personCount = Number(person.value);
    const available = capacity - used;

    if (personCount > available) {
      alert("Not enough available seats");
      return;
    }

    const reservation = {
      user: loginUser,
      seat: seatLoc,
      personCnt: personCount,
      dateReserve: dateReservation.value,
      timeReserve: timeReservation.value,
      userContact: userContact.value,
      userEmail: userEmail.value
    };

    const existing = JSON.parse(localStorage.getItem("reserveSeat")) || [];
    existing.push(reservation);
    localStorage.setItem("reserveSeat", JSON.stringify(existing));

    alert("Reservation saved successfully!");
    document.querySelector(".form-panel-container").style.display = "none";
    document.body.classList.remove("no-scroll");
  });
}

function closeReservePanel(){
    const closePanelBtn = document.querySelector(".close-reserve-button");
    if(!closePanelBtn) return;
    closePanelBtn.addEventListener("click", () =>{
        document.querySelector(".form-panel-container").style.display = "none";
        document.body.classList.remove("no-scroll");
    });
}closeReservePanel();

document.addEventListener("DOMContentLoaded", () => {
  reserveButton();
  selectSeatToReserve();
  reserveSeat();
  getMarkedSeat();
});

