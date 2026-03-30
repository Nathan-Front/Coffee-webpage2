
function imageButtonChanger(){  
    const buttonOfTheDay = document.querySelectorAll(".cappuccino-button-carousel");
    buttonOfTheDay.forEach((e) =>{
        e.addEventListener("click", () =>{
            document.querySelector(".activeButton").classList.remove("activeButton");
            e.classList.add("activeButton");
        });     
    });
}

function imageChanger(){
    const imameButtons = document.querySelectorAll(".article-left-panel-button-list button");
    const coffeeOfTheDay = document.getElementById("image-changer");
    imameButtons.forEach(e =>{
        e.addEventListener("click", () =>{
           coffeeOfTheDay.src = e.dataset.img;
        });     
    });
}
window.addEventListener('load', () => {
  imageButtonChanger();
  imageChanger();
});

function coffeeMonthAddToCart(){
    const coffeeMonthAddToCartBtn = document.getElementById("coffee-month-add-to-cart-btn");
    const coffeeMonthItemEl = document.getElementById("coffee-month-item");
    const coffeeMonthItemImgEl = document.getElementById("cappuccino-image");
    const coffeeMonthItemPriceEl = document.getElementById("cappuccino-price");
    const coffeeMonthItemText = document.getElementById("cappuccino-descript");
    const coffeeMonthItemShip = document.getElementById("cappuccino-shipping"); 
    if (!coffeeMonthAddToCartBtn || 
        !coffeeMonthItemEl || 
        !coffeeMonthItemImgEl || 
        !coffeeMonthItemPriceEl || 
        !coffeeMonthItemText || 
        !coffeeMonthItemShip) return;
    const coffeeMonthItem = coffeeMonthItemEl.textContent;
    const coffeeMonthItemImg = coffeeMonthItemImgEl.src;
    const coffeeMonthItemPrice = coffeeMonthItemPriceEl.textContent.replace('$', '');
    const coffeeMonthItemDescript = coffeeMonthItemText.textContent;
    const coffeeMonthItemShipping = coffeeMonthItemShip.textContent;

    coffeeMonthAddToCartBtn.addEventListener("click", () =>{   
        let cartContent = JSON.parse(localStorage.getItem("cartContent"))||{
            items: [],
            cartCounter: 0
        };
        const itemExisting = cartContent.items.find(
            cartItem => cartItem.item === coffeeMonthItem
        );
        if(itemExisting) {
            alert("Item already in the cart");
            return;
        }
        const coffeeList = [
                "Espresso",
                "Ristretto",
                "Lungo",
                "Doppio",
                "Red eye",
                "Americano",
                "Latte",
                "Cappuccino",
                "Flat white",
                "Cafe Au Lait",
                "Cortado",
                "Macchiato",
                "Mocha"
            ];
        const tax = coffeeList.includes(coffeeMonthItem) ? 0.75 : 0;
        let shippingFee;
        if(coffeeMonthItemShipping !== "Free Shipping") {
            shippingFee = coffeeMonthItemShipping.replace('$', '');
        } else {
            shippingFee = 0;
        }
        cartContent.items.push({
            id: crypto.randomUUID(),
            item: coffeeMonthItem,
            itemImg: coffeeMonthItemImg,
            itemDescript: coffeeMonthItemDescript,
            itemShipping: coffeeMonthItemShipping,
            itemPrice: coffeeMonthItemPrice,
            itemQty: 1,
            itemSubTotal: coffeeMonthItemPrice,
            itemShipFee: shippingFee,
            itemTax: tax
        });
        //productQty += 1;
        cartContent.cartCounter = cartContent.items.reduce((total, item) => total + (item.itemQty || 0), 0);
        localStorage.setItem("cartContent", JSON.stringify(cartContent));
        document.getElementById("cart-item-counter-display").textContent = cartContent.cartCounter;     
        alert("Item added to cart");       
    }); 
}
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("coffee-month-add-to-cart-btn")) {
        coffeeMonthAddToCart();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cartContent"));
    const counterEl = document.getElementById("cart-item-counter-display");
    if (cart && counterEl) {
        counterEl.textContent = cart.cartCounter || 0;
    }
});

