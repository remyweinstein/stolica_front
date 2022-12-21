(function(S, Stores) {
    const Instock = function() {
        const button = S('.header_search_panel__store');
        const citiesBlock = S('.instock_stores__cities');
        const storesBlock = S('.instock_stores__stores_list');
        const citiesUl = S('ul', citiesBlock);
        const storesUl = S('ul', storesBlock);
        const overlay = S('.overlay');
        const buttonSelect = S('#select_store');
        const buttonClose = S('#close_store');
        this.ObjectManager;
        this.store_id = 1;

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

        const getListStores = (cityId) => {
            return Stores.filter(el => el.id == cityId);
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

            renderStores(1);
        }

        const renderStores = (cityId) => {
            storesUl.html(' ');
            S('#map').html(' ');
            getListStores(cityId).forEach(city => {
                const {rsa_id, store_title} = city;
                const address = `${store_title.split(",")[1]}, ${store_title.split(",")[2]}`;
                const el = S().strToNode(`<li data-id="${rsa_id}">${address}</li>`);
                el.bind('click', clickStore);
                storesUl.append(el);
            });
            initMap(cityId);
        }

        const clickStore = (e) => {
            openBalloon(e.currentTarget.dataset.id);
        }

        const selectCity = (e) => {
            renderStores(e.currentTarget.dataset.id);
        }

        const clickOnMap = (e) => {
            this.store_id = e.currentTarget.dataset.id;
            selectStore();

        }

        const selectStore = () => {
            localStorage.setItem('current_store', this.store_id);
            closeStores();
        }

        ymaps.ready(function(){});

        const initMap = (cityId) => {
            const stores = getListStores(cityId);
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
                        balloonContent: `<p>${store.store_title}</p><button class="button selected" class="select_from_map" data-id="${store.rsa_id}">Выбрать</button>`,
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

        const init = () => {
            button.bind('click', openStores);
            overlay.bind('click', closeStores);
            buttonSelect.bind('click', selectStore);
            buttonClose.bind('click', closeStores);
            S('.select_from_map').on('click', document, clickOnMap);

            S('.instock_stores').bind('click', (e) => {
                e.stopPropagation();
            });
        }

        return init();
    }

    new Instock();  
  })(S, Stores);
