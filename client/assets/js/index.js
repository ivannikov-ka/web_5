// let isMenuOpened = false;
// const handleClickMenu = (burgerBtn, menu) => {
//   console.log('test');
//   if (!isMenuOpened) {
//     menu.classList.remove('menu-closed');
//     burgerBtn.classList.add('menu-closed');
//   } else {
//     menu.classList.add('menu-closed');
//     burgerBtn.classList.remove('menu-closed');
//   }
//   isMenuOpened = !isMenuOpened;

//   console.log(menu);
// };
// document.addEventListener('DOMContentLoaded', () => {
//   const productCards = document.getElementsByClassName('item');
//   for (let card of productCards) {
//     console.log(card.children[0]);
//     card.children[0].onclick = () => {
//       window.location.href = '../pages/product.html';
//     };
//   }
//   const burgerBtn = document.querySelector('.burger-menu');
//   const menu = document.querySelector('.short-menu');
//   const closeBtn = document.querySelector('.btn-close-menu');
//   closeBtn.onclick = () => handleClickMenu(burgerBtn, menu);
//   burgerBtn.onclick = () => handleClickMenu(burgerBtn, menu);
// });
