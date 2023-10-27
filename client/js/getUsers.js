let getUsers = async (query = false) => {
    try 
    {
        let response = await fetch(`http://127.0.0.1:3000${query ? `?term=${query}` : ''}`);
        return response.json()
    }
    catch(err)
    {
        console.log(err);
    }
}

getUsers()
.then(data => {
    if (data.length > 0)
    {
        renderUsers(data);
    }
})


let searchInput = document.querySelector('.input-search input');
searchInput.addEventListener('input', (event) => {
    getUsers(event.target.value)
    .then(data => {
        if (data.length > 0)
        {
            renderUsers(data);
        }    
    })
});


let modalWrapper = document.querySelector('.modal');
modalWrapper.addEventListener('click', (event) => {
    if (!event.target.classList.contains('modal__content' ||
        event.target.classList.contains('modal__closeBtn'))) {
        modalWrapper.classList.toggle('modal-active');
    }
})

let usersList = document.querySelector('.users');
usersList.addEventListener('click', (event) => {
    if ( event.target.classList.contains('users__item') )
    {
        let userName = event.target.children[0].textContent;
        getUsers(userName)
        .then(data => {
            if (data.length > 0)
            {
                modalWrapper.classList.toggle('modal-active');
                let modalNameTitle = document.querySelector('.modal__header h3');
                modalNameTitle.textContent = data[0].name;
                let userInfo = createFullUserInfo(data[0]);
                let modalBody = document.querySelector('.modal__body');
                modalBody.innerHTML = userInfo;   
            }
        })
    }
});

let createFullUserInfo = (user) => {
    let userInfo = 
    `
        <div class='userInfo__item'><div>Телефон:</div> <a href='tel:${user.phone}'>${user.phone}</a></div>
        <div class='userInfo__item'><div>Почта:</div> <a href='mailto:${user.email}'>${user.email}</a></div>
        <div class='userInfo__item'><div>Дата приёма:</div> <p>${user.hire_date}</p></div>
        <div class='userInfo__item'><div>Должность:</div> <p>${user.position_name}</p></div>
        <div class='userInfo__item'><div>Подразделение:</div> <p>${user.department}</p></div>
        <div class='userInfo__description'>
            <h4>Дополнительная информация:</h4>
            <p>${user.address}</p>
        </div>
    `;
    return userInfo;
}



let renderUsers = (data) => {
    let users = data.map(item => {
        return new UserCart({
            name: item.name,
            phoneNumber: item.phone,
            email: item.email,
        })
    })
    let nodeUserList = document.querySelector('.users');
    nodeUserList.innerHTML = "";
    users.forEach(element => {
        nodeUserList.append(element.cart);
    });
}

class UserCart {
    constructor(options) {
        this._name =  options.name;
        this._phoneNumber = options.phoneNumber;
        this._email = options.email;

        this.cart = undefined;
        this._render();
    }

    _createCartWrapper()
    {
        let wrapper = document.createElement('div');
        wrapper.classList = "users__item";
        return wrapper;
    }

    _createLink(href, content, classes, typeLink = "email")
    {
        let link = document.createElement('a');
        link.classList = classes;
        link.textContent = content;
        let hrefType = "mailto:";
        if (typeLink === "phone")
        {
            hrefType = "tel:"
        }
        link.href = `${hrefType}${href}`;
        return link;
    }

    _createCartLinks()
    {
        let linksWrapper = document.createElement('div');
        linksWrapper.classList = "users__links";
        let phone = this._createLink(
            this._phoneNumber,
            this._phoneNumber,
            "phone-link",
            "phone",
        )
        let email = this._createLink(
            this._email,
            this._email,
            "email-link",
        )
        linksWrapper.append(phone, email);
        return linksWrapper;
    }
    _render()
    {
        let cart = this._createCartWrapper();
        let name = document.createElement('h3');
        name.textContent = this._name;
        let links = this._createCartLinks();
        cart.append(name, links);
        this.cart = cart;
    }
}