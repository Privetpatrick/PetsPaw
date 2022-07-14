let imgPlace = document.querySelector('.img-voting img');
let pageTool = {
    activeName: '',
    activeDom: null,
    pageOpened: 'main',
    otherPages: ['voting', 'breeds', 'gallery'],
    likesPages: ['likes', 'favorite', 'dislikes'],
    imgShowing: '',
    orderImg: 1,
    gridsCollection: {},
    creatGrid: function (data) {
        if (this.gridsCollection[this.activeName]) {
            return;
        }
        let gridDom;
        if (this.likesPages.includes(this.activeName)) {
            gridDom = document.querySelector(`.${this.activeName}-page .grid`);
            gridDom.innerHTML = '';
            while (data.length > 10) {
                let newData = data.splice(0, 10)
                newData.forEach(elem => {
                    let url = elem.image.url
                    let div = document.createElement('div');
                    let img = document.createElement('img');
                    img.src = url;
                    div.append(img);
                    let deleteButton = document.createElement('div')
                    deleteButton.classList.add('delete')
                    deleteButton.classList.add('none')
                    deleteButton.addEventListener('click', (e) => {
                        let id = e.target.previousSibling.src.split('/')
                        id = id[id.length - 1].split('.')[0]
                        // requestTool.deleteFavorite(id);
                        e.target.previousSibling.remove()
                    });
                    div.append(deleteButton);
                    img.addEventListener('mouseover', (e) => {
                        e.target.nextSibling.classList.add('block')
                        e.target.nextSibling.classList.remove('none')
                    });
                    img.addEventListener('mouseout', (e) => {
                        e.target.nextSibling.classList.add('none')
                        e.target.nextSibling.classList.remove('block')
                    });
                    gridDom.append(div);
                })
            }
            data.forEach(elem => {
                let url = elem.image.url
                let div = document.createElement('div');
                div.classList.add('test')
                let img = document.createElement('img');
                img.src = url;
                div.append(img);
                let deleteButton = document.createElement('div')
                deleteButton.classList.add('delete')
                // deleteButton.classList.add('none')
                deleteButton.addEventListener('click', (e) => {
                    let id = e.target.previousSibling.src.split('/')
                    id = id[id.length - 1].split('.')[0]
                    // requestTool.deleteFavorite(id);
                    e.target.previousSibling.remove()
                });
                div.append(deleteButton);
                // div.addEventListener('mouseover', (e) => {
                //     console.log(e.target)
                //     e.target.nextSibling.classList.add('block')
                //     e.target.nextSibling.classList.remove('none')
                // });
                // div.addEventListener('mouseout', (e) => {
                //     e.target.nextSibling.classList.add('none')
                //     e.target.nextSibling.classList.remove('block')
                // });
                gridDom.append(div);
            })
            this.gridsCollection[this.activeName] = true;
        } else {
            gridDom = document.querySelector(`.${this.activeName} .grid`);
            while (data.length > 10) {
                let newData = data.splice(0, 10)
                newData.forEach(elem => {
                    let url = elem.url
                    let div = document.createElement('div');
                    let img = document.createElement('img');
                    img.src = url;
                    div.append(img);
                    gridDom.append(div);
                })
            }
            data.forEach(elem => {
                let url = elem.url
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.src = url;
                div.append(img);
                gridDom.append(div);
            })
            this.gridsCollection[this.activeName] = true;
        }
    },
    showImg: function () {
        if (requestTool.data) {
            imgPlace.src = requestTool.data[0].url;
            pageTool.imgShowing = requestTool.data[0];
        } else {
            requestTool.getRequest(requestTool.url)
                .then(data => {
                    imgPlace.src = requestTool.data[0].url;
                    pageTool.imgShowing = requestTool.data[0];
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
    _showGrid: function (data) {

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
    _nextImg: function () {
        if (this.orderImg < requestTool.data.length) {
            imgPlace.src = requestTool.data[this.orderImg].url;
            this.imgShowing = requestTool.data[this.orderImg]
            this.orderImg++
        } else {
            requestTool.page++
            requestTool.getRequest(requestTool.url, requestTool.limit, requestTool.page)
                .then(data => {
                    this.orderImg = 0;
                    imgPlace.src = requestTool.data[this.orderImg].url;
                    this.imgShowing = requestTool.data[this.orderImg]
                    this.orderImg++
                })
        }
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
                this.likes.push(requestTool.data[pageTool.orderImg - 1]);
                this._newLog(type);
                this._showLogs()
                pageTool._nextImg()
            }
            if (type === 'favorite') {
                let id = {}
                id.image_id = requestTool.data[pageTool.orderImg - 1].id;
                id = JSON.stringify(id)
                requestTool.postFavorite(id)
                pageTool._nextImg()
            }
            if (type === 'dislike') {
                this.dislikes.push(requestTool.data[pageTool.orderImg - 1]);
                this._newLog(type);
                this._showLogs()
                pageTool._nextImg()
            }
        }
    },
    _newLog: function (type) {
        let newLog = {};
        newLog.date = new Date;
        newLog.type = type;
        newLog.id = pageTool.imgShowing.id
        userData.logs.push(newLog);
    },
    _showLogs: function () {
        this.logs.forEach((elem) => {
            let logsListDom = document.querySelector('.log-list');
            let time = this._createTime(elem.date);
            let text = `Image ID: <b>${elem.id}</b> was added to ${elem.type}s`
            let logDom = document.createElement('div');
            logDom.classList.add('log');
            logDom.innerHTML = `<div>${time}</div><div>${text}</div><div class="log-logo-${elem.type}"></div>`;
            logsListDom.append(logDom);
        });
        this.logs = [];
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
    limit: 10,
    page: 100,
    url: `https://api.thecatapi.com/v1/images/search?limit=10&order=Desc&`,
    getRequest: async function (url, limit = 10, page = 120) {
        let response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}&order=Desc&has_breeds=0`, {
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
    getFavorite: async function () {
        let response = await fetch(`https://api.thecatapi.com/v1/favourites/`, {
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
    postFavorite: async function (data) {
        await fetch(`https://api.thecatapi.com/v1/favourites`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api,
            },
            body: data,
        });
    },
    deleteFavorite: async function (id) {
        let response = await fetch(`https://api.thecatapi.com/v1/favourites/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': this.api,
            },
        });
        if (response.ok) {
        } else {
            let data = await response.json();
            console.log(data)
            throw new Error(`GET не сработал этот ERROR`);
        };
    },
}

document.querySelectorAll('.favorite').forEach(buttonFavorite => {
    buttonFavorite.addEventListener('click', () => {
        requestTool.getFavorite()
            .then(data => {
                pageTool.creatGrid(data)
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
        if (pageTool.activeName === 'voting') {
            pageTool.showImg()
        }
        if (pageTool.activeName === 'breeds') {
            if (requestTool.data) {
                pageTool.creatGrid(requestTool.data);
            }
            requestTool.getRequest(requestTool.url)
                .then(data => {
                    pageTool.creatGrid(data);
                });
        }
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

// let imgPlace = document.querySelector('.img-voting img')
// requestTool.getRequest(requestTool.url)
//     .then(data => imgPlace.src = requestTool.data[0].url)



