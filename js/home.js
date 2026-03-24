
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
      section.style.display = "none";
      section.classList.remove("selectedCoffee");
    });

    const target = document.getElementById(ev.dataset.target);
    target.style.display = "flex";
    target.classList.add("selectedCoffee");
    adjustImagesByTextHeight(); 
  });
});
}

function adjustImagesByTextHeight() {
  const block = document.querySelector(".coffee-selection-text.selectedCoffee");
  if (!block) return;
  const p = block.querySelector("p");
  const images = block.querySelectorAll(".coffee-images");
  if (!p || !images.length) return;
  const textHeight = p.scrollHeight; 
  images.forEach(img => {
     img.style.height = "";
  if (textHeight > 140 ) {
    img.style.height = "clamp(130px, 15vw, 200px)";
  }
   else if (textHeight > 80) {
      img.style.height = "clamp(160px, 18vw, 320px)";
  } 
  });
}
coffeeSelector();


//Testimony slider
const carouselWrapper = document.querySelector('.customer-testimony-container');
const slides = document.querySelectorAll('.customer-testimony');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let visibleSlides; //Initial slider display 
function initialTestimonySlide(){
  //visibleSlides = window.innerWidth > 540 ? 3 : 1;
  if(window.innerWidth <= 540){
    visibleSlides = 1;
  } else if(window.innerWidth <= 768){
    visibleSlides = 2;
  }else{
    visibleSlides = 3;
  }
}
initialTestimonySlide();
document.addEventListener("DOMContentLoaded", initialTestimonySlide);
let currentIndex = 0;
let slideWidth;
let currentIndex2 = 0;
let mobileFunction;
function updateSlideWidth() {
  slideWidth = slides[0].offsetWidth + 20; //Includes space between each sliders
}

function updateCarousel() {
  carouselWrapper.style.transform =
    `translateX(${-currentIndex * slideWidth}px)`;
  
  updateActiveDot();
}

window.addEventListener('resize', updateSlideWidth);

const maxIndex = slides.length - visibleSlides;

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
const totalDots = slides.length - visibleSlides + 1;

function createDots(){  
  dotsContainer.innerHTML = "";
  for ( let i = 0; i < totalDots; i++ ) {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
      if(window.innerWidth <= 540) return;
        currentIndex = i;
        updateCarousel();
      //updateActiveDot();
    });
    dotsContainer.appendChild(dot);
  }
 updateActiveDot();
}

function updateActiveDot(){
  const dots = dotsContainer.querySelectorAll("button");

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      window.innerWidth <= 540
        ? index === currentIndex2
        : index === currentIndex
    );
  });
}

window.addEventListener('load', () => {
  updateSlideWidth();
  updateCarousel();
  createDots();
});

window.__mobileUpperSliderActive = false;
window.__mobileMainSliderActive = false;
function mobileDesktopInit() {
    const isMobile = window.innerWidth <= 540;
    if (isMobile) {
        indexPageSecondSection();
        indexPageFifthSection();
    } else {
       // enableDesktop();
    }
}
document.addEventListener("DOMContentLoaded", mobileDesktopInit);
window.addEventListener("resize", mobileDesktopInit);
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
  
  const spanDots = document.querySelectorAll(".mobile-dot");
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
  carouselContainer.addEventListener("touchstart", e =>{
    startX = e.touches[0].clientX;
    isDragging = true;}, 
    { passive: true } 
  );
  carouselContainer.addEventListener('touchmove', e => {
    if (!isDragging) return;}, 
    { passive: true }
  );
  carouselContainer.addEventListener("touchend", e =>{
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
  },{ passive: true } );
  
}
window.addEventListener("resize", indexPageSecondSection);
document.addEventListener("DOMContentLoaded", indexPageSecondSection);

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
function indexPageFifthSection(){
  const testimonyContainer = document.querySelector(".customer-testimony-container");
  const testimonySlide = document.querySelectorAll(".customer-testimony");
  let index = 0;
  let startX = 0;
  let isDragging = false;
 
  const {fullWidth, perSlideWidth} = getSlideMetrics();
  updateSlider();
  function updateSlider(){
    testimonySlide.forEach((s, _) =>{
      s.style.transform = `translateX(${-index * fullWidth}px)`;
    });
  }

  testimonyContainer.addEventListener("touchstart", e =>{
    startX = e.touches[0].clientX;
    isDragging = true},
    {passive: true}
  );
  testimonyContainer.addEventListener("touchmove", e =>{
    if(!isDragging)return;},
    {passive:true}
  );
  testimonyContainer.addEventListener("touchend", e =>{
    if(!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if(diff > 50){
      index = index === 0 ? testimonySlide.length - 1 : index - 1;
    } else if(diff < -50){
      index = (index + 1) % testimonySlide.length;
    }
    updateSlider();
    isDragging = false;
    
    //createDots();
    currentIndex2 = index;
    updateActiveDot();
  },{ passive: true } );
  
}

let wasMobile = null;
function mobileDesktopInit() {
  const isMobile = window.innerWidth <= 540;
  if (isMobile === wasMobile) return;
  wasMobile = isMobile;
  if (isMobile) {
    indexPageSecondSection();
    indexPageFifthSection();
  }
}
window.addEventListener("resize", mobileDesktopInit);
document.addEventListener("DOMContentLoaded", mobileDesktopInit);