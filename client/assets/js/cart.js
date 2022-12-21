const ROOT_PICTURE = 'http://localhost:8080/';
const ROOT_URL = 'http://localhost:8080/api/';

const setDataFromStorage = () => {
  const wrapper = document.querySelector('.order-content');
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  for (const cartItem of cart) {
    const itemWrapper = document.createElement('div');
    itemWrapper.id = `cartItem${cartItem.id}${cartItem.size.id}`;
    itemWrapper.classList.add('item');
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('item-img');
    const img = document.createElement('img');
    img.src = `${ROOT_PICTURE}${cartItem.imagePath}`;
    imgWrapper.appendChild(img);
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('add-buttons');
    const buttonDecremenet = document.createElement('button');

    const spanCount = document.createElement('span');
    spanCount.textContent = cartItem.count;

    buttonDecremenet.textContent = '-';
    buttonDecremenet.onclick = () => {
      decrementClothes(cartItem, spanCount);
    };

    const buttonIncremenet = document.createElement('button');
    buttonIncremenet.textContent = '+';
    buttonIncremenet.onclick = () => {
      incrementClothes(cartItem, spanCount);
    };

    buttonWrapper.appendChild(buttonDecremenet);
    buttonWrapper.appendChild(spanCount);
    buttonWrapper.appendChild(buttonIncremenet);

    imgWrapper.appendChild(buttonWrapper);

    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('item-info');
    const name = document.createElement('h3');
    name.textContent = cartItem.name;
    const size = document.createElement('p');
    size.textContent = `EUR ${cartItem.size.nameEur} / RUS ${cartItem.size.nameRus}`;

    const color = document.createElement('div');
    color.classList.add('color');
    const colorContent = document.createElement('div');
    colorContent.classList.add('color-content');
    colorContent.style.background = cartItem.color.hex;
    color.appendChild(colorContent);

    const price = document.createElement('p');
    price.textContent = cartItem.cost;

    infoWrapper.appendChild(name);
    infoWrapper.appendChild(size);
    infoWrapper.appendChild(color);
    infoWrapper.appendChild(price);

    itemWrapper.appendChild(imgWrapper);
    itemWrapper.appendChild(infoWrapper);
    wrapper.appendChild(itemWrapper);
  }
};
const incrementClothes = (cartItem, spanCount) => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  const indexOfItem = cart.findIndex(
    (item) => item.id === cartItem.id && item.size.id === cartItem.size.id,
  );
  const item = cart[indexOfItem];
  item.count = Number(item.count) + 1;
  spanCount.textContent = item.count;
  cart[indexOfItem] = item;
  localStorage.setItem('cart', JSON.stringify(cart));
  refreshInfo();
};

const decrementClothes = (cartItem, spanCount) => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  const indexOfItem = cart.findIndex(
    (item) => item.id === cartItem.id && item.size.id === cartItem.size.id,
  );
  const item = cart[indexOfItem];
  item.count = Number(item.count) - 1;
  if (item.count > 0) {
    spanCount.textContent = item.count;
    cart[indexOfItem] = item;
  } else {
    document
      .querySelector('.order-content')
      .removeChild(
        document.getElementById(`cartItem${cartItem.id}${cartItem.size.id}`),
      );
    cart.splice(indexOfItem, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  refreshInfo();
};

const getCartCount = () => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  let length = 0;
  for (const cartItem of cart) {
    length += cartItem.count;
  }
  console.log(length);
  return length;
};

const getCartPrice = () => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  let count = 0;
  for (const cartItem of cart) {
    count += Number(cartItem.cost) * Number(cartItem.count);
  }
  return count;
};

const refreshInfo = () => {
  document
    .querySelectorAll('.cart-count')
    .forEach((node) => (node.textContent = getCartCount()));
  document
    .querySelectorAll('.cart-price')
    .forEach((node) => (node.textContent = `${getCartPrice()} Р`));
};

const createOrder = async () => {
  console.log('new order');
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  const data = {};
  data.cart = cart;
  data.name = document.getElementById('name').value;
  data.email = document.getElementById('email').value;
  data.phone = document.getElementById('phone').value;
  data.datetime = new Date();
  console.log(data);
  const response = await fetch(`${ROOT_URL}cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log(response);
};

const onLoad = () => {
  refreshInfo();
  setDataFromStorage();
  document.querySelector('.btn-order').onclick = createOrder;
};

document.addEventListener('DOMContentLoaded', onLoad);
