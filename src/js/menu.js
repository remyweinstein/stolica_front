(function(S) {
    const Menu = function() {
        const events = {};
        const burgerButton = S('.header_menu_panel__burger');
        const burgerIcon = S('.burger', burgerButton);
        const burgerMenu = S('ul', burgerButton);
        const burgerMenuLink = S('ul > li', burgerMenu);
        const headerMenuLinks = S('.header_menu_panel__list > li');
        const headerSubMenu = S('.header_menu_panel__list .sub_menu');

        const getSubMenu = (elem) => {
            if (!elem) return headerSubMenu;
            let ir = 0;

            headerMenuLinks.els.forEach((el, i) => { 
                if (el===elem) {
                    ir = i;
                }
            });

            return S(headerSubMenu.els[ir]);
        }

        const isOpenBurgerMenu = () => {
            return burgerMenu.css('display');
        }

        const toggleMenuBurger = () => {
            const clicked =  burgerMenu.css('display');
            const disp = '';

            burgerMenuLink.delclass('active');

            if (!clicked) {
                headerMenuLinks.delclass('active');
                burgerMenu.css('display', 'block');
                burgerIcon.addclass('active');
                getSubMenu().css('display', disp);
                S(getSubMenu().els[0]).addclass('forburger');
                S(burgerMenuLink.els[0]).addclass('active');
            } else {
                disableMenuBurger();
            }
        }

        const openMenu = (elem) => {
            disableMenuBurger();
            S(elem).addclass('active');
            getSubMenu(elem).css('display', 'block');
        }

        const disableMenuBurger = () => {
            const disp = '';
            headerMenuLinks.delclass('active');
            burgerIcon.delclass('active');
            getSubMenu().delclass('forburger');
            getSubMenu().css('display', disp);
            burgerMenu.css('display', disp);
            clearTimeout(events.timerDisableBurgerMenu);
        }

        const startTimerDisableBurgerMenu = () => {
            clearTimeout(events.timerDisableBurgerMenu);
            events.timerDisableBurgerMenu = setTimeout(disableMenuBurger, 500);
        }

        const init = () => {
            burgerMenu.bind('mouseleave', () => { 
                startTimerDisableBurgerMenu()
            });

            headerSubMenu.bind('mouseleave', () => {
                startTimerDisableBurgerMenu()
            });

            burgerMenuLink.bind('click', (e) => {
                if (!isOpenBurgerMenu()) return;

                const elem = e.currentTarget;
                let ir = 0;

                burgerMenuLink.els.forEach((el, i) => { 
                    if (el===elem) {
                        ir = i;
                    }
                });

                burgerMenuLink.delclass('active');
                getSubMenu().delclass('forburger');
                S(elem).addclass('active');
                S(getSubMenu().els[ir]).addclass('forburger');
            });

            burgerMenu.bind('mouseenter', () => {
                clearTimeout(events.timerDisableBurgerMenu)
            });

            headerSubMenu.bind('mouseenter', () => {
                clearTimeout(events.timerDisableBurgerMenu)
            });

            burgerButton.bind('click', (e) => {
                toggleMenuBurger(e.currentTarget);
            });

            headerMenuLinks.bind('click', (e) => {
                openMenu(e.currentTarget);
            });

            headerSubMenu.bind('click', (e) => {
                e.stopPropagation();
            });

            burgerMenu.bind('click', (e) => {
                e.stopPropagation();
            });
        }

        return init();
    };

    new Menu();
})(S);