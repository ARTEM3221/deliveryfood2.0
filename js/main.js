'use strict';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInform');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const inputSearch = document.querySelector('.rest-input');


let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Adress ${url},
        statys ${response}`);
    }
    return await response.json();
};

function toggleModal() {
    modal.classList.toggle("is-open");
}

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
    if (modalAuth.classList.contains("is-open")) {
        enableScroll();
    } else {
        disableScroll();
    }
}

function clearForm() {
    loginInput.style.borderColor = '';
    logInForm.reset();
}

function authorized() {

    function logOut() {
        login = null;
        localStorage.removeItem('gloDelivery');
        buttonAuth.style.display = '';
        userName.style.display = '';
        userName.style.fontWeight = '';
        userName.style.fontSize = '';
        buttonOut.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();
    }

    console.log('Авторизований');
    userName.textContent = login;
    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    userName.style.fontWeight = 'bold';
    userName.style.fontSize = '20px';
    buttonOut.style.display = 'block';
    buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
    console.log('Не авторизований');

    function logIn(event) {
        event.preventDefault();
        if (loginInput.value.trim()) {
            login = loginInput.value;
            localStorage.setItem('gloDelivery', login);
            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn);
            logInForm.reset();
            checkAuth();
        } else {
            loginInput.style.borderColor = '#ff0000';
            loginInput.value = '';
        }
    }
    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);

    modalAuth.addEventListener('click', function (event) {
        if (event.target.classList.contains("is-open")) {
            toggleModalAuth();
        }
    })
}

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}

function createCardRestaurant(restaurant) {
    const {
        image,
        kitchen,
        name,
        price,
        products,
        stars,
        time_of_delivery
    } = restaurant;

    const cardRestaurant = document.createElement('a');
    cardRestaurant.classList.add('card', 'card-restaurant');
    cardRestaurant.products = products;
    cardRestaurant.info = { kitchen, name, price, stars };


    const card =
        `
<a class="card card-restaurant  data-products="${products}">
                        <img src="${image}" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title">${name}</h3>
                                <span class="card-tag tag">${time_of_delivery}</span>
                            </div>
                            <div class="card-info">
                                <div class="rating">
                                &#9733; ${stars}
                                </div>
                                <div class="price">Від ${price} грн</div>
                                <div class="category">${kitchen}</div>
                            </div>
                        </div>
                    </a>
`;
    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood(goods) {

    const { description, image, name, price } = goods;
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
                <div class="card">
                        <img src="${image}" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title card-title-reg">${name}</h3>
                            </div>

                            <div class="card-info">
                                <div class="ingredients">${description}</div>
                            </div>

                            <div class="card-buttons">
                                <button class="button button-primary button-add-cart">
                                    <span class="button-card-text">В кошик</span>
                                    <span class="button-cart-svg"></span>
                                </button>
                                <strong class="card-price-bold">${price}</strong>
                            </div>
                        </div>
                    </div>
    `);
    menuCards.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
    const target = event.target;

    if (login) {
        const restaurant = target.closest('.card-restaurant');
        if (restaurant) {

            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            getData(`./db/${restaurant.products}`).then(function (data) {
                data.forEach(createCardGood);
            });


        }
    } else {
        toggleModalAuth();
    }
}

function returnMain() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
}


function init() {
    getData('./db/partners.json').then(function (data) {
        data.forEach(createCardRestaurant)
    });

    cartButton.addEventListener("click", toggleModal);

    close.addEventListener("click", toggleModal);

    cardsRestaurants.addEventListener('click', openGoods);

    logo.addEventListener('click', returnMain);

    checkAuth();

    inputSearch.addEventListener('keypress', function (event) {
        if (event.charCode === 13) {
            getData('./db/partners.json')
                .then(function (data) {
                    return data.map(function (partner) {
                        return partner.products;
                    });
                })
                .then(function (linksProduct) {
                    linksProduct.forEach(function (link) {
                        getData(`./db/${link}`)
                            .then(function (param) { })
                    })
                })
        }
    })
}
init();

new Swiper('.swiper', {
    sliderPreView: 1,
    loop: true,
    autoplay: true
});