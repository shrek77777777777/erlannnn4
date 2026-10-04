const API_URL = "https://inai-col1.fishrungames.com/ads";
const API_BASE = "https://inai-col1.fishrungames.com";

const adsList = document.getElementById("adsList");
const total = document.getElementById("total");
const form = document.getElementById("adForm");
const message = document.getElementById("message");

async function loadAds() {
    adsList.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border"></div>
        </div>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Ошибка загрузки");
        }

        const data = await response.json();

        total.textContent = `Найдено объявлений: ${data.total}`;
        adsList.innerHTML = "";

        if (!data.items.length) {
            adsList.innerHTML = `
                <div class="col-12 text-center py-5">
                    Объявлений пока нет
                </div>
            `;
            return;
        }

        data.items.forEach(ad => {
            const image = ad.image_url
                ? `<img src="${API_BASE}${ad.image_url}" class="ad-image" alt="${ad.title}">`
                : `<div class="no-image">Нет изображения</div>`;

            adsList.innerHTML += `
                <div class="col-md-6 col-lg-4">
                    <div class="ad-card">
                        ${image}
                        <div class="ad-content">
                            <div class="ad-title mb-2">${ad.title}</div>
                            <div class="ad-description mb-3">${ad.description}</div>
                            <div class="ad-price">${Number(ad.price).toLocaleString("ru-RU")} сом</div>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        adsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Не удалось загрузить объявления
                </div>
            </div>
        `;
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];

    if (!image) {
        message.innerHTML = `<div class="alert alert-warning">Выберите изображение</div>`;
        return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    message.innerHTML = `<div class="alert alert-secondary">Отправка...</div>`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Ошибка отправки");
        }

        await response.json();

        form.reset();

        message.innerHTML = `
            <div class="alert alert-success">
                Объявление успешно добавлено
            </div>
        `;

        await loadAds();

    } catch (error) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Не удалось отправить объявление
            </div>
        `;
    }
});

loadAds();