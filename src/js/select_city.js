(function(S, Stores) {
    const SelectStore = function() {
        const button = S('.select_store_button');
        const citiesBlock = S('.instock_stores__cities');
        const storesBlock = S('.instock_stores__stores_list');
        const citiesUl = S('ul', citiesBlock);
        const storesUl = S('ul', storesBlock);
        const overlay = S('.overlay');
        const buttonSelect = S('#select_store');
        const buttonClose = S('#close_store');
        const buttonInstock = S('.instock');
        const input = S('.instock_stores__stores_list .search__input input');
        const city_title = S('.city_title');

        this.ObjectManager;
        this.searchString = '';
        this.isSelectCity = true;
        this.store_id = localStorage.getItem('current_store') || 1;
        this.city_id = localStorage.getItem('current_city') || 1;

        const getListCities = () => {
            return Stores.reduce((acc, item) => {
                const {id, title} = item;

                if (!acc) acc = [];
                if (!acc.filter((el) => el.id == id).length) {
                     return [...acc, {id, title}];
                } else {
                    return acc;
                }
            }, []);
        }

        const getListStores = () => {
            if (!this.searchString) return Stores.filter(el => el.id == this.city_id);

            return Stores.filter(el => (el.store_title.toLowerCase().indexOf(this.searchString.toLowerCase())!==-1 && el.id == this.city_id)); 
        }

        const openStores = () => {
            overlay.css('display', 'grid');
            renderCities();
        }

        const closeStores = () => {
            overlay.css('display', 'none');
            citiesUl.html(' ');
            storesUl.html(' ');
        }

        const renderCities = () => {
            const listCities = getListCities();

            listCities.forEach(city => {
                const {id, title} = city;
                const el = S().strToNode(`<li data-id="${id}">${title}</li>`);
                el.bind('click', selectCity);
                citiesUl.append(el);
            });

            renderStores();
        }

        const renderStores = () => {
            storesUl.html(' ');
            S('#map').html(' ');

            getListStores().forEach(city => {
                const {rsa_id, store_title} = city;
                const address = `${store_title.split(",")[1]}, ${store_title.split(",")[2]}`;
                const el = S().strToNode(`<li data-id="${rsa_id}"${(rsa_id==this.store_id)?' class="active"':''}>${(!this.isSelectCity)?'<span>26 шт.</span>':''}${address}</li>`);
                el.bind('click', clickStore);
                storesUl.append(el);
            });

            initMap();
        }

        const clickStore = (e) => {
            const el = e.currentTarget;
            this.store_id = el.dataset.id;
            openBalloon(el.dataset.id);
            S('li', storesUl).delclass('active');
            S(el).addclass('active');
        }

        const selectCity = (e) => {
            this.city_id = e.currentTarget.dataset.id;
            renderStores();
        }

        const clickOnMap = (t) => {
            this.store_id = t.dataset.id;
            selectStore();
        }

        const selectStore = () => {
            const store = Stores.filter(el => el.rsa_id == this.store_id);
            const address = store[0].store_title.split(',');
            S('.select_store_button .text').text(`${address[1]}, ${address[2]}`);
            S('.select_store_button').addclass('selected');
            S('.city_title').text(store[0].title);
            localStorage.setItem('current_store', this.store_id);
            localStorage.setItem('current_city', this.city_id);
            closeStores();
        }

        const initMap = () => {
            const stores = getListStores();
            const x = parseFloat(stores[0].coordinates.split(',')[0]);
            const y = parseFloat(stores[0].coordinates.split(',')[1]);

            const myMap = new ymaps.Map("map", {
                center: [x, y],
                zoom: (stores.length > 3) ? 12 : 14
            }, {
                suppressMapOpenBlock: true
            });
        
            this.objectManager = new ymaps.ObjectManager({
                clusterize: true,
                gridSize: 32,
                clusterDisableClickZoom: true
            });
        
            this.objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            this.objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

            stores.forEach(store => {
                const x = parseFloat(store.coordinates.split(',')[0]);
                const y = parseFloat(store.coordinates.split(',')[1]);
                this.objectManager.add({
                    type: 'Feature',
                    id: store.rsa_id,
                    geometry: {
                        type: 'Point',
                        coordinates: [x, y]
                    },
                    properties: {
                        hintContent: store.store_title,
                        balloonContent: `<p>${store.store_title}</p><button class="button primary select_from_map" data-id="${store.rsa_id}">Выбрать</button>`,
                    }, 
                    options: {
                        iconLayout: 'default#image',
                        iconImageHref: 'assets/icons/inactive_point.png',
                        iconImageSize: [14, 14],
                        iconImageOffset: [-7, -7]
                    }
                });    
            });

            this.objectManager.objects.events.add('click', function (e) {
                openBalloon(e.get('objectId'));
            });

            myMap.geoObjects.add(this.objectManager);
        }

        const clearIcons = () => {
            this.objectManager.objects.getAll().forEach(el => {
                this.objectManager.objects.setObjectOptions(
                    el.id,
                    {
                        iconImageHref: 'assets/icons/inactive_point.png',
                        iconImageSize: [14, 14],
                        iconImageOffset: [-7, -7]
                    })
            });
        }

        const openBalloon = (objectId) => {
            const objectState = this.objectManager.getObjectState(objectId);
            if (objectState.isClustered) {
                this.objectManager.clusters.state.set('activeObject', this.objectManager.objects.getById(objectId));
                this.objectManager.clusters.balloon.open(objectState.cluster.id);
            } else {
                this.objectManager.objects.balloon.open(objectId);
            }
            clearIcons();
            this.objectManager.objects.setObjectOptions(
                objectId,
                { 
                    iconImageHref: 'assets/icons/active_point.png',
                    iconImageSize: [24, 24],
                    iconImageOffset: [-12, -12]
                }
            );
        }

        const openInstock = () => {
            this.isSelectCity = false;
            S('.instock_stores').addclass('product_instock');
            openStores();
        }

        const openSelect = () => {
            this.isSelectCity = true;
            S('.instock_stores').delclass('product_instock');
            openStores();
        }

        const searchStore = (e) => {
            const el = e.currentTarget;
            this.searchString = el.value;
            renderStores();
        }

        const init = () => {
            ymaps.ready(function(){
                buttonInstock.bind('click', openInstock);
                button.bind('click', openSelect);
                overlay.bind('click', closeStores);
                buttonSelect.bind('click', selectStore);
                buttonClose.bind('click', closeStores);

                S('#map').on('click', '.select_from_map', (e, t) => {
                    clickOnMap(t);
                });

                S('.instock_stores').bind('click', (e) => {
                    e.stopPropagation();
                });

                input.bind('input', searchStore);
            })
        }

        return init();
    }

    new SelectStore();  
  })(S, Stores);
