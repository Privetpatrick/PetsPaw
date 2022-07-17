let pageTool = {
    data: null,
    activeName: '',
    navigationActive: null,
    pageOpened: 'main',
    otherPages: ['voting', 'breeds', 'gallery'],
    likesPages: ['likes', 'favourites', 'dislikes'],
    gridsCollection: {},
    breedsList: {},
    votingPageSettings: {
        imgShowingUrl: 'img/test-cat.png',
        imgDom: null,
        imgId: '',
        loaderDom: null,
    },
    breedsPageSettings: {
        loaderDom: null,
        limit: 10,
        sort: 'Random',
        idBreedSelected: '',
        sortAscDom: null,
        sortDescDom: null,
    },
    galleryPageSettings: {
        data: null,
        loaderDom: null,
        limit: 10,
        sort: 'Random',
        type: 'All',
        idBreedSelected: '',
    },
    openPage: function (name) {
        if (name === this.activeName) {
            return;
        }
        if (this.otherPages.includes(name)) {
            this._defaultActive();
            this.activeName = name;
            this.pageOpened = document.querySelector(`.${name}-page`);
            this._enablePage(this.pageOpened);
            this._disablePage(document.querySelector('.main'));
            this.navigationActive = document.querySelector(`.${name}-nav`)
            this.navigationActive.classList.add('active-nav');
            this.navigationActive.lastElementChild.classList.add('active-names');
            if (name === 'gallery' && this.galleryPageSettings.data) {
                this.createGrid(this.galleryPageSettings.data, 'gallery');
            }
            return;
        }
        if (this.likesPages.includes(name)) {
            this._defaultActive();
            this.activeName = name;
            this.pageOpened = document.querySelector(`.${name}-page`);
            this._enablePage(this.pageOpened);
            this.navigationActive = document.querySelector(`.${name}-page .${name}`)
            this.navigationActive.classList.add(`active-${name}`);
            this.navigationActive.classList.remove(`button`);
            return;
        }
        if (name == 'main') {
            this._defaultActive();
            this._openMain();
            return;
        }
        if (name == 'one-breed') {
            this._defaultActive();
            this._disablePage(document.querySelector('.main'));
            this.activeName = name;
            this.navigationActive = document.querySelector(`.${name}-page`)
            this.pageOpened = document.querySelector(`.${name}-page`);
            this._enablePage(this.pageOpened);
            return;
        }
        if (name == 'search') {
            this._defaultActive();
            this._disablePage(document.querySelector('.main'));
            this.activeName = name;
            this.navigationActive = document.querySelector(`.${name}-page`)
            this.pageOpened = document.querySelector(`.${name}-page`);
            this._enablePage(this.pageOpened);
            return;
        }
    },
    createGrid: function (data, pageName = this.activeName) {
        let gridDomWrapper;
        let counter = data.length;
        let doneDownload = 0;
        if (pageName === 'favourites') {
            this._createGridForLikesFavouritesDislikes(data, 'favourites')
        }
        if (pageName === 'likes') {
            this._createLikesDislikesData(data, 'likes')
        }
        if (pageName === 'dislikes') {
            this._createLikesDislikesData(data, 'dislikes')
        }
        if (this.otherPages.includes(pageName) && pageName !== 'voting' || pageName === 'search') {
            this.gridsCollection[pageName] = true;
            gridDomWrapper = document.querySelector(`.${pageName}-page .grid-wraper`);
            gridDomWrapper.innerHTML = '';
            while (data.length > 10) {
                if (pageName === 'gallery') {
                    this.galleryPageSettings.data = JSON.parse(JSON.stringify(data))
                    let newData = data.splice(0, 10)
                    let gridDiv = this._gridForGallery(newData);
                    gridDomWrapper.append(gridDiv);
                    this._disableLoader('gallery')
                } else {
                    let gridDiv = document.createElement('div')
                    gridDiv.classList.add('grid')
                    let newData = data.splice(0, 10)
                    newData.forEach(elem => {
                        let url = elem.url
                        let div = document.createElement('div');
                        let img = document.createElement('img');
                        img.src = url;
                        img.addEventListener('load', () => {
                            doneDownload++;
                        });
                        let hoverButton = document.createElement('div')
                        hoverButton.classList.add('button-hover')
                        if (elem.breeds.length > 0) {
                            img.classList.add(`${elem.breeds[0].id}`);
                            if (pageName === 'breeds' || pageName === 'search') {
                                hoverButton.textContent = elem.breeds[0].name
                            };
                        } else {
                            if (pageName === 'breeds' || pageName === 'search') {
                                hoverButton.textContent = 'Unknown breed'
                            };
                        }
                        hoverButton.addEventListener('click', (e) => {
                            let idBreed = e.target.previousSibling.classList.value
                            requestTool.getRequest(idBreed, 5)
                                .then(data => {
                                    this._showBreedInfo(data);
                                    this.openPage('one-breed');
                                });
                        });
                        div.append(img);
                        div.append(hoverButton);
                        gridDiv.append(div)
                    })
                    let intervalId = setInterval(() => {
                        if (doneDownload === 10) {
                            gridDomWrapper.append(gridDiv);
                            this._disableLoader(pageName)
                            clearInterval(intervalId)
                        }
                    }, 500)
                }
            }
            if (pageName === 'gallery') {
                this.galleryPageSettings.data = JSON.parse(JSON.stringify(data))
                let gridDiv = this._gridForGallery(data);
                gridDomWrapper.append(gridDiv);
                this._disableLoader('gallery')
            } else {
                let gridDiv = document.createElement('div')
                gridDiv.classList.add('grid')
                data.forEach(elem => {
                    let url = elem.url
                    let div = document.createElement('div');
                    let img = document.createElement('img');
                    img.src = url;
                    img.addEventListener('load', () => {
                        doneDownload++;
                    });
                    let hoverButton = document.createElement('div')
                    hoverButton.classList.add('button-hover')
                    if (elem.breeds.length > 0) {
                        img.classList.add(`${elem.breeds[0].id}`);
                        if (pageName === 'breeds' || pageName === 'search') {
                            hoverButton.textContent = elem.breeds[0].name
                        };
                    } else {
                        if (pageName === 'breeds' || pageName === 'search') {
                            hoverButton.textContent = 'Unknown breed'
                        };
                    }
                    hoverButton.addEventListener('click', (e) => {
                        let idBreed = e.target.previousSibling.classList.value
                        requestTool.getRequest(idBreed, 5)
                            .then(data => {
                                this._showBreedInfo(data);
                                this.openPage('one-breed');
                            });
                    });
                    div.append(img);
                    div.append(hoverButton);
                    gridDiv.append(div)
                })
                let intervalId = setInterval(() => {
                    if (doneDownload >= 1) {
                        gridDomWrapper.append(gridDiv);
                        this._disableLoader(pageName)
                        clearInterval(intervalId)
                    }
                }, 500)
            }
        }
    },
    showImg: function () {
        if (this.votingPageSettings.imgDom) {
            this._enableLoader('voting');
            requestTool.getRequest('', '', 1, 'Random')
                .then(data => {
                    this.votingPageSettings.imgShowingUrl = data[0].url;
                    this.votingPageSettings.imgDom.src = data[0].url;
                    this.votingPageSettings.imgDom.addEventListener('load', (e) => {
                        // this._disableLoader('voting');
                        this.votingPageSettings.imgId = data[0].id;
                    });
                });
        } else {
            this.votingPageSettings.imgDom = document.querySelector('.img-voting img');
            // this._enableLoader('voting');
            requestTool.getRequest('', '', 1, 'Random')
                .then(data => {
                    this.votingPageSettings.imgShowingUrl = data[0].url;
                    this.votingPageSettings.imgDom.src = data[0].url;
                    this.votingPageSettings.imgDom.addEventListener('load', (e) => {
                        this._disableLoader('voting');
                        this.votingPageSettings.imgId = data[0].id;
                    });
                });
        }
    },
    _createGridForLikesFavouritesDislikes: function (data, pageName = this.activeName) {
        let doneDownload = 0;
        this.gridsCollection[pageName] = true;
        let gridDomWrapper = document.querySelector(`.${pageName}-page .grid-wraper`);
        gridDomWrapper.innerHTML = '';
        while (data.length > 10) {
            let gridDiv = document.createElement('div')
            gridDiv.classList.add('grid')
            data.forEach(elem => {
                let url = elem.image.url
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.classList.add(`${elem.id}`)
                img.src = url;
                div.append(img);
                let deleteButton = document.createElement('div')
                deleteButton.classList.add('button-hover')
                deleteButton.addEventListener('click', (e) => {
                    this.gridsCollection[pageName] = false;
                    let id = e.target.previousSibling.classList[0]
                    let imgId = this._IdFromUrl(e.target.previousSibling.src)
                    requestTool.deleteLikeFavouritesDislike(id, pageName, imgId);
                    userData._newLog(pageName, imgId);
                    userData._showLogs()
                    e.target.parentElement.remove()
                });
                div.append(deleteButton);
                gridDiv.append(div)
            })
            gridDomWrapper.append(gridDiv);
            this.gridsCollection[pageName] = true;
        }
        let gridDiv = document.createElement('div')
        gridDiv.classList.add('grid')
        data.forEach(elem => {
            let url = elem.image.url
            let div = document.createElement('div');
            let img = document.createElement('img');
            img.classList.add(`${elem.id}`)
            img.src = url;
            img.addEventListener('load', () => {
                doneDownload++;
            });
            div.append(img);
            let deleteButton = document.createElement('div')
            deleteButton.classList.add('button-hover')
            deleteButton.addEventListener('click', (e) => {
                this.gridsCollection[pageName] = false;
                let id = e.target.previousSibling.classList[0]
                let imgId = this._IdFromUrl(e.target.previousSibling.src)
                requestTool.deleteLikeFavouritesDislike(id, pageName, imgId);
                userData._newLog(pageName, imgId);
                userData._showLogs()
                e.target.parentElement.remove()
            });
            div.append(deleteButton);
            gridDiv.append(div)
        })
        let intervalId = setInterval(() => {
            if (doneDownload === data.length) {
                gridDomWrapper.append(gridDiv);
                this._disableLoader(pageName)
                clearInterval(intervalId)
            }
        }, 500)
        this.gridsCollection[pageName] = true;
    },
    _gridForGallery: function (data) {
        let gridDiv = document.createElement('div')
        gridDiv.classList.add('grid')
        data.forEach(elem => {
            let url = elem.url
            let div = document.createElement('div');
            let img = document.createElement('img');
            img.src = url;
            img.classList.add(`${elem.id}`);
            div.append(img);
            let hoverButtons = this._hoverButtonForGallery(elem.id);
            div.append(hoverButtons);
            gridDiv.append(div)
        });
        return gridDiv;
    },
    _hoverButtonForGallery: function (imgId) {
        let buttonHover = document.createElement('div');
        if (userData.favourites[imgId]) {
            buttonHover.classList.add('button-hover-del');
        } else {
            buttonHover.classList.add('button-hover');
            buttonHover.addEventListener('click', (e) => {
                if (e.target.classList.value === 'button-hover') {
                    this.gridsCollection.favourites = false;
                    buttonHover.classList.remove('button-hover')
                    requestTool.postFavourite(imgId)
                        .then(() => requestTool.getFavourites())
                        .then(data => {
                            this.createGrid(data, 'favourites')
                            buttonHover.classList.add('button-hover-del')
                        });
                }
                if (e.target.classList.value === 'button-hover-del') {
                    this.gridsCollection.favourites = false;
                    let favouritesId = userData.favourites[imgId];
                    buttonHover.classList.remove('button-hover-del')
                    requestTool.deleteLikeFavouritesDislike(favouritesId, 'favourites', imgId)
                        .then(() => {
                            buttonHover.classList.add('button-hover')
                        });
                }
            });
        }
        return buttonHover;
    },
    _showBreedInfo: function (data) {
        let infoDiv = document.querySelector('.one-breed-page .info-breed');
        infoDiv.previousElementSibling.children[1]
        infoDiv.previousElementSibling.innerHTML = `<div class="loader none"></div><img src="">`
        infoDiv.innerHTML = '';
        infoDiv.innerHTML = `
        <div>${data[0].breeds[0].name}</div>
        <div>Family companion cat</div>
        <div class="wraped-content">
            <div>
                <b>Temperament: </b><br>
                ${data[0].breeds[0].temperament}
            </div>
            <div>
                <b>Origin: </b>${data[0].breeds[0].orgin}<br>
                <b>Weight: </b>${data[0].breeds[0].weight.metric} kgs<br>
                <b>Life span: </b>${data[0].breeds[0].life_span} years<br>
            </div>
        `;
        infoDiv.previousElementSibling.children[1].src = data[0].url;
        infoDiv.previousElementSibling.children[1].classList.add('block')
        infoDiv.previousElementSibling.children[1].classList.add('selected')
        infoDiv.previousElementSibling.previousElementSibling.children[2].textContent = data[0].breeds[0].id;
        this.openPage('one-breed')
        this._enableLoader();
        infoDiv.previousElementSibling.children[1].addEventListener('load', () => {
            this._disableLoader();
        });
        data.shift()
        data.forEach(elem => {
            let imgDom = document.createElement('img');
            imgDom.src = elem.url;
            imgDom.classList.add('none');
            infoDiv.previousElementSibling.append(imgDom);
        });
    },
    _createBreedsList: function (data) {
        let breedsList = [];
        data.forEach(elem => {
            let obj = {};
            this.breedsList[elem.id] = elem.name;
            obj.id = elem.id;
            obj.name = elem.name;
            breedsList.push(obj);
        });
        breedsList = breedsList.sort();
        let fullSelect = document.createElement('select')
        fullSelect.classList.add('breed-select');
        fullSelect.innerHTML = `<option>All breeds</option>`
        breedsList.forEach(elem => {
            option = document.createElement('option')
            option.setAttribute('value', `${elem.id}`)
            option.textContent = elem.name;
            fullSelect.append(option);
        });
        let breedSelectDoms = document.querySelectorAll('.breed-select')
        breedSelectDoms.forEach(breedSelectDom => {
            let = newSelect = fullSelect.cloneNode(true)
            breedSelectDom.replaceWith(newSelect);
        });
    },
    _defaultActive: function () {
        if (this.otherPages.includes(this.activeName) || this.activeName === 'one-breed' || this.activeName === 'search') {
            this.navigationActive.classList.remove('active-nav');
            this.navigationActive.lastElementChild.classList.remove('active-names');
            this._disablePage(this.pageOpened);
            this.activeName = '';
            this.navigationActive = null;
        }
        if (this.likesPages.includes(this.activeName)) {
            this.navigationActive.classList.remove(`active-${this.activeName}`);
            this.navigationActive.classList.add(`button`);
            this._disablePage(this.pageOpened);
            this.activeName = '';
            this.navigationActive = null;
        }
        if (this.activeName === 'search') {
            document.querySelector('.search-page .grid-wraper').innerHTML = '';
        }
    },
    _openMain: function () {
        this.pageOpened = document.querySelector(`.main`)
        this._enablePage(this.pageOpened);
    },
    _enablePage: function (page) {
        page.classList.add('block');
        page.classList.remove('none');
    },
    _disablePage: function (page) {
        page.classList.add('none');
        page.classList.remove('block');
    },
    _enableLoader: function (pageName = this.activeName) {
        let loaderDom = document.querySelector(`.${pageName}-page .loader`)
        loaderDom.classList.add('block')
        loaderDom.classList.remove('none')
    },
    _disableLoader: function (pageName = this.activeName) {
        let loaderDom = document.querySelector(`.${pageName}-page .loader`)
        loaderDom.classList.remove('block')
        loaderDom.classList.add('none')
    },
    _createLikesDislikesData: function (data, pageName = this.activeName) {
        let likes = [];
        let dislikes = [];
        data.forEach(elem => {
            if (elem.value === 1) {
                likes.push(elem);
            } else {
                dislikes.push(elem);
            }
        });
        if (likes.length > 0) {
            likes = this._convertData(likes);
            this._createGridForLikesFavouritesDislikes(likes, 'likes');
        }
        if (dislikes.length > 0) {
            dislikes = this._convertData(dislikes);
            this._createGridForLikesFavouritesDislikes(dislikes, 'dislikes')
        }
    },
    _convertData: function (data) {
        let newData = [];
        data.forEach(elem => {
            let elemObj = {
                image: {},
            };
            elemObj.id = elem.id;
            elemObj.image_id = elem.image_id;
            elemObj.image.url = `https://cdn2.thecatapi.com/images/${elem.image_id}.jpg`;
            newData.push(elemObj);
        })
        return newData;
    },
    _IdFromUrl: function (url) {
        let id = url.split('/')
        id = id[id.length - 1].split('.')[0]
        return id;
    },
    _clearGrit: function (pageName = this.activeName) {
        this.gridsCollection[pageName] = false;
        document.querySelector(`${pageName}-page .grid-wraper`).innerHTML = '';
    },
};

