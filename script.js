const productList = document.getElementById('productList');
const form = document.getElementById('searchForm');
const searchContent = document.getElementById('searchContent');
const alertMessage = document.getElementById('alertMessage');
const sortSelect = document.getElementById('sortSelect');
let data = [];

async function makeRequest() {
    const res = await fetch('https://dummyjson.com/products');
    data = await res.json();
    renderProducts(data.products);
}

function renderProducts(products) {
    productList.innerHTML = '';
    products.forEach((product) => {
        productList.innerHTML += `
            <div class="card mt-2" style="width: 18rem;">
                <img class="card-img-top" src=${product.thumbnail} alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">Price: $${product.price}</p>
                </div>
            </div>
        `;
    });
}

function sortByName(products) {
    return products.slice().sort((a, b) => {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
}

function sortByPrice(products) {
    return products.slice().sort((a, b) => a.price - b.price);
}

sortSelect.addEventListener('change', () => {
    const selectedValue = sortSelect.value;
    let sortedProducts = [];

    if (selectedValue === 'name') {
        sortedProducts = sortByName(data.products);
    } else if (selectedValue === 'price') {
        sortedProducts = sortByPrice(data.products);
    }

    renderProducts(sortedProducts);
});

function filterProducts(searchText) {
    return data.products.filter((product) =>
        product.title.toLowerCase().includes(searchText.toLowerCase())
    );
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    searchContent.innerHTML = '';
    alertMessage.setAttribute('hidden', true);
    const searchText = e.target.searchText.value.trim();

    if (searchText) {
        const filteredProducts = filterProducts(searchText);

        if (filteredProducts.length === 0) {
            alertMessage.removeAttribute('hidden');
            alertMessage.innerHTML = 'No matching results';
        } else {
            renderProducts(filteredProducts);
        }
    } else {
        alertMessage.removeAttribute('hidden');
        alertMessage.innerHTML = 'Please enter a search keyword';
    }
});

window.onload = (event) => {
    makeRequest();
};