function itemInCart(){
    const cartContainer = document.getElementById("cart-item-display-container");
    if (!cartContainer) return;
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if (!cartContent || !Array.isArray(cartContent.items)) return;
    const ul = document.createElement("ul");
    ul.className = "cart-item-list";
    cartContent.items.forEach((item) =>{
    const itemColumn = document.createElement("li");
    itemColumn.className = "cart-item-container";
    itemColumn.dataset.id = item.id;
        itemColumn.innerHTML = `
        <div class="item-info">
            <img src="${item.itemImg}" alt="cart item" />
            <div class="item-cart-description">
                <h3 class="item-title-cart">${item.item}</h3>
                <p>${item.itemDescript}</p>
                <span>${item.itemShipping}</span>
                <button class="delete-item-button" data-id="${item.id}">Delete</button>
            </div>
        </div>
        <div class="price">
            <div>
                <h3>Price:</h3>
                <span>$${item.itemPrice}</span>
            </div>
        </div>
        <div class="quantity">
            <h3>Quantity:</h3>
            <div>
                <button class="minus-btn">-</button>
                <span class="item-qty">${item.itemQty}</span>
                <button class="add-btn">+</button>
            </div>
        </div>
        <div class="total">
            <div>
                <h3>Total:</h3>
                <span class="total-display">$${item.itemSubTotal}</span>
            </div>
        </div>
    `;
    ul.appendChild(itemColumn);
    });  
    cartContainer.innerHTML = "";
    cartContainer.prepend(ul);
    document.getElementById("cart-item-counter").textContent = cartContent.cartCounter;  
}
document.addEventListener("DOMContentLoaded", itemInCart);

function addToCart(){
    const addToCartBtn = document.querySelectorAll(".add-to-cart-button");
    addToCartBtn.forEach(btn => {
        btn.addEventListener("click", (e) =>{
            const itemContainer = e.target.closest(".product-sale-item-container");  
            const itemName = itemContainer.querySelector("h4").textContent;
            const itemImage = itemContainer.querySelector("img").src;
            const itemDescript = itemContainer.querySelector("p").textContent;
            const itemShipping = itemContainer.querySelector("h5").textContent;
            let Price = itemContainer.querySelector("span").textContent;
            const itemPrice = Price.replace('$', '');
            let cartContent = JSON.parse(localStorage.getItem("cartContent"))||{
                    items: [],
                    cartCounter: 0
            };
            const itemExisting = cartContent.items.find(item => item.item === itemName)
            if(itemExisting) {
                alert("Item already in the cart");
                return;
            }
            const coffeeList = [
                "Espresso",
                "Ristretto",
                "Lungo",
                "Doppio",
                "Red eye",
                "Americano",
                "Latte",
                "Cappuccino",
                "Flat white",
                "Cafe Au Lait",
                "Cortado",
                "Macchiato",
                "Mocha"
            ];
            const tax = coffeeList.includes(itemName) ? 0.75 : 0;
            let shippingFee;
            if(itemShipping !== "Free Shipping") {
                shippingFee = itemShipping.replace('Shipping Fee: $', '');
            } else {
                shippingFee = 0;
            }
            if(itemContainer) {
                cartContent.items.push({
                    id: crypto.randomUUID(),
                    item: itemName,
                    itemImg: itemImage,
                    itemDescript: itemDescript,
                    itemShipping: itemShipping,
                    itemPrice: itemPrice,
                    itemQty: 1,
                    itemSubTotal: itemPrice,
                    itemShipFee: shippingFee,
                    itemTax: tax
                });
            }
            //localStorage.setItem("cartContent", JSON.stringify(cartContent))
            cartContent.cartCounter = cartContent.items.reduce((total, item) => total + (item.itemQty || 0), 0);
            localStorage.setItem("cartContent", JSON.stringify(cartContent));
            document.getElementById("cart-item-counter-display").textContent = cartContent.cartCounter;  
            updateCoffeeSlideWidth();
            updateCoffeeCarousel();
            alert("Item added to cart");
        });
    });
}
document.addEventListener("DOMContentLoaded", addToCart);