let userData = {
    likes: [],
    favourites: {},
    dislikes: [],
    logs: [],
    newAction: function (target, type) {
        if (target.parentElement.classList[0] === 'voting-tools') {
            if (type === 'like') {
                if (pageTool.votingPageSettings.imgId) {
                    pageTool.gridsCollection[`${type}s`] = false;
                    let id = pageTool.votingPageSettings.imgId;
                    this._newLog(type);
                    this._showLogs();
                    pageTool.votingPageSettings.imgId = '';
                    requestTool.postLikeOrNot(id, type)
                    pageTool.showImg()
                } else {
                    return;
                }
            }
            if (type === 'favourite') {
                if (pageTool.votingPageSettings.imgId) {
                    pageTool.gridsCollection[`${type}s`] = false;
                    let id = pageTool.votingPageSettings.imgId;
                    this._newLog(type);
                    this._showLogs();
                    pageTool.votingPageSettings.imgId = '';
                    requestTool.postFavourite(id)
                    pageTool.showImg()
                } else {
                    return;
                }
            }
            if (type === 'dislike') {
                if (pageTool.votingPageSettings.imgId) {
                    pageTool.gridsCollection[`${type}s`] = false;
                    let id = pageTool.votingPageSettings.imgId;
                    this._newLog(type);
                    this._showLogs();
                    pageTool.votingPageSettings.imgId = '';
                    requestTool.postLikeOrNot(id)
                    pageTool.showImg()
                } else {
                    return;
                }
            }
        }
    },
    _newLog: function (type, imgId = pageTool.votingPageSettings.imgId) {
        let newLog = {};
        newLog.date = new Date;
        newLog.type = type;
        newLog.id = pageTool.votingPageSettings.imgId;
        userData.logs.push(newLog);
    },
    _showLogs: function () {
        if (pageTool.otherPages.includes(pageTool.activeName)) {
            this.logs.forEach((elem) => {
                let logsListDom = document.querySelector(`.${pageTool.activeName}-page .log-list`);
                let time = this._createTime(elem.date);
                let text = `Image ID: <b>${elem.id}</b> was added to ${elem.type}s`
                let logDom = document.createElement('div');
                logDom.classList.add('log');
                logDom.innerHTML = `<div>${time}</div><div>${text}</div><div class="log-logo-${elem.type}"></div>`;
                logsListDom.prepend(logDom);
            });
            this.logs = [];
        } else {
            this.logs.forEach((elem) => {
                let logsListDom = document.querySelector(`.${pageTool.activeName}-page .log-list`);
                let time = this._createTime(elem.date);
                let text = `Image ID: <b>${elem.id}</b> was removed from ${elem.type}`
                let logDom = document.createElement('div');
                logDom.classList.add('log');
                logDom.innerHTML = `<div>${time}</div><div>${text}</div><div class="log-logo-${elem.type}"></div>`;
                logsListDom.prepend(logDom);
            });
            this.logs = [];
        }
    },
    _createTime: function (date) {
        let hours = date.getHours();
        hours = String(hours)
        hours.length === 1 ? hours = `0${hours}` : hours = hours;
        let minutes = date.getMinutes();
        minutes = String(minutes)
        minutes.length === 1 ? minutes = `0${minutes}` : minutes = minutes;
        return `${hours}:${minutes}`;
    },
}

