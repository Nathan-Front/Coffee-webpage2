
function coffeeSelector(){
    const clickedCoffee = document.querySelectorAll(".coffee-selections");
    clickedCoffee.forEach((e) => {
        e.addEventListener("click", () => {
            document.querySelector(".currentSelected").classList.remove("currentSelected");
            e.classList.add("currentSelected");
            
        });
    });

    document.querySelectorAll("button[data-target]").forEach(ev => {
    ev.addEventListener("click", () => {
    document.querySelectorAll(".coffee-selection-text").forEach(section => {
      section.classList.remove("selectedCoffee");
    });

    const target = document.getElementById(ev.dataset.target);
    target.classList.add("selectedCoffee");
    adjustImagesByTextHeight(); 
  });
});
}

//For the images height adjustment in second section

function adjustImagesByTextHeight() {
    const block = document.querySelector(".coffee-selection-text.selectedCoffee");
  if (!block) return;

  const p = block.querySelector("p");
  if (!p) return;

  const textHeight = p.scrollHeight;

  block.classList.remove("small-text", "medium-text", "large-text");

  if (textHeight > 120) {
    block.classList.add("large-text");
  } else if (textHeight > 60) {
    block.classList.add("medium-text");
  } else {
    block.classList.add("small-text");
  }
  
}
window.addEventListener("resize", adjustImagesByTextHeight);
document.addEventListener("DOMContentLoaded", ()=>{
  coffeeSelector();
  adjustImagesByTextHeight();
})

//①Declare these globally or else it will keep initializing inside function
let secondTouchStart;
let secondTouchMove;
let secondTouchEnd;
//Second section mobile 
function indexPageSecondSection(){
  const carouselContainer = document.querySelector(".second-section-container");
  const carouselItem = document.querySelectorAll(".coffee-selection-text");
  let index = 0;
  let startX = 0;
  let isDragging = false;

  const dots = document.querySelector(".mobile-slider-dots");
  dots.innerHTML = "";
  carouselItem.forEach((_, i) =>{
    const span = document.createElement("span");
    span.className = "mobile-dot" + (i === 0 ? " activeCoffee": "");
    span.addEventListener("click", ()=>goToSlide(i));
    dots.appendChild(span);
  });
  
  const spanDots = dots.querySelectorAll(".mobile-dot");
  function updateSlider(){
    carouselItem.forEach((s, _) =>{
      s.style.transform =  `translateX(${-index * 100}%)`; 
    });
    spanDots.forEach((d, i) =>{
      d.classList.toggle('activeCoffee', i === index);
    });
  }
  function goToSlide(i){
    index = i;
    updateSlider();
  }
  //②Use them like these *Do not put the passive here
  secondTouchStart = e =>{
    startX = e.touches[0].clientX;
    isDragging = true;
  };
  secondTouchMove = e => {
    if (!isDragging) return;
  };
  secondTouchEnd = e =>{
    if(!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if(diff > 50){
      index = index === 0 ? carouselItem.length - 1 : index - 1;
    }else if (diff < -50) {
        index = (index + 1) % carouselItem.length;
    }
    updateSlider();
    isDragging = false;
  };
  //③manually call the function like this *Add passive here instead
  carouselContainer.addEventListener("touchstart", secondTouchStart, {passive: true});
  carouselContainer.addEventListener("touchmove", secondTouchMove, {passive: true});
  carouselContainer.addEventListener("touchend", secondTouchEnd, {passive: true});
}

//Testimony slider
const carouselWrapper = document.querySelector('.customer-testimony-container');
const slides = document.querySelectorAll('.customer-testimony');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let maxIndex;
let visibleSlides; //Initial slider display 
function initialTestimonySlide(){
  //visibleSlides = window.innerWidth > 599 ? 3 : 1;
  if(window.innerWidth <= 599){
    visibleSlides = 1;
  } else if(window.innerWidth <= 768){
    visibleSlides = 2;
  }else{
    visibleSlides = 3;
  }
  maxIndex = slides.length - visibleSlides;
}
initialTestimonySlide();
document.addEventListener("DOMContentLoaded", initialTestimonySlide);

let currentIndex = 0;
let slideWidth;
let mobileFunction;
function updateSlideWidth() {
 // slideWidth = slides[0].offsetWidth + 20; //Includes space between each sliders
  const { fullWidth } = getSlideMetrics();
  slideWidth = fullWidth;
}

function updateCarousel() {
 carouselWrapper.style.transform =
    `translateX(${-currentIndex * slideWidth}px)`;
  updateActiveDot();
 /* const testimonyContainer = document.querySelector(".customer-testimony-container");

  if (window.innerWidth <= 599) {
    // Mobile uses fullWidth
    const { fullWidth } = getSlideMetrics();
    testimonyContainer.style.transform =
      `translateX(${-currentIndex * fullWidth}px)`;
  } else {
    // Desktop / Tablet uses slideWidth
    testimonyContainer.style.transform =
      `translateX(${-currentIndex * slideWidth}px)`;
  }

  updateActiveDot();*/
}


nextBtn.addEventListener('click', () => {
  if (currentIndex >= maxIndex) {
    currentIndex = 0; //Go back to start
  } else {
    currentIndex++;
  }
  updateCarousel();
});
prevBtn.addEventListener('click', () => {
  if (currentIndex <= 0) {
    currentIndex = maxIndex; //Go to end
  } else {
    currentIndex--;
  }
  updateCarousel();
});

const dotsContainer = document.querySelector(".slider-dots");
function createDots(){  
  dotsContainer.innerHTML = "";
  let visibleSlides;
  if (window.innerWidth <= 599) {
    visibleSlides = 1;
  } else if (window.innerWidth <= 768) {
    visibleSlides = 2;
  } else {
    visibleSlides = 3;
  }
   const slides = document.querySelectorAll(".customer-testimony");
  const totalDots = slides.length - visibleSlides + 1;
  for ( let i = 0; i < totalDots; i++ ) {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
      if(window.innerWidth <= 599) return;
        currentIndex = i;
        updateCarousel();
      //updateActiveDot();
    });
    dotsContainer.appendChild(dot);
  }
 updateActiveDot();
}