function addToCartOther(){
    const addBtn = document.querySelectorAll(".add-to-cart-other-button");
    addBtn.forEach(btn => {
        btn.addEventListener("click", (e) =>{
            const containerEl = e.target.closest(".other-items");
            const itemNameEl = containerEl.querySelector("h4");
            const itemImageEl = containerEl.querySelector("img");
            const itemDescriptEl =containerEl.querySelector("p");
            const itemShipEl = containerEl.querySelector("h5");
            let itemPriceEl = containerEl.querySelector("span");
            if( !itemNameEl||
                !itemImageEl ||
                !itemDescriptEl ||
                !itemShipEl||
                !itemPriceEl
            ) return;

            const otherItemName = itemNameEl.textContent;
            const otherItemImage = itemImageEl.src;
            const otherItemDescript = itemDescriptEl.textContent;
            const otherItemShip = itemShipEl.textContent;
            const otherItemShipFee = otherItemShip.replace('Shipping Fee: $', '');
            const otherPrice = itemPriceEl.textContent;
            const otherItemPrice = otherPrice.replace('$', '');
            
            let cartContent = JSON.parse(localStorage.getItem("cartContent"))||{
                items: [],
                cartCounter: 0
            };
            if(!cartContent || !Array.isArray(cartContent.items)){
                return 0;
            }
            const itemExisting = cartContent.items.find(item => item.item === otherItemName);
            
            if(itemExisting){
                alert("Item already in the cart");
                return;
            }
            let tax = 0;
            switch(otherItemName){
                case "Mug":
                tax = 0.75
                break;

                case "Paper Cup":
                tax = 0.25
                break;

                case "V60 Coffee Filter":
                tax = 0.50
                break;

                case "Transparent Dripper":
                tax = 0.75
                break;
            }
            
            //if(containerEl){
                cartContent.items.push({
                    id: crypto.randomUUID(),
                    item: otherItemName,
                    itemImg: otherItemImage,
                    itemDescript: otherItemDescript,
                    itemShipping: otherItemShip,
                    itemPrice: otherItemPrice,
                    itemQty: 1,
                    itemSubTotal: otherItemPrice,
                    itemShipFee: otherItemShipFee,
                    itemTax: tax
                });
            //}
            //localStorage.setItem("cartContent", JSON.stringify(cartContent));
            cartContent.cartCounter = cartContent.items.reduce((total, item) => total + item.itemQty, 0);
            localStorage.setItem("cartContent", JSON.stringify(cartContent));
            document.getElementById("cart-item-counter-display").textContent = cartContent.cartCounter; 
            alert("Item added to cart");
        });
    });
}
document.addEventListener("DOMContentLoaded", addToCartOther);

function itemIncreaseDecrease(){   
    const cartContainer = document.getElementById("cart-item-display-container");
    if (!cartContainer) return;

    cartContainer.addEventListener("click", (e) => {
        const itemContainer = e.target.closest(".cart-item-container");
        if (!itemContainer) return;

        const id = itemContainer.dataset.id;
        if (!id) return;

        let cartContent = JSON.parse(localStorage.getItem("cartContent"));
        if (!cartContent || !Array.isArray(cartContent.items)) return;

        const itemData = cartContent.items.find(item => item.id === id);
        if (!itemData) return;

        const qtySpan = itemContainer.querySelector(".item-qty");
        const totalSpan = itemContainer.querySelector(".total-display");

        if (e.target.classList.contains("add-btn")) {
            itemData.itemQty += 1;
        }

        if (e.target.classList.contains("minus-btn")) {
            if (itemData.itemQty <= 1) return;
            itemData.itemQty -= 1;
        }

        itemData.itemSubTotal = (itemData.itemQty * itemData.itemPrice).toFixed(2);

        qtySpan.textContent = itemData.itemQty;
        totalSpan.textContent = itemData.itemSubTotal;

        cartContent.cartCounter = cartContent.items.reduce(
            (total, item) => total + item.itemQty, 
            0
        );

        localStorage.setItem("cartContent", JSON.stringify(cartContent));
        document.getElementById("cart-item-counter").textContent = cartContent.cartCounter;
        displaySubTotal();
        displayShipFeeTotal();
        displayTax();
        displayGrandTotal();
        cartPageCounter();
        itemInCart();
    });
}
document.addEventListener("DOMContentLoaded", itemIncreaseDecrease);

