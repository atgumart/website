let db = []
const basedir = "/id"

loadIndex()

async function loadIndex() {
    db = await fetch(`${basedir}/db.json`).then(r => r.json())
    loadItems("sell")
}

function loadItems(type) {
    itemsRow.innerHTML = ""
    new bootstrap.Collapse(filterCollapse).toggle()
    if (type == "rent") {
        rentButton.classList.replace("btn-outline-primary", "btn-primary")
        buyButton.classList.replace("btn-primary", "btn-outline-primary")
    } else if (type == "sell") {
        buyButton.classList.replace("btn-outline-primary", "btn-primary")
        rentButton.classList.replace("btn-primary", "btn-outline-primary")
    }
    db.filter(item => {
        return item.bedrooms >= bedroomsSelect.value &&
        item.bathrooms >= bathroomsSelect.value &&
        item.spots >= spotsSelect.value &&
        item.area >= areaInput.value &&
        item.type == type
    }).sort((a, b) => b.price - a.price).forEach(item => {
        itemsRow.innerHTML += `
            <div class="col">
                <div class="card shadow-sm">
                    <a class="stretched-link" href="#modal" data-bs-toggle="modal" onclick="updateModal('${item.id}')"><img src="${basedir}/${item.id}/1.jpg" alt="thumbnail" class="card-img-top"></a>
                    <div class="card-body text-center pb-2">
                        <h5 class="card-title my-0">${item.district}</h5>
                        <ul class="list-group list-group-horizontal justify-content-center card-subtitle fw-bold my-0">
                            <li class="list-group-item border-0">${item.bedrooms} <i class="fa-solid fa-bed"></i></li>
                            <li class="list-group-item border-0">${item.bathrooms} <i class="fa-solid fa-toilet"></i></li>
                            <li class="list-group-item border-0">${item.spots} <i class="fa-solid fa-car"></i></li>
                            <li class="list-group-item border-0">${item.area} <i class="fa-solid fa-expand"></i></li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    })
}

function updateModal(id) {
    const item = db.find(item => item.id == id)
    modalCarousel.innerHTML = `
        <div class="carousel-item active">
            <img src="${basedir}/${item.id}/1.jpg" alt="img" class="d-block w-100">
        </div>
    `
    for (let i = 2; i <= item.pics; i++) {
        modalCarousel.innerHTML += `
            <div class="carousel-item">
                <img src="${basedir}/${item.id}/${i}.jpg" alt="img" class="d-block w-100">
            </div>
        `
    }

    modalDistrict.innerHTML = `<i class="fa-solid fa-location-dot text-danger"></i> ${item.district}`
    modalPrice.innerHTML = `${(item.type == "rent") ? "Alugar" : "Comprar"} por <span class="fw-bold">${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>`
    modalAttributes.innerHTML = `
        <li class="list-group-item border-0">${item.bedrooms} <i class="fa-solid fa-bed"></i></li>
        <li class="list-group-item border-0">${item.bathrooms} <i class="fa-solid fa-toilet"></i></li>
        <li class="list-group-item border-0">${item.spots} <i class="fa-solid fa-car"></i></li>
        <li class="list-group-item border-0">${item.area} <i class="fa-solid fa-expand"></i></li>
    `
    modalDescription.innerHTML = item.description
}