function updateActiveDot(){
  const desktopDots = document.querySelectorAll(".slider-dots button");
  desktopDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}
window.addEventListener('load', () => {
  updateSlideWidth();
  updateCarousel();
  createDots();
});

function getSlideMetrics(){
  const testimonyContainer = document.querySelector(".customer-testimony-container");
  const testimonySlide = document.querySelectorAll(".customer-testimony");
  const slideWidth = Array.from(testimonySlide);
  const slide = slideWidth[0];
  const slideRec = slide.getBoundingClientRect();
  const style = getComputedStyle(slide);
  const margLeft = parseFloat(style.marginLeft) || 0;
  const margRight = parseFloat(style.marginRight) || 0;
  const perSlideWidth = slideRec.width;
  const itemWidth = getComputedStyle(testimonyContainer)
  let gap = parseFloat(itemWidth.gap) || 0;
  const wrapper = document.querySelector(".carousel-viewport");
  if(itemWidth.gap.includes("%")){
    const wrapWidth = wrapper.getBoundingClientRect().width;
    gap = wrapWidth * (parseFloat(itemWidth.gap) / 100);
  }
  const fullWidth = perSlideWidth + margLeft + margRight + gap;
  
  return {fullWidth, perSlideWidth};
}

//Fifth section mobile
let touchStartHandler;
let touchMoveHandler;
let touchEndHandler;
function indexPageFifthSection(){
  const testimonyContainer = document.querySelector(".customer-testimony-container");
  const testimonySlide = document.querySelectorAll(".customer-testimony");
  
  //let index = 0;
  let startX = 0;
  let isDragging = false;
  updateSlider();
  function updateSlider(){
    const {fullWidth, perSlideWidth} = getSlideMetrics();
    testimonyContainer.style.transform = `translateX(${-currentIndex * fullWidth}px)`;
  }
  touchStartHandler = e =>{
    startX = e.touches[0].clientX;
    isDragging = true};
   
  touchMoveHandler = e =>{
    if(!isDragging)return;};
    
  touchEndHandler = e =>{
    if(!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if(diff > 50){
      currentIndex = currentIndex === 0 ? testimonySlide.length - 1 : currentIndex - 1;
    } else if(diff < -50){
      currentIndex = (currentIndex + 1) % testimonySlide.length;
    }
    updateSlider();
    isDragging = false;
   // currentIndex = index;
    updateActiveDot();
  };
  testimonyContainer.addEventListener("touchstart", touchStartHandler, {passive: true})
  testimonyContainer.addEventListener("touchmove", touchMoveHandler, {passive: true})
  testimonyContainer.addEventListener("touchend", touchEndHandler, {passive: true})
  updateSlider();
}

//④This is to remove the swipe function when not in mobile viewport
function removeTouchEvents() {
  const carouselContainer = document.querySelector(".second-section-container");
  const testimonyContainer = document.querySelector(".customer-testimony-container");
  if (!secondTouchStart) return;
  carouselContainer.removeEventListener("touchstart", secondTouchStart);
  carouselContainer.removeEventListener("touchmove", secondTouchMove);
  carouselContainer.removeEventListener("touchend", secondTouchEnd);
  testimonyContainer.removeEventListener("touchstart", touchStartHandler);
  testimonyContainer.removeEventListener("touchmove", touchMoveHandler);
  testimonyContainer.removeEventListener("touchend", touchEndHandler);
}
function resetTestimonySlider() {
  currentIndex = 0;
  initialTestimonySlide();
  updateSlideWidth();
  createDots();
  updateCarousel();
}
window.addEventListener("resize", resetTestimonySlider); //Do it here since it wont work inside responsiveInit
//For viewport
function getLayout() {
  if (window.innerWidth <= 599) return "mobile";
  if (window.innerWidth <= 768) return "tablet";
  return "desktop";
}

let currentLayout = null;
let mobileInitialized = false;
function responsiveInit() {
  const newLayout = getLayout();
   
  if (newLayout === currentLayout) return;
  removeTouchEvents(); //⑤if not mobile then do this
  //Reset transforms * See above
  document.querySelectorAll(".coffee-selection-text").forEach(item => {
    item.style.transform = "";
  });
  document.querySelectorAll(".customer-testimony-container").forEach(item => {
    item.style.transform = "";
  });
  //Reset index
  currentIndex = 0;
  //Recalculate testimony slider
  initialTestimonySlide();
  updateSlideWidth();
  createDots();
  updateCarousel();
  
  //Init mobile sliders
  if (newLayout === "mobile") {
    indexPageSecondSection();
    indexPageFifthSection();
  }
  currentLayout = newLayout;
}
document.addEventListener("DOMContentLoaded", responsiveInit);
window.addEventListener("load", responsiveInit);
window.addEventListener("resize", responsiveInit);