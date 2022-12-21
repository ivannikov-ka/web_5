let currentSize = null;
let ROOT_URL = 'http://localhost:8080/api/';
let PICTURE_URL = 'http://localhost:8080/';
let clothes = null;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const fetchData = async () => {
  const clothesRes = await fetch(`${ROOT_URL}clothes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  clothes = await clothesRes.json();
  fillPage(clothes);
};
fetchData();

const fillPage = (clothes) => {
  console.log(clothes);
  const thumbnailWrapper = document.querySelector('.thumbnails');
  const mainImage = document.querySelector('.item-picture').children[0];
  mainImage.src = PICTURE_URL + clothes.images[0];
  for (const image of clothes.images) {
    console.log(image);
    const thumbnail = document.createElement('img');
    thumbnail.alt = 'thumbnail';
    thumbnail.src = PICTURE_URL + image;
    thumbnailWrapper.appendChild(thumbnail);
    thumbnail.onclick = (e) => {
      onImageClick(e.target, mainImage);
    };
  }
  const sizeWrapper = document.querySelector('.sizes');
  for (const size of clothes.sizes) {
    const newSize = document.createElement('p');
    newSize.textContent = `EUR ${size.name_eur} / RUS ${size.name_rus}`;
    newSize.onclick = (e) => {
      setSize(e.target, sizeWrapper.children, size.id);
    };
    sizeWrapper.appendChild(newSize);
  }
  currentSize = clothes.sizes[0].id;

  sizeWrapper.children[0].classList.add('active');
  document.querySelector('.price').textContent = `${clothes.cost} Р `;
  document.querySelector('.color-ball').style.background = clothes.color.hex;

  document.getElementById('href-edit').href =
    'http://127.0.0.1:5500/client/pages/edit.html?id=' + clothes.id;

  const productName = document.getElementById('product-name');
  productName.innerText = clothes.name.replaceAll(' ', '\n').toUpperCase();
};

const addToCart = () => {
  // console.log(currentSize);
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  let isRepeating = false;
  for (let cartItem of cart) {
    if (cartItem.id === clothes.id && cartItem.size.id === currentSize) {
      isRepeating = true;
      cartItem.count += 1;
      console.log('repeating');
      break;
    }
  }
  if (!isRepeating) {
    console.log('new');
    const size = {};
    size.id = currentSize;
    size.nameEur = clothes.sizes.find(
      (size) => size.id === currentSize,
    ).name_eur;
    size.nameRus = clothes.sizes.find(
      (size) => size.id === currentSize,
    ).name_rus;
    clothes.size = size;
    clothes.count = 1;
    clothes.imagePath = clothes.images[0];
    console.log(clothes);
    cart.push(clothes);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = localStorage.getItem('cart');
  console.log(JSON.parse(localStorage.getItem('cart')));
  refreshCart();
};

const onImageClick = (target, mainImg) => {
  mainImg.src = target.src;
};

const setSize = (target, sizeList, sizeId) => {
  for (const children of sizeList) {
    children.classList.remove('active');
  }
  target.classList.add('active');
  currentSize = sizeId;
};

const getCartCount = () => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  let length = 0;
  console.log(cart);
  for (const cartItem of cart) {
    length += Number(cartItem.count);
  }
  return length;
};

const refreshCart = () => {
  document.querySelector('.cart-count').textContent = getCartCount();
};

function onLoad() {
  const sizeWrapper = document.querySelector('.sizes');
  for (let children of sizeWrapper.children) {
    children.onclick = (e) => {
      setSize(e.target, sizeWrapper.children);
    };
  }
  refreshCart();
  const mainImage = document.querySelector('.item-picture').children[0];
  const thumbnails = document.querySelector('.thumbnails').children;
  for (let thumbnail of thumbnails) {
    thumbnail.onclick = (e) => {
      onImageClick(e.target, mainImage);
    };
  }
  document.querySelector('.add-cart').onclick = () => {
    addToCart();
  };
}

document.addEventListener('DOMContentLoaded', onLoad);