let requestTool = {
    api: '612199da-1a7c-480a-be2b-0e3c6ef1f518',
    users: {
        noUser: '',
        user1: 'patrichia',
        user2: '123123asdasdxxxz',
    },
    order: ['RANDOM', 'Asc', 'Desc'],
    url: `https://api.thecatapi.com/v1/images/search?limit=10&order=RANDOM`,
    getAllBreeds: async function () {
        let response = await fetch(`https://api.thecatapi.com/v1/breeds`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            this.data = await response.json();
            return this.data
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    getRequest: async function (pageName = pageTool.activeName, idBreed = pageTool.breedsPageSettings.idBreedSelected, limit = pageTool.breedsPageSettings.limit, order = pageTool.breedsPageSettings.sort, type = 'jpg') {
        if (pageName) {
            pageTool._enableLoader(pageName);
        }
        let url;
        if (type === 'gif') {
            url = `https://api.thecatapi.com/v1/images/search?breed_id=${idBreed}&limit=${limit}&order=${order}&mime_types=${type}&size=small`
        } else {
            url = `https://api.thecatapi.com/v1/images/search?breed_id=${idBreed}&limit=${limit}&order=${order}&has_breeds=true&mime_types=${type}&size=small`
        }
        let response = await fetch(url, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            let data = await response.json();
            return data
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    getSearchRequest: async function (value) {
        document.querySelector('.search-page .grid-wraper').innerHTML = '';
        let response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${value}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            let data = await response.json();
            return data
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    getId: async function (id) {
        let response = await fetch(`https://api.thecatapi.com/v1/images/${id}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    getLikes: async function () {
        pageTool._enableLoader('likes');
        pageTool._enableLoader('dislikes');
        document.querySelector('.likes-page .log-list').innerHTML = '';
        document.querySelector('.dislikes-page .log-list').innerHTML = '';
        let response = await fetch(`https://api.thecatapi.com/v1/votes?sub_id=${this.users.user1}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            userData.favourites = await response.json();
            return userData.favourites
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    getFavourites: async function () {
        pageTool._enableLoader('favourites');
        document.querySelector('.favourites-page .log-list').innerHTML = '';
        let response = await fetch(`https://api.thecatapi.com/v1/favourites?sub_id=${this.users.user1}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            let data = await response.json();
            data.forEach(elem => {
                userData.favourites[elem.image_id] = elem.id;
            });
            return data;
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    postLikeOrNot: async function (id, like) {
        let data = {};
        data.sub_id = this.users.user1;
        data.image_id = id;
        like === 'like' ? data.value = 1 : data.value = 0;
        data = JSON.stringify(data);
        await fetch(`https://api.thecatapi.com/v1/votes`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api,
            },
            body: data,
        });
    },
    postFavourite: async function (id) {
        let data = {};
        data.sub_id = this.users.user1;
        data.image_id = id;
        data = JSON.stringify(data);
        await fetch(`https://api.thecatapi.com/v1/favourites`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api,
            },
            body: data,
        });
    },
    deleteLikeFavouritesDislike: async function (id, type, imgId) {
        if (type === 'likes' || type === 'dislikes') {
            type = 'votes'
        }
        if (type === 'favourites') {
            userData.favourites[imgId] = 0;
        }
        let response = await fetch(`https://api.thecatapi.com/v1/${type}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api,
            },
        });
        if (response.ok) {
        } else {
            let data = await response.json();
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
}




pageTool.showImg();

requestTool.getAllBreeds()
    .then(data => {
        pageTool._createBreedsList(data)
    })
    .then(() => {
        document.querySelector('.breeds-page .breed-select').addEventListener('change', (e) => {
            pageTool.breedsPageSettings.idBreedSelected = e.target.value;
            requestTool.getRequest()
                .then(data => pageTool.createGrid(data))
        });
        document.querySelectorAll('.gallery-page select').forEach(element => {
            element.addEventListener('change', (e) => {
                if (e.target.parentElement.classList.value === 'order') {
                    pageTool.galleryPageSettings.sort = e.target.value;
                    return;
                }
                if (e.target.parentElement.classList.value === 'type') {
                    e.target.value === 'Static' || e.target.value === 'All' ? pageTool.galleryPageSettings.type = 'jpg' : pageTool.galleryPageSettings.type = 'gif';
                    return;
                }
                if (e.target.classList.value === 'breed-select') {
                    pageTool.galleryPageSettings.idBreedSelected = e.target.value;
                    return;
                }
                if (e.target.parentElement.classList.value === 'limit') {
                    pageTool.galleryPageSettings.limit = e.target.value.split(' ')[0];
                    return;
                }
            });
        });
    });

requestTool.getRequest('breeds')
    .then(data => {
        pageTool.createGrid(data, 'breeds');
    });

requestTool.getFavourites()
    .then(data => {
        if (data.length > 0) {
            pageTool.createGrid(data, 'favourites')
        }
        pageTool._disableLoader('favourites')
        requestTool.getRequest('gallery')
            .then(data => {
                pageTool.createGrid(data, 'gallery');
            });
    });

document.querySelector('.limit').addEventListener('change', (e) => {
    let limit = e.target.value.split(' ')[1];
    pageTool.breedsPageSettings.limit = limit;
    requestTool.getRequest()
        .then(data => {
            pageTool.createGrid(data);
        });
});

pageTool.breedsPageSettings.sortAscDom = document.querySelector('.Asc')
pageTool.breedsPageSettings.sortAscDom.addEventListener('click', () => {
    if (pageTool.breedsPageSettings.sort === 'Asc') {
        pageTool.breedsPageSettings.sort = 'Random';
        pageTool.breedsPageSettings.sortAscDom.classList.remove('sort1-active')
        requestTool.getRequest()
            .then(data => {
                pageTool.createGrid(data)
            });
    } else {
        pageTool.breedsPageSettings.sort = 'Asc';
        pageTool.breedsPageSettings.sortAscDom.classList.add('sort1-active')
        pageTool.breedsPageSettings.sortDescDom.classList.remove('sort2-active')
        requestTool.getRequest()
            .then(data => {
                pageTool.createGrid(data)
            });
    }
});

pageTool.breedsPageSettings.sortDescDom = document.querySelector('.Desc')
pageTool.breedsPageSettings.sortDescDom.addEventListener('click', () => {
    if (pageTool.breedsPageSettings.sort === 'Desc') {
        pageTool.breedsPageSettings.sort = 'Random';
        pageTool.breedsPageSettings.sortDescDom.classList.remove('sort2-active')
        requestTool.getRequest()
            .then(data => {
                pageTool.createGrid(data)
            });
    } else {
        pageTool.breedsPageSettings.sort = 'Desc';
        pageTool.breedsPageSettings.sortDescDom.classList.add('sort2-active')
        pageTool.breedsPageSettings.sortAscDom.classList.remove('sort1-active')
        requestTool.getRequest()
            .then(data => {
                pageTool.createGrid(data)
            });
    }
});

document.querySelectorAll('.likes').forEach(buttonLike => {
    buttonLike.addEventListener('click', () => {
        pageTool.openPage('likes')
        if (pageTool.gridsCollection.likes) {
            return;
        } else {
            requestTool.getLikes()
                .then(data => {
                    if(data.length > 0) {
                        pageTool.createGrid(data)
                    }
                    pageTool._disableLoader('likes')
                    pageTool._disableLoader('dislikes')
                });
        }
    });
});

document.querySelectorAll('.dislikes').forEach(buttonDislike => {
    buttonDislike.addEventListener('click', () => {
        pageTool.openPage('dislikes')
        if (pageTool.gridsCollection.dislikes) {
            return;
        } else {
            requestTool.getLikes()
                .then(data => {
                    if(data.length > 0) {
                        pageTool.createGrid(data)
                    }
                    pageTool._disableLoader('likes')
                    pageTool._disableLoader('dislikes')
                });
        }
    });
});

document.querySelectorAll('.favourites').forEach(buttonFavourites => {
    buttonFavourites.addEventListener('click', () => {
        pageTool.openPage('favourites')
        if (pageTool.gridsCollection.favourites) {
            return;
        } else {
            requestTool.getFavourites()
                .then(data => {
                    if(data.length > 0) {
                        pageTool.createGrid(data)
                    }
                    pageTool._disableLoader('favourites')
                });
        }
    });
});

document.querySelector('.voting-tools').addEventListener('click', (e) => {
    let type = e.target.classList[0].split('-')[1]
    userData.newAction(e.target, type)
})

document.querySelectorAll('.nav').forEach((navigationElement) => {
    navigationElement.addEventListener('mouseover', () => {
        navigationElement.classList.add('hover-nav')
        navigationElement.lastElementChild.classList.add('hover-names')
    })
    navigationElement.addEventListener('mouseout', () => {
        navigationElement.classList.remove('hover-nav')
        navigationElement.lastElementChild.classList.remove('hover-names')
    })
    navigationElement.addEventListener('click', () => {
        let namePage = navigationElement.classList[1].split('-')[0]
        pageTool.openPage(namePage);
    })
})
document.querySelectorAll('.buttons').forEach((likesNavigationPanel) => {
    likesNavigationPanel.addEventListener('click', (e) => {
        pageTool.openPage(e.target)
    })
})
document.querySelectorAll('.back').forEach((backButton) => {
    backButton.addEventListener('click', () => {
        pageTool.openPage('main');
    })
})

document.querySelectorAll('.next-previous').forEach(elem => {
    elem.addEventListener('click', (e) => {
        let imgDom = document.querySelector('.selected');
        if (e.target.classList.value === 'next') {
            if (imgDom.nextElementSibling) {
                imgDom.classList.remove('selected')
                imgDom.classList.remove('block')
                imgDom.classList.add('none')
                imgDom.nextElementSibling.classList.remove('none')
                imgDom.nextElementSibling.classList.add('block')
                imgDom.nextElementSibling.classList.add('selected')
            } else {
                return;
            }
        } else {
            if (imgDom.previousElementSibling.src) {
                imgDom.classList.remove('selected')
                imgDom.classList.remove('block')
                imgDom.classList.add('none')
                imgDom.previousElementSibling.classList.remove('none')
                imgDom.previousElementSibling.classList.add('block')
                imgDom.previousElementSibling.classList.add('selected')
            } else {
                return;
            }
        }
    });
});

document.querySelectorAll('.searchbar input').forEach(element => {
    element.addEventListener('search', (e) => {
        let searchValue = e.target.value;
        requestTool.getSearchRequest(searchValue)
            .then(data => {
                if (data.length > 0) {
                    let idBreed = data[0].id;
                    requestTool.getRequest('search', idBreed)
                        .then(data => {
                            pageTool.openPage('search');
                            document.querySelector('.search-page .searchbar input').value = searchValue
                            document.querySelector('.search-page .search-results').innerHTML = `Search results for: <b>${searchValue}</b>`
                            pageTool.createGrid(data)
                        });
                } else {
                    pageTool.openPage('search');
                    document.querySelector('.search-page .searchbar input').value = searchValue
                    document.querySelector('.search-page .search-results').innerHTML = `No item found`
                }
            });
        e.target.value = '';
    });
});

document.querySelectorAll('.searchbar .search').forEach(element => {
    element.addEventListener('click', (e) => {
        let searchValue = e.target.previousElementSibling.value;
        requestTool.getSearchRequest(searchValue)
            .then(data => {
                if (data.length > 0) {
                    let idBreed = data[0].id;
                    requestTool.getRequest('search', idBreed)
                        .then(data => {
                            pageTool.openPage('search');
                            document.querySelector('.search-page .searchbar input').value = searchValue
                            document.querySelector('.search-page .search-results').innerHTML = `Search results for: <b>${searchValue}</b>`
                            pageTool.createGrid(data)
                        });
                } else {
                    pageTool.openPage('search');
                    document.querySelector('.search-page .searchbar input').value = searchValue
                    document.querySelector('.search-page .search-results').innerHTML = `No item found`
                }
            });
        e.target.previousElementSibling.value = '';
    });
});

document.querySelector('.gallery-page .update').addEventListener('click', () => {
    requestTool.getRequest(pageTool.activeName, pageTool.galleryPageSettings.idBreedSelected, pageTool.galleryPageSettings.limit, pageTool.galleryPageSettings.sort, pageTool.galleryPageSettings.type)
        .then(data => {
            pageTool.createGrid(data)
        })
});