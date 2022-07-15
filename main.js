let pageTool = {
    activeName: '',
    activeDom: null,
    pageOpened: 'main',
    otherPages: ['voting', 'breeds', 'gallery'],
    likesPages: ['likes', 'favorite', 'dislikes'],
    orderImgURL: 1,
    gridsCollection: {},
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
        sortAscDom: null,
        sortDescDom: null,
        breedsList: {},
        breedsListDom: null,
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
    _createBreedsList: function (data) {
        let breedsList = [];
        data.forEach(elem => {
            let obj = {};
            this.breedsPageSettings.breedsList[elem.name] = elem.id;
            obj.id = elem.id;
            obj.name = elem.name;
            breedsList.push(obj);
        });
        breedsList = breedsList.sort();
        let breedSelectDom = document.querySelector('.breeds .breed-select')
        this.breedsPageSettings.breedsListDom = breedSelectDom;
        breedsList.forEach(elem => {
            option = document.createElement('option')
            option.classList.add(elem.id);
            option.textContent = elem.name;
            breedSelectDom.append(option);
        });
    },
    createGrid: function (data, pageName = this.activeName) {
        this.gridsCollection[pageName] = true;
        let gridDomWrapper;
        if (pageName === 'favorite') {
            this._createGridFavorite(data)
        }
        if (pageName === 'likes') {
            this._createLikesDislikesData(data, 'likes')
        }
        if (pageName === 'dislikes') {
            this._createLikesDislikesData(data, 'dislikes')
        }
        if (this.otherPages.includes(pageName) && pageName !== 'voting') {
            gridDomWrapper = document.querySelector(`.${pageName} .grid-wraper`);
            gridDomWrapper.innerHTML = '';
            while (data.length > 10) {
                let gridDiv = document.createElement('div')
                gridDiv.classList.add('grid')
                let newData = data.splice(0, 10)
                newData.forEach(elem => {
                    let url = elem.url
                    let div = document.createElement('div');
                    let img = document.createElement('img');
                    img.src = url;
                    div.append(img);
                    gridDiv.append(div)
                })
                gridDomWrapper.append(gridDiv);
            }
            let gridDiv = document.createElement('div')
            gridDiv.classList.add('grid')
            data.forEach(elem => {
                let url = elem.url
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.src = url;
                div.append(img);
                gridDiv.append(div)
            })
            gridDomWrapper.append(gridDiv);
        }
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
            this._createGridFavorite(likes, 'likes');
        }
        if (dislikes.length > 0) {
            dislikes = this._convertData(dislikes);
            this._createGridFavorite(dislikes, 'dislikes')
        }
    },
    _createGridFavorite: function (data, pageName = this.activeName) {
        let gridDomWrapper = document.querySelector(`.${pageName}-page .grid-wraper`);
        gridDomWrapper.innerHTML = '';
        while (data.length > 10) {
            let gridDiv = document.createElement('div')
            gridDiv.classList.add('grid')
            let newData = data.splice(0, 10)
            newData.forEach(elem => {
                let url = elem.image.url
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.classList.add(`${elem.id}`)
                img.src = url;
                div.append(img);
                let deleteButton = document.createElement('div')
                deleteButton.classList.add('button-hover')
                deleteButton.addEventListener('click', (e) => {
                    let id = e.target.previousSibling.classList[0]
                    let imgId = e.target.previousSibling.classList[1]
                    requestTool.deleteLikeFavoriteDislike(id, pageName);
                    userData._newLog(pageName, imgId);
                    userData._showLogs()
                    e.target.parentElement.remove()
                });
                div.append(deleteButton);
                gridDiv.append(div)
            })
            gridDomWrapper.append(gridDiv);
        }
        let gridDiv = document.createElement('div')
        gridDiv.classList.add('grid')
        data.forEach(elem => {
            let url = elem.image.url
            let div = document.createElement('div');
            let img = document.createElement('img');
            img.classList.add(`${elem.id}`)
            img.classList.add(`${elem.image_id}`)
            img.src = url;
            div.append(img);
            let deleteButton = document.createElement('div')
            deleteButton.classList.add('button-hover')
            deleteButton.addEventListener('click', (e) => {
                let id = e.target.previousSibling.classList[0]
                let imgId = e.target.previousSibling.classList[1]
                requestTool.deleteLikeFavoriteDislike(id, pageName);
                userData._newLog(pageName, imgId);
                userData._showLogs()
                e.target.parentElement.remove()
            });
            div.append(deleteButton);
            gridDiv.append(div)
        })
        gridDomWrapper.append(gridDiv);
        this.gridsCollection[pageName] = true;
    },
    showImg: function () {
        if (this.votingPageSettings.imgDom) {
            this.votingPageSettings.loaderDom.classList.add('block')
            this.votingPageSettings.loaderDom.classList.remove('none')
            requestTool.getRequest(1, 'Random')
                .then(data => {
                    this.votingPageSettings.imgShowingUrl = data[0].url;
                    this.votingPageSettings.imgDom.src = data[0].url;
                    this.votingPageSettings.loaderDom.classList.add('block')
                    this.votingPageSettings.loaderDom.classList.remove('none')
                    this.votingPageSettings.imgDom.addEventListener('load', (e) => {
                        this.votingPageSettings.loaderDom.classList.add('none')
                        this.votingPageSettings.loaderDom.classList.remove('block')
                        this.votingPageSettings.imgId = data[0].id;
                    });
                });
        } else {
            this.votingPageSettings.imgDom = document.querySelector('.img-voting img');
            this.votingPageSettings.loaderDom = document.querySelector('.voting .loader')
            this.votingPageSettings.loaderDom.classList.add('block')
            this.votingPageSettings.loaderDom.classList.remove('none')
            requestTool.getRequest(1, 'Random')
                .then(data => {
                    this.votingPageSettings.imgShowingUrl = data[0].url;
                    this.votingPageSettings.imgDom.src = data[0].url;
                    this.votingPageSettings.imgDom.addEventListener('load', (e) => {
                        this.votingPageSettings.loaderDom.classList.add('none')
                        this.votingPageSettings.loaderDom.classList.remove('block')
                        this.votingPageSettings.imgId = data[0].id;
                    });
                });
        }
    },
    openPage: function (target) {
        if (typeof target === 'object') {
            if (this.activeDom === target) {
                return;
            }
            if (target.classList[0] === 'buttons') {
                return;
            }
            if (this.otherPages.includes(target.classList[1].split('-')[0])) {
                this._defaultActive();
                this.activeName = target.classList[1].split('-')[0];
                this.activeDom = target;
                this.pageOpened = document.querySelector(`.${this.activeName}`);
                this._enable(this.pageOpened);
                this._disable(document.querySelector('.main'));
                this.activeDom.classList.add('active-nav');
                this.activeDom.lastElementChild.classList.add('active-names');
                return;
            }
            if (this.likesPages.includes(target.classList[1])) {
                this._defaultActive();
                this.activeName = target.classList[1];
                this.activeDom = target;
                this.pageOpened = document.querySelector(`.${this.activeName}-page`);
                this._enable(this.pageOpened);
                this.activeDom = document.querySelector(`.${this.activeName}-page .${this.activeName}`)
                this.activeDom.classList.add(`active-${this.activeName}`);
                this.activeDom.classList.remove(`button`);
                return;
            }
        } else {
            if (target == 'main') {
                this._defaultActive();
                this._openMain();
                return;
            }
        }
        return;
    },
    _defaultActive: function () {
        if (this.otherPages.includes(this.activeName)) {
            this.activeDom.classList.remove('active-nav');
            this.activeDom.lastElementChild.classList.remove('active-names');
            this._disable(this.pageOpened);
            this.activeName = '';
            this.activeDom = null;
            return;
        }
        if (this.likesPages.includes(this.activeName)) {
            this.activeDom.classList.remove(`active-${this.activeName}`);
            this.activeDom.classList.add(`button`);
            this._disable(this.pageOpened);
            this.activeName = '';
            this.activeDom = null;
            return;
        }
    },
    _openMain: function () {
        this.pageOpened = document.querySelector(`.main`)
        this._enable(this.pageOpened);
    },
    _enable: function (page) {
        page.classList.add('block');
        page.classList.remove('none');
    },
    _disable: function (page) {
        page.classList.add('none');
        page.classList.remove('block');
    },
};

