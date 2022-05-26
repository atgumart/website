let db = []

const priceMask = IMask(priceInput, {
    mask:"R$ num",
    blocks: {
        num: {
            mask: Number,
            thousandsSeparator: "."
        }
    }
})

const areaMask = IMask(areaInput, {
    mask: Number,
    thousandsSeparator: "."
})

populateLocationDatalist()

sellButton.addEventListener("mouseover", (envent => {
    sellButton.classList.replace("btn-outline-primary", "btn-primary")
    rentButton.classList.replace("btn-primary", "btn-outline-primary")
}), false)

sellButton.addEventListener("mouseout", (envent => {
    sellButton.classList.replace("btn-primary", "btn-outline-primary")
    rentButton.classList.replace("btn-outline-primary", "btn-primary")
}), false)

addForm.addEventListener("submit", (event => {
    event.preventDefault()
    event.stopPropagation()
    if (addForm.checkValidity()) {
        genZip(event.submitter.value)
    }
    addForm.classList.add("was-validated")
}), false)

async function populateLocationDatalist() {
    db = await fetch("/id/db.json").then(r => r.json())
    const options = new Set(db.map(db => db.location).sort((a, b) => {
        return a.localeCompare(b)
    }))
    options.forEach(option => {
        locationDatalist.innerHTML += `<option value="${option}"></option>`
    })
}

function genZip(action) {
    const basedir = "id"
    const zip = new JSZip()
    const id = Date.now().toString(16)
    zip.file(`${basedir}/${id}.json`, JSON.stringify({
        id: id,
        location: locationInput.value,
        action: action,
        price: parseInt(priceMask.unmaskedValue),
        bedrooms: parseInt(bedroomsInput.value),
        bathrooms: parseInt(bathroomsInput.value),
        spots: parseInt(spotsInput.value),
        area: parseInt(areaMask.unmaskedValue),
        description: descriptionText.value,
        pics: picsInput.files.length,
        video: videoInput.value
    }))
    zip.file(`${basedir}/${id}/thumbnail.jpg`, thumbnailInput.files[0], { base64: true })
    for (let i = 0; i < picsInput.files.length; i++) {
        zip.file(`${basedir}/${id}/${i + 1}.jpg`, picsInput.files[i], { base64: true })
    }
    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, `${id}.zip`)
    })
}