function deleteFromCart(){
    const cartContainer = document.getElementById("cart-item-display-container");
    if(!cartContainer) return;  
    cartContainer.addEventListener("click", (e) =>{
        const btn = e.target.closest(".delete-item-button");
        if(!btn) return;
        //const itemName = btn.dataset.item;
        let cartContent = JSON.parse(localStorage.getItem("cartContent"));
        if (!cartContent || typeof cartContent !== "object") return;
        if (!Array.isArray(cartContent.items)) {
            cartContent.items = [];
        }
        const id = btn.dataset.id;
        cartContent.items = cartContent.items.filter(item => item.id !== id);
        cartContent.cartCounter = cartContent.items.reduce((total, item) => total + (item.itemQty || 0), 0); 
        localStorage.setItem("cartContent", JSON.stringify(cartContent));
        document.getElementById("cart-item-counter").textContent =  cartContent.cartCounter;
        itemInCart();
        displayGrandTotal();
        displayTax();
        cartPageCounter();
    });
}
document.addEventListener("DOMContentLoaded", deleteFromCart);

function cartPageCounter(){
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if(!cartContent) {
        return ;
    }
    const count = Number(cartContent.cartCounter) || 0;
    
    const itemCount = document.getElementById("cart-item-counter");
    const itemLabel = document.getElementById("cart-item-label");

    if(!itemCount || !itemLabel) return;

    itemCount.textContent = count;
    itemLabel.textContent = count === 1 ? "item" : "items";
}
document.addEventListener("DOMContentLoaded", cartPageCounter);

function subTotalCalc(){
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if (!cartContent || !Array.isArray(cartContent.items)){
        return 0;
    }
    return cartContent.items.reduce((sum, item) => {
        return sum + (Number(item.itemPrice) * Number(item.itemQty));
    }, 0);
}
function displaySubTotal(){
    let subTotal = document.getElementById("sub-total");
    if (subTotal) {
        subTotal.textContent = subTotalCalc().toFixed(2);
    }
}
document.addEventListener("DOMContentLoaded", displaySubTotal);

function itemTax(){
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if(!cartContent || !Array.isArray(cartContent.items)) {
        return 0;
    }
    return cartContent.items.reduce((sum, item) =>{
        return sum + (Number(item.itemTax || 0) * item.itemQty);
    }, 0);
}
function displayTax(){
    let taxTotal = document.getElementById("tax");
    if (taxTotal) {
        const cartContent = JSON.parse(localStorage.getItem("cartContent"));
        if(!cartContent) return;       
        taxTotal.textContent = itemTax().toFixed(2);
    }
}
document.addEventListener("DOMContentLoaded", displayTax);

function shippingFee(){
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if(!cartContent || !Array.isArray(cartContent.items)) {
        return 0;
    }
    return cartContent.items.reduce((sum, item) =>{
        return sum + Number(item.itemShipFee * item.itemQty);
    }, 0);
}
function displayShipFeeTotal(){
    let shipFeeTotal = document.getElementById("shipping-fee");
    if(shipFeeTotal){
        const cartContent = JSON.parse(localStorage.getItem("cartContent"));
        if(!cartContent) return;
        shipFeeTotal.textContent = shippingFee().toFixed(2);
    }
}
document.addEventListener("DOMContentLoaded", displayShipFeeTotal);

function grandTotal(){
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if(!cartContent || !Array.isArray(cartContent.items)) {
        return 0;
    }
    let subTotal = Number(subTotalCalc());
    let totalTax = Number(itemTax());
    let totalShipFee = Number(shippingFee());
    if(isNaN(subTotal) || isNaN(totalTax) || isNaN(totalShipFee)) {
        return 0;
    }
    return subTotal + totalTax + totalShipFee;
}
function displayGrandTotal(){
    let grandTotalEl = document.getElementById("grand-total");
    if(! grandTotalEl) return;
    const cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if(!cartContent) return;
    grandTotalEl.textContent = grandTotal().toFixed(2);
}
document.addEventListener("DOMContentLoaded", displayGrandTotal);

