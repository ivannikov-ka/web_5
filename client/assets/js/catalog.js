const ROOT_URL = 'http://localhost:8080/api/';
const ROOT_PICTURE = 'http://localhost:8080/';
const PRODUCT_URL = 'http://127.0.0.1:5500/client/pages/product.html';
let currentCategory = 0;
let currentPage = 0;
let totalPages = null;
const fetchData = async () => {
  const clothesRes = await fetch(`${ROOT_URL}clothes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  const categoriesRes = await fetch(`${ROOT_URL}category`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  const categories = await categoriesRes.json();
  const clothesResponse = await clothesRes.json();
  const clothes = clothesResponse.clothes;
  setPages(clothesResponse.totalPages);
  fillPage(clothes, categories);
};
fetchData();

const fetchClothes = async (page) => {
  clearClothes();
  const clothesRes = await fetch(
    `${ROOT_URL}clothes?` +
      new URLSearchParams({
        category: currentCategory,
        page: page,
      }),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );
  const clothesResponse = await clothesRes.json();
  const clothesList = clothesResponse.clothes;
  setPages(clothesResponse.totalPages);
  const wrapper = document.getElementById('item-list');
  for (let clothes of clothesList) {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('item');
    const image = document.createElement('img');
    image.src = `${ROOT_PICTURE}${clothes.imagePath}`;
    const buttonAdd = document.createElement('button');
    buttonAdd.classList.add('btn-add');
    buttonAdd.textContent = '+';

    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('item-info');
    const leftPartWrapper = document.createElement('div');
    leftPartWrapper.classList.add('left-part');
    const name = document.createElement('span');
    name.textContent = clothes.name.toUpperCase();
    const color = document.createElement('div');
    color.classList.add('color');
    color.style.background = clothes.color.hex;
    leftPartWrapper.appendChild(name);
    leftPartWrapper.appendChild(color);
    const price = document.createElement('span');
    price.textContent = `${clothes.cost} Р`;
    const popUp = document.createElement('div');
    popUp.hidden = true;
    popUp.classList.add('popup');
    for (let size of clothes.sizes) {
      const sizeBtn = document.createElement('button');
      sizeBtn.textContent = `EUR ${size.nameEur} / RUS ${size.nameRus}`;
      sizeBtn.onclick = (e) => {
        console.log('Clicked');
        e.preventDefault();
        handleAddToCart(clothes, size);
        popUp.hidden = true;
      };
      popUp.appendChild(sizeBtn);
    }
    buttonAdd.onclick = (e) => {
      e.preventDefault();
      popUp.hidden = !popUp.hidden;
    };

    infoWrapper.appendChild(leftPartWrapper);
    infoWrapper.appendChild(price);
    itemWrapper.appendChild(image);
    itemWrapper.appendChild(buttonAdd);
    itemWrapper.appendChild(popUp);
    itemWrapper.appendChild(infoWrapper);
    wrapper.appendChild(itemWrapper);

    image.onclick = () => {
      window.location.href = `${PRODUCT_URL}?id=${clothes.id}`;
    };
  }
};

const clearPages = () => {};

const clearCategories = () => {
  document.getElementById('category-all').classList.remove('selected');
  const categoryWrapper = document.getElementById('categories-list');
  const lis = categoryWrapper.getElementsByTagName('li');
  const allA = [];
  for (let item of lis) {
    console.log(item);
    allA.push(item.getElementsByTagName('a')[0]);
  }
  console.log(allA);
  for (let a of allA) {
    a.classList.remove('selected');
  }
};
const clearClothes = () => {
  document.getElementById('item-list').innerHTML = '';
};

const fillPage = (clothesList, categories) => {
  const wrapper = document.getElementById('item-list');
  for (let clothes of clothesList) {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('item');
    const image = document.createElement('img');
    image.src = `${ROOT_PICTURE}${clothes.imagePath}`;
    const buttonAdd = document.createElement('button');
    buttonAdd.classList.add('btn-add');
    buttonAdd.textContent = '+';

    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('item-info');
    const leftPartWrapper = document.createElement('div');
    leftPartWrapper.classList.add('left-part');
    const name = document.createElement('span');
    name.textContent = clothes.name.toUpperCase();
    const color = document.createElement('div');
    color.classList.add('color');
    color.style.background = clothes.color.hex;
    leftPartWrapper.appendChild(name);
    leftPartWrapper.appendChild(color);
    const price = document.createElement('span');
    price.textContent = `${clothes.cost} Р`;
    const popUp = document.createElement('div');
    popUp.hidden = true;
    popUp.classList.add('popup');
    for (let size of clothes.sizes) {
      const sizeBtn = document.createElement('button');
      sizeBtn.textContent = `EUR ${size.nameEur} / RUS ${size.nameRus}`;
      sizeBtn.onclick = (e) => {
        console.log('Clicked');
        e.preventDefault();
        handleAddToCart(clothes, size);
        popUp.hidden = true;
      };
      popUp.appendChild(sizeBtn);
    }
    buttonAdd.onclick = (e) => {
      e.preventDefault();
      popUp.hidden = !popUp.hidden;
    };

    infoWrapper.appendChild(leftPartWrapper);
    infoWrapper.appendChild(price);
    itemWrapper.appendChild(image);
    itemWrapper.appendChild(buttonAdd);
    itemWrapper.appendChild(popUp);
    itemWrapper.appendChild(infoWrapper);
    wrapper.appendChild(itemWrapper);

    image.onclick = () => {
      window.location.href = `${PRODUCT_URL}?id=${clothes.id}`;
    };
  }
  const categoryWrapper = document.getElementById('categories-list');
  for (let category of categories) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.text = category.name.toLowerCase();
    a.href = '';
    a.onclick = (e) => {
      e.preventDefault();
      clearCategories();
      changeCategory(e, category.id);
    };
    li.appendChild(a);
    categoryWrapper.appendChild(li);
  }
};

const changeCategory = (e, id) => {
  clearClothes();
  e.target.classList.add('selected');
  currentCategory = id;
  fetchClothes(1);
};

const getLengthOfCart = () => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  let length = 0;
  for (const cartItem of cart) {
    length += cartItem.count;
  }
  return length;
};
const handleAddToCart = (clothes, size) => {
  let cart = [];
  if (localStorage.getItem('cart')) {
    cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
  }
  let isRepeating = false;
  for (let cartItem of cart) {
    if (cartItem.id === clothes.id && cartItem.size.id === size.id) {
      isRepeating = true;
      cartItem.count += 1;
      break;
    }
  }
  if (!isRepeating) {
    clothes.size = size;
    clothes.count = 1;
    cart.push(clothes);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  document.getElementById('cart-count').textContent = getLengthOfCart();
  cart = localStorage.getItem('cart');
  console.log(JSON.parse(localStorage.getItem('cart')));
};

const setPages = (totalPages) => {
  const pagesWrapper = document.getElementById('pages-wrapper');
  pagesWrapper.innerHTML = '';
  console.log(totalPages);
  new Array(totalPages).fill(0).map((val, index) => {
    console.log(val);
    const page = document.createElement('button');
    page.innerText = index + 1;
    if (index === 0) {
      page.classList.add('selected');
    }
    page.onclick = (e) => {
      e.target.classList.add('selected');
      e.preventDefault();
      fetchClothes(index + 1);
    };
    console.log(pagesWrapper);
    pagesWrapper.appendChild(page);
  });
};

const onLoad = () => {
  document.getElementById('cart-count').textContent = getLengthOfCart();
  document.getElementById('category-all').onclick = (e) => {
    e.preventDefault();
    clearCategories();
    changeCategory(e, 0);
    // e.target.classList.add('selected');
  };
};

document.addEventListener('DOMContentLoaded', onLoad);
