document.addEventListener("DOMContentLoaded", function () { // Запустит код только при полной зграузки DOM-дерева
    const goodsElems = loadLocalStorage() || []; // Вызывает функцию loadLocalStorage(про неё внизу написал), если она пуста, то создаётся пустой массив

    const cartBtn = document.querySelector(".header-link__cart") // Находит элемент по классу
    const cartHeaderBody = document.querySelector(".cart-header__body") // Находит элемент по классу
    const cartHeaderList = document.querySelector(".cart-header__list") // Находит элемент по классу
    const headerCounterSpan = document.querySelector(".header-link__cart span") // Находит элемент по классу

    if (!cartHeaderList) { // Проверяет навсякий случай, чтобы избежать ошибок
        console.error("ОШИБОЧКА АААААААААААААА")
        return
    }

    const goods = document.querySelectorAll(".goods") // Находит все элементы по классу

    cartBtn.addEventListener("click", (e) => { // Вешает слушатель события - клик по кнопке
        e.preventDefault() // Отменяет все действия браузеры по умолчанию
        cartHeaderBody.classList.toggle("_active") // Если класс _active есть, то убирает его и наоброт
    })

    goods.forEach((item, i) => { // Перебирает все товары
        const goodsDataID = item.dataset.id // Берёт data-id(посмотри в коде html 72 строка). Без униклаьного id будет работать не стабильно
        const goodsBtnSubmit = item.querySelector(".goods__btn_submit") // Находит элемент по классу
        const goodsHeader = item.querySelector(".goods__header").innerText // Находит элемент и берёт его текст
        goodsBtnSubmit.addEventListener('click', (e) => { // Вешает слушатель события - клик по кнопке
            addInGoodsElem(goodsHeader, goodsDataID) // вызывает функцию и  передаёт туда 2 аргумента: заголовок и ID
        })
    })

    // Функция находит элемент по id, и если он есть то просто добавляет к счётчику +1(quantity), иначе просто добавляет весь товар в массив
    function addInGoodsElem(header, id) { //
        const productIndex = goodsElems.findIndex(item => item.id === id)
        if (productIndex === -1) {
            goodsElems.push({header: header, id: id, quantity: 1})
        } else {
            goodsElems[productIndex].quantity += 1
        }
        saveLocalStorage()
        addInCart()
    }

    // Функция добавляет товар в корзину
    function addInCart() {
        cartHeaderList.innerHTML = '' // Убирает всё в корзине
        let countGoods = 0 // счётчик количества товаров
        if (goodsElems.length === 0) { // проверяет есть ли вообще добавленные товары
            cartHeaderList.insertAdjacentHTML("beforeend", "<p>корзина пуста</p>")
        } else { // иначе создаёт этот товар(goodsTemplateContent - шаблон) и добавляет его в корзину
            goodsElems.forEach((item, i) => {
                let goodsTemplateContent = `
                <li class="cart-header__item">
                    <p class="cart-header__title">${item.header}</p>
                    <h4 class="cart-header__counter">${item.quantity}</h4>
                    <button class="cart-header__btn_delete" type="submit" data-delete="${item.id}">Удалить 1 товар</button>
                </li>
            `
                countGoods += item.quantity // счётчик количества товаров
                cartHeaderList.insertAdjacentHTML("beforeend", goodsTemplateContent)
            })


            // находит все кнопки с data-delete(смотри 54 строку в этом файле, data-delete="${item.id}")
            const deleteButtons = cartHeaderList.querySelectorAll("button[data-delete]")

            // перебирает все кнопки и добавляет слушатель(клик), при клике удалит 1 товар
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.delete
                    removeFromGoodsElem(id)
                })
            })
        }
        counterGoods(countGoods)
    }

    // Функция для удаления товаров из корзины
    function removeFromGoodsElem(id) {
        // Проверяет если ли товар с этим id, если да то возвращает индекс, если нет, то вернёт -1
        const goodsIndex = goodsElems.findIndex(item => item.id === id)

        // если НЕ -1, то значит товар найден и дальше стандартная проверка количества товаров
        if (goodsIndex !== -1) {
            if (goodsElems[goodsIndex].quantity > 1) {
                goodsElems[goodsIndex].quantity -= 1
            } else {
                goodsElems.splice(goodsIndex, 1)
            }
        }
        saveLocalStorage() // Вызывает функцию для записи в локальное хранилище
        addInCart() // Вызывает функцию для добавления в корзину
        if (goodsElems === []) {
            cartHeaderList.insertAdjacentHTML("beforeend", "Тут ничего нет")
        }
    }

    // Функция для вставки количества товаров в корзине
    function counterGoods(i) {
        if (i === 0) {
            headerCounterSpan.innerHTML = "0";
        } else {
            headerCounterSpan.innerHTML = i;
        }
    }

    // Функция для сохранения в локальное хранилище
    function saveLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(goodsElems));
    }

    // Функция для загрузки товаров из локлаьного хранилища
    function loadLocalStorage() {
        const storedGoods = localStorage.getItem('cartItems');
        return storedGoods ? JSON.parse(storedGoods) : [];
    }

    addInCart()
})