let userData = {
    likes: [],
    favorite: null,
    dislikes: [],
    logs: [],
    newAction: function (target, type) {
        if (target.parentElement.classList[0] === 'voting-tools') {
            if (type === 'like') {
                if (pageTool.votingPageSettings.imgId) {
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
            if (type === 'favorite') {
                if (pageTool.votingPageSettings.imgId) {
                    let id = pageTool.votingPageSettings.imgId;
                    this._newLog(type);
                    this._showLogs();
                    pageTool.votingPageSettings.imgId = '';
                    requestTool.postFavorite(id)
                    pageTool.showImg()
                } else {
                    return;
                }
            }
            if (type === 'dislike') {
                if (pageTool.votingPageSettings.imgId) {
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
                let logsListDom = document.querySelector(`.${pageTool.activeName} .log-list`);
                let time = this._createTime(elem.date);
                let text = `Image ID: <b>${elem.id}</b> was added to ${elem.type}s`
                let logDom = document.createElement('div');
                logDom.classList.add('log');
                logDom.innerHTML = `<div>${time}</div><div>${text}</div><div class="log-logo-${elem.type}"></div>`;
                logsListDom.append(logDom);
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
                logsListDom.append(logDom);
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
    data: null,
    api: '612199da-1a7c-480a-be2b-0e3c6ef1f518',
    users: {
        noUser: '',
        user1: 'patrichia',
        user2: '123123asdasdxxxz',
    },
    order: ['RANDOM', 'Asc', 'Desc'],
    url: `https://api.thecatapi.com/v1/images/search?limit=10&order=RANDOM`,
    getRequest: async function (limit = 10, order = 'RANDOM') {
        let response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&order=${order}&size=small&has_breeds=true?mime_types=jpg`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            this.data = await response.json();
            if (limit == 1) {
                pageTool.votingPageSettings.imgId = this.data[0].id;
            }
            return this.data
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
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
    getBreedRequest: async function (id) {
        let response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${id}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            this.data = await response.json();
            console.log(this.data)
            return this.data
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
        let response = await fetch(`https://api.thecatapi.com/v1/votes?sub_id=${this.users.user1}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            userData.favorite = await response.json();
            return userData.favorite
        } else {
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
    getFavorite: async function () {
        let response = await fetch(`https://api.thecatapi.com/v1/favourites?sub_id=${this.users.user1}`, {
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api
            },
        });
        if (response.ok) {
            userData.favorite = await response.json();
            return userData.favorite
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
    postFavorite: async function (id) {
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
    deleteLikeFavoriteDislike: async function (id, type) {
        if (type === 'likes' || type === 'dislikes') {
            type = 'vote'
        }
        let response = await fetch(`https://api.thecatapi.com/v1/${type}s/${id}`, {
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
        pageTool.breedsPageSettings.breedsListDom.addEventListener('change', (e) => {
            let idBreed = pageTool.breedsPageSettings.breedsList[e.target.value];
            requestTool.getBreedRequest(idBreed);
        });
    });

requestTool.getRequest(pageTool.breedsPageSettings.limit, pageTool.breedsPageSettings.sort)
    .then(data => {
        pageTool.createGrid(data, 'breeds');
        pageTool.createGrid(data, 'gallery');
    });

document.querySelector('.limit').addEventListener('change', (e) => {
    let limit = e.target.value.split(' ')[1];
    pageTool.breedsPageSettings.limit = limit;
    requestTool.getRequest(limit, pageTool.breedsPageSettings.sort)
        .then(data => {
            pageTool.createGrid(data);
        });
});

pageTool.breedsPageSettings.sortAscDom = document.querySelector('.Asc')
pageTool.breedsPageSettings.sortAscDom.addEventListener('click', () => {
    if (pageTool.breedsPageSettings.sort === 'Asc') {
        pageTool.breedsPageSettings.sort = 'Random';
        pageTool.breedsPageSettings.sortAscDom.classList.remove('sort1-active')
        requestTool.getRequest(pageTool.breedsPageSettings.limit, pageTool.breedsPageSettings.sort)
            .then(data => {
                pageTool.createGrid(data)
            });
    } else {
        pageTool.breedsPageSettings.sort = 'Asc';
        pageTool.breedsPageSettings.sortAscDom.classList.add('sort1-active')
        pageTool.breedsPageSettings.sortDescDom.classList.remove('sort2-active')
        requestTool.getRequest(pageTool.breedsPageSettings.limit, 'Asc')
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
        requestTool.getRequest(pageTool.breedsPageSettings.limit, pageTool.breedsPageSettings.sort)
            .then(data => {
                pageTool.createGrid(data)
            });
    } else {
        pageTool.breedsPageSettings.sort = 'Desc';
        pageTool.breedsPageSettings.sortDescDom.classList.add('sort2-active')
        pageTool.breedsPageSettings.sortAscDom.classList.remove('sort1-active')
        requestTool.getRequest(pageTool.breedsPageSettings.limit, 'Desc')
            .then(data => {
                pageTool.createGrid(data)
            });
    }
});

document.querySelectorAll('.likes').forEach(buttonLike => {
    buttonLike.addEventListener('click', () => {
        requestTool.getLikes()
            .then(data => {
                pageTool.createGrid(data)
            });
    });
});

document.querySelectorAll('.dislikes').forEach(buttonDislike => {
    buttonDislike.addEventListener('click', () => {
        requestTool.getLikes()
            .then(data => {
                pageTool.createGrid(data)
            });
    });
});

document.querySelectorAll('.favorite').forEach(buttonFavorite => {
    buttonFavorite.addEventListener('click', () => {
        requestTool.getFavorite()
            .then(data => {
                pageTool.createGrid(data)
            });
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
        pageTool.openPage(navigationElement);
        // if (pageTool.activeName === 'breeds' || pageTool.activeName === 'gallery') {
        //     requestTool.getRequest(10, 'Random')
        //         .then(data => {
        //             pageTool.createGrid(data);
        //         });
        // }
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


