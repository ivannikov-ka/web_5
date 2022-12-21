let isMaleProduct = true;
MAX_FILE_COUNT = 6;
let files = [];

let PICTURE_URL = 'http://localhost:8080/';

const categories = [];
let sizes = [];
let colors = [];

let ROOT_URL = 'http://localhost:8080/api/';
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const fetchData = async () => {
  const [categoryRes, sizeRes, colorRes, clothesRes] = await Promise.all([
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
    fetch(`${ROOT_URL}clothes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }),
  ]);
  const clothes = await clothesRes.json();
  fetchImages(clothes.images);
  files = [...(await fetchImages(clothes.images))];
  loadFiles(files);
  sizes = await sizeRes.json();
  colors = await colorRes.json();
  fillPage(await categoryRes.json(), await sizes, await colors, await clothes);
};
fetchData();

const fillPage = (categories, sizes, colors, clothes) => {
  console.log(clothes);
  console.log(categories, sizes, colors);
  const sizeWrapper = document.getElementById('checkboxs-wrapper');
  console.log(sizeWrapper);
  for (const size of sizes) {
    const isChecked =
      clothes.sizes.findIndex((clSize) => clSize.id === size.id) !== -1;
    const checkBoxWrapper = document.createElement('div');
    checkBoxWrapper.classList.add('check-string');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.checked = isChecked;
    inputCheckbox.classList.add('checkbox-size');
    const span = document.createElement('span');
    span.textContent = `EUR ${size.name_eur} / RUS ${size.name_rus}`;
    checkBoxWrapper.appendChild(inputCheckbox);
    checkBoxWrapper.appendChild(span);
    sizeWrapper.appendChild(checkBoxWrapper);
  }

  document.getElementById('product-name').value = clothes.name;
  document.getElementById('product-name').value = clothes.name;

  const categorySelect = document.getElementById('select-category');
  for (const category of categories) {
    const newOption = document.createElement('option');
    newOption.value = category.id;
    newOption.textContent = category.name;
    categorySelect.appendChild(newOption);
  }
  categorySelect.value = clothes.category_id;

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
  colorSelect.value = clothes.color.hex;
  onChangeColor(clothes.color.hex);
  document.getElementById('price-input').value = clothes.cost;
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

  const response = await fetch(`${ROOT_URL}clothes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });
  console.log(response);
};

function readFileAsync(file) {
  if (file?.data) {
    return file.data;
  }
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

const onDeleteImg = (id) => {
  files = files.filter((file) => file.name != id);
  document.getElementById(id).remove();
  console.log(files);
};

const loadFiles = async (data) => {
  console.log(data);
  const picturesWrapper = document.getElementById('button-wrapper');
  for (let fileData of data) {
    const image = document.createElement('img');
    image.id = fileData.name;
    image.src = 'data:image/jpeg;base64,' + fileData.data;
    image.alt = 'imagePicture';
    image.onclick = () => {
      onDeleteImg(image.id);
    };
    picturesWrapper.insertAdjacentElement('beforebegin', image);
  }
};

const onFileLoad = async (e) => {
  if (e.target.files.length + files.length > MAX_FILE_COUNT) {
    alert('MAX FILES COUNT ' + MAX_FILE_COUNT);
    return;
  }
  const picturesWrapper = document.getElementById('button-wrapper');

  for (let file of e.target.files) {
    files.push(file);
    let reader = new FileReader();
    reader.onload = function () {
      const image = document.createElement('img');
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
  console.log(value);
  if (value[0] === '#' && (value.length === 4 || value.length === 7)) {
    document.getElementById('color-ball').style.background = value;
  }
};

async function fetchImages(photoUrls) {
  if (photoUrls.length === 0) {
    return [];
  }
  console.log(photoUrls);
  const responses = await Promise.all(
    photoUrls?.map(async (photoUrl) => ({
      name: photoUrl,
      data: await readFileAsync(
        await (
          await fetch(`${PICTURE_URL}${photoUrl}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'blob',
            },
          })
        ).blob(),
      ),
    })),
  );
  return responses;
}

const handleDelete = async () => {
  await fetch(`${ROOT_URL}clothes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const onLoad = () => {
  const inputFile = document.getElementById('input-file');
  console.log(inputFile);
  inputFile.onchange = (e) => {
    onFileLoad(e);
  };
  document.getElementById('file-load').onclick = () => {
    inputFile.click();
  };
  const gendersProductSpans =
    document.getElementById('genders-product').children;
  for (let span of gendersProductSpans) {
    console.log(span);
    span.onclick = (e) => {
      setGenderProduct(e.target, gendersProductSpans);
    };
  }
  document.getElementById('add-product').onclick = () => {
    handleAddProduct();
  };
  document.getElementById('del-btn').onclick = () => {
    handleDelete();
  };
};

document.addEventListener('DOMContentLoaded', onLoad);
