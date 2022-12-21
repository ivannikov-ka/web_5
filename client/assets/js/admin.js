let isMaleProduct = true;
let isMaleCategory = true;
MAX_FILE_COUNT = 6;
let files = [];

const categories = [];
let sizes = [];
let colors = [];

let ROOT_URL = 'http://localhost:8080/api/';

const fetchData = async () => {
  const urls = [`${ROOT_URL}category`, `${ROOT_URL}size`, `${ROOT_URL}color`];
  const [categoryRes, sizeRes, colorRes] = await Promise.all([
    fetch(`${ROOT_URL}category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }),
    fetch(`${ROOT_URL}size`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }),
    fetch(`${ROOT_URL}color`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }),
  ]);
  //   console.log(categoryRes, sizeRes, colorRes);
  // categories.push(categoryRes.json());
  // sizes.push(sizeRes.json());
  sizes = await sizeRes.json();
  colors = await colorRes.json();
  fillPage(await categoryRes.json(), await sizes, await colors);
};
fetchData();

const fillPage = (categories, sizes, colors) => {
  console.log(categories, sizes, colors);
  const sizeWrapper = document.getElementById('checkboxs-wrapper');
  console.log(sizeWrapper);
  for (const size of sizes) {
    const checkBoxWrapper = document.createElement('div');
    checkBoxWrapper.classList.add('check-string');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.classList.add('checkbox-size');
    const span = document.createElement('span');
    span.textContent = `EUR ${size.name_eur} / RUS ${size.name_rus}`;
    checkBoxWrapper.appendChild(inputCheckbox);
    checkBoxWrapper.appendChild(span);
    sizeWrapper.appendChild(checkBoxWrapper);
  }
  const categorySelect = document.getElementById('select-category');
  for (const category of categories) {
    const newOption = document.createElement('option');
    newOption.value = category.id;
    newOption.textContent = category.name;
    categorySelect.appendChild(newOption);
  }

  const colorSelect = document.getElementById('color-select');
  colorSelect.onchange = (e) => {
    onChangeColor(e.target.value);
  };

  for (const color of colors) {
    const newOption = document.createElement('option');
    newOption.value = color.hex;
    newOption.textContent = color.name;
    colorSelect.appendChild(newOption);
  }
};

const handleAddProduct = async () => {
  const nameInput = document.getElementById('product-name');
  const colorSelect = document.getElementById('color-select');
  const categorySelect = document.getElementById('select-category');
  const checksWrapper = document.querySelectorAll('.check-string');
  const priceInput = document.getElementById('price-input');

  const choosedSizes = [];
  for (const checkString of checksWrapper) {
    if (!checkString.children[0].checked) {
      continue;
    }
    choosedSizes.push(
      Number(
        sizes.filter(
          (size) =>
            size.name_eur ===
              checkString.children[1].textContent.split(' ')[1] &&
            size.name_rus === checkString.children[1].textContent.split(' ')[4],
        )[0].id,
      ),
    );
  }
  const base64Files = [];
  for (let file of files) {
    base64Files.push(await readFileAsync(file));
  }
  const newProduct = {
    name: nameInput.value,
    isMale: isMaleProduct,
    cost: priceInput.value,
    colorId: colors.filter((color) => color.hex === colorSelect.value)[0].id,
    sizes: choosedSizes,
    categoryId: categorySelect.value,
    images: base64Files,
  };
  console.log(newProduct);

  const response = await fetch(`${ROOT_URL}clothes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });
  console.log(response);
};

const handleAddCategory = async () => {
  const name = document.getElementById('add-category-name');
  let response = await fetch(`${ROOT_URL}category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ name: name.value, is_male: isMaleCategory }),
  });

  let result = await response.json();
  console.log(result);
};

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      console.log('readed');
      resolve(reader.result.toString().replace(/^data:(.*,)?/, ''));
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

const handleAddColor = async () => {
  const name = document.getElementById('add-color-name');
  const hex = document.getElementById('add-color-hex');
  console.log('add color', name.value, hex.value);
  let response = await fetch(`${ROOT_URL}color`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ name: name.value, hex: hex.value }),
  });

  let result = await response.json();
  console.log(result);
};

const handleAddSize = async () => {
  const eur = document.getElementById('add-size-eur');
  const rus = document.getElementById('add-size-rus');
  let response = await fetch(`${ROOT_URL}size`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ name_eur: eur.value, name_rus: rus.value }),
  });

  let result = await response.json();
  console.log(result);

  console.log('add size', eur.value, rus.value);
};

const setGenderProduct = (current, gendersSpans) => {
  for (const span of gendersSpans) {
    span.classList.remove('active');
  }
  current.classList.add('active');
  current.innerHTML === 'мужчинам'
    ? (isMaleProduct = true)
    : (isMaleProduct = false);
  console.log('Product: ', isMaleProduct);
};

const setGenderCategory = (current, gendersSpans) => {
  for (const span of gendersSpans) {
    span.classList.remove('active');
  }
  current.classList.add('active');
  current.innerHTML === 'мужчинам'
    ? (isMaleCategory = true)
    : (isMaleCategory = false);
  console.log('Category: ', isMaleCategory);
};

const onDeleteImg = (id) => {
  files = files.filter((file) => file.name != id);
  document.getElementById(id).remove();
  console.log(files);
};

const onFileLoad = async (e) => {
  console.log(e.target);
  console.log('load');
  if (e.target.files.length + files.length > MAX_FILE_COUNT) {
    alert('MAX FILES COUNT ' + MAX_FILE_COUNT);
    return;
  }
  const picturesWrapper = document.getElementById('button-wrapper');
  console.log(picturesWrapper);

  for (let file of e.target.files) {
    files.push(file);
    let reader = new FileReader();
    reader.onload = function () {
      const image = document.createElement('img');
      // files.push(reader.result);
      image.id = file.name;
      image.src = reader.result;
      image.alt = 'imagePicture';
      image.onclick = () => {
        onDeleteImg(image.id);
      };
      picturesWrapper.insertAdjacentElement('beforebegin', image);
    };
    reader.readAsDataURL(file);
  }
  console.log(files);
};

const onChangeColor = (value) => {
  if (value[0] === '#' && (value.length === 4 || value.length === 7)) {
    document.getElementById('color-ball').style.background = value;
  }
};

const onChangeColorAdd = (value) => {
  if (value[0] === '#' && (value.length === 4 || value.length === 7)) {
    console.log(value);
    document.getElementById('color-ball-add').style.background = value;
  }
};

const onLoad = () => {
  console.log('loaded doc');
  const inputFile = document.getElementById('input-file');
  console.log(inputFile);
  inputFile.onchange = (e) => {
    onFileLoad(e);
  };
  document.getElementById('file-load').onclick = () => {
    inputFile.click();
  };
  // document.getElementById('color-input').onblur = (e) => {
  //   onChangeColor(e.target.value);
  // };
  const gendersProductSpans =
    document.getElementById('genders-product').children;
  for (let span of gendersProductSpans) {
    console.log(span);
    span.onclick = (e) => {
      setGenderProduct(e.target, gendersProductSpans);
    };
  }
  const gendersCategorySpans =
    document.getElementById('genders-category').children;
  for (let span of gendersCategorySpans) {
    console.log(span);
    span.onclick = (e) => {
      setGenderCategory(e.target, gendersCategorySpans);
    };
  }
  document.getElementById('add-color').onclick = () => {
    handleAddColor();
  };
  document.getElementById('add-color-hex').onblur = (e) => {
    onChangeColorAdd(e.target.value);
  };

  document.getElementById('add-size-btn').onclick = () => {
    handleAddSize();
  };
  document.getElementById('add-category-btn').onclick = () => {
    handleAddCategory();
  };
  document.getElementById('add-product').onclick = () => {
    handleAddProduct();
  };
};

document.addEventListener('DOMContentLoaded', onLoad);