function checkoutCart(){
    const checkoutBtn = document.getElementById("checkout-button");
    if(!checkoutBtn) return;
    const userLoggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartContent = JSON.parse(localStorage.getItem("cartContent"));
    if(!cartContent || !Array.isArray(cartContent.items)){
        return;
    }
    checkoutBtn.addEventListener("click", () =>{
        if(!userLoggedIn){
            alert("Must be login");
        } else if (cartContent.cartCounter === 0){
            alert("No item in the cart");
        } else {
            alert("Total payment: $" + document.getElementById("grand-total").textContent);
        }
    });
}
document.addEventListener("DOMContentLoaded", checkoutCart);


const carouselWrapper = document.querySelector(".product-sale-list-item-container");
const coffeeSlides = document.querySelectorAll(".product-sale-item-container");

let coffeeVisibleSlides;
function initialItemSlide(){
  if(window.innerWidth <= 599){
    coffeeVisibleSlides = 1;
  } else if (window.innerWidth <= 768){
    coffeeVisibleSlides = 3;
  }else{
    coffeeVisibleSlides = 4;
  }
}

let coffeeCurrentIndex = 0;
let coffeeSlideWidth;
function updateCoffeeSlideWidth(){
    //coffeeSlideWidth = coffeeSlides[0].offsetWidth + 20;
  const first = coffeeSlides[0];
  const second = coffeeSlides[1];
  if(!first || !second) return;
  const firstRect = first.getBoundingClientRect();
  const secondRect = second.getBoundingClientRect();

  coffeeSlideWidth = secondRect.left - firstRect.left;
}

function updateCoffeeCarousel(){
    if(!carouselWrapper) return;
    if(window.innerWidth <= 599) return;
    carouselWrapper.style.transform = `translateX(${-coffeeCurrentIndex * coffeeSlideWidth}px)`;
    updateCoffeeDot();
}

function cofeeSlides(){
    initialItemSlide();
    const coffeePrevBtn = document.querySelector(".coffeePrev");
    const coffeeNextBtn = document.querySelector(".coffeeNext");
    const coffeeMaxIndex = coffeeSlides.length - coffeeVisibleSlides;

    if(!coffeePrevBtn || !coffeeNextBtn) return;
    coffeePrevBtn.addEventListener("click", () =>{
        if ( coffeeCurrentIndex <= 0 ) {
            coffeeCurrentIndex = coffeeMaxIndex;
        } else {
            coffeeCurrentIndex--;
        }
        updateCoffeeCarousel();
    });

    coffeeNextBtn.addEventListener("click", () =>{
        if ( coffeeCurrentIndex >= coffeeMaxIndex ) {
            coffeeCurrentIndex = 0;
        } else {
            coffeeCurrentIndex++;
        }
        updateCoffeeCarousel();
    });
}
cofeeSlides();

const coffeeDots = document.querySelector(".coffee-dots");
function coffeeDot(){
    if(!coffeeDots) return;
    let coffeeTotalDots = 0 
    if(window.innerWidth > 599){
        coffeeTotalDots = coffeeSlides.length - coffeeVisibleSlides + 1;
    } else {
        coffeeTotalDots = coffeeSlides.length - coffeeVisibleSlides + 4;
    }    
    coffeeDots.innerHTML = "";
    for ( let i = 0; i < coffeeTotalDots; i++) {
        const dot = document.createElement("button");

        dot.addEventListener("click", () =>{      
            if(window.innerWidth <= 599) return; 
            coffeeCurrentIndex = i;
            updateCoffeeCarousel();
        });
       coffeeDots.appendChild(dot);
      
    }
     updateCoffeeDot();
}
document.addEventListener("DOMContentLoaded", coffeeDot);
function updateCoffeeDot(){
    if(!coffeeDots) return;
    const dots = coffeeDots.querySelectorAll("button");
    if(!dots) return;
    dots.forEach((dot, coffeeIndex) =>{
        dot.classList.toggle("coffeeActive", coffeeIndex === coffeeCurrentIndex); 
    });
}

window.addEventListener('load', () => {
  if (!coffeeDots) return;
  updateCoffeeSlideWidth();
  updateCoffeeCarousel();
  updateCoffeeDot();
});

function getCarouselSlideWidth(){
    const carouselWrapper = document.querySelector(".product-sale-list-item-container");
    const coffeeSlides = document.querySelectorAll(".product-sale-item-container");
    const viewport = document.querySelector(".beans-carousel-viewport");
    const slideWidth = Array.from(coffeeSlides);
     if (!carouselWrapper || !coffeeSlides.length || !viewport) return null;
    const slide = slideWidth[0];
    const slideRect = slide.getBoundingClientRect();
    const style = getComputedStyle(slide);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    const perSlideWidth = slideRect.width;
     const wrapWidth = viewport.getBoundingClientRect().width;
    const containerWidth = getComputedStyle(carouselWrapper);
    let gap = parseFloat(containerWidth.gap) || 0;

    if(containerWidth.gap.includes("%")){  
        gap = wrapWidth * (parseFloat(containerWidth.gap) / 100);   
    }
   const fullWidth = perSlideWidth + marginLeft + marginRight + gap;
        return {perSlideWidth, fullWidth, wrapWidth};
}

function coffeeBeansCarouselTouch(){
    const carouselWrapper = document.querySelector(".product-sale-list-item-container");
    const coffeeSlides = document.querySelectorAll(".product-sale-item-container");
    if(!carouselWrapper || !coffeeSlides.length || !coffeeSlides) return;
    let index = coffeeCurrentIndex;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    const {perSlideWidth, fullWidth, wrapWidth} = getCarouselSlideWidth();
    if(!perSlideWidth || !fullWidth || !wrapWidth) return;
    function updateSlider(){
        const centerOffset = (wrapWidth - perSlideWidth) / 2;
        const translateX = -index * fullWidth + centerOffset;
        currentTranslate = translateX;
        /*coffeeSlides.forEach((slide, i) =>{
            slide.style.transform = `translateX(${currentTranslate}px)`;
        });*/
        carouselWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }
    updateSlider();
    carouselWrapper.addEventListener("touchstart", (e) =>{
        startX = e.touches[0].clientX;
        isDragging = true;}, 
        { passive: true } 
    );
    carouselWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;}, 
        { passive: true }
    );
    carouselWrapper.addEventListener("touchend", (e) =>{
        if(!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if(diff > 50){
            index = index === 0 ? coffeeSlides.length - 1 : index - 1;
        }else if (diff < -50) {
            index = (index + 1) % coffeeSlides.length;
        }
        updateSlider();
        isDragging = false;
        updateCoffeeDot();
        coffeeCurrentIndex = index;
        coffeeDot();  
    });
}
document.addEventListener("DOMContentLoaded", () => {
    if(document.body.classList.contains("coffee-beans-page")){
        if(window.innerWidth <= 599){
            coffeeBeansCarouselTouch();
        } else{
            updateCoffeeSlideWidth();
            updateCoffeeCarousel();
        }   
    }
});

window.addEventListener("resize", () => {
    if(window.innerWidth <= 599){
        coffeeBeansCarouselTouch();
    } else{
        updateCoffeeSlideWidth();
        updateCoffeeCarousel();
    }
    
});

function repositionCarousel(){
    initialItemSlide();
    coffeeDot();
    if(window.innerWidth <= 599){
        const sizes = getCarouselSlideWidth();
        if(!sizes) return;

        const {perSlideWidth, fullWidth, wrapWidth} = sizes;
        const centerOffset = (wrapWidth - perSlideWidth) / 2;
        const translateX = -coffeeCurrentIndex * fullWidth + centerOffset;
        carouselWrapper.style.transform = `translateX(${translateX}px)`;
    } else {
        updateCoffeeSlideWidth();
        updateCoffeeCarousel();
    }
    updateCoffeeDot();
}
window.addEventListener("resize", repositionCarousel);
