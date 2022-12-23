const heightMenu = S('.header_top_panel').el.offsetHeight + S('.header_search_panel').el.offsetHeight;
const panel = S('.header_menu_panel');
const submenus = S('.sub_menu');
const butInCart = S('.incart');

S(document).bind('scroll', () => {
    if (window.scrollY > heightMenu) {
        panel.addclass('sticked');
        submenus.addclass('forstick');
    } else {
        panel.delclass('sticked');
        submenus.delclass('forstick');
    }
});

butInCart.bind('click', (e) => {
    const el = e.currentTarget;
    const div = el.children[0];
    const qty = S(div).text();
    if (S(el.parentElement).isclass('cart')) return;
    S(el.parentElement).addclass('cart');
    S(div).html(`<span class="minus">-</span><span class="qty">${qty}</span><span class="plus">+</span>`)
});

S(document).on('click', '.plus', (e, t) => {
    const el = t;
    const parent = S(el.parentElement);
    const qtyEl = S('.qty', parent);
    let qty = qtyEl.text()*1 + 1;
    qtyEl.text(qty);
});

S(document).on('click', '.minus', (e, t) => {
    const el = t;
    const parent = S(el.parentElement);
    const qtyEl = S('.qty', parent);
    let qty = qtyEl.text()*1 - 1;

    if (qty < 1) {
        parent.html(1);
        S(parent.el.parentElement.parentElement).delclass('cart');
    } else {
        qtyEl.text(qty);
    }
});

S('header .cart').bind('click', () => {
    countPricesCart();
    S('.cart_popup').togclass('open');
});

S('.delete_popup_cart').bind('click', (e) => {
    const el = e.currentTarget;
    const icons = S('.actions_button.cart');
    const qty = icons.text()*1 - 1;
    let html = `<span>${qty}</span>`;
    const div = S(el.parentElement.parentElement);
    S().remove(div);

    countPricesCart();

    if (qty == 0) {
        html = '';
        S('.cart_popup').togclass('open');
    }

    S('.actions_button.cart').html(html);
    S('.cart_popup__sum_head span').text(qty);
});

const countPricesCart = () => {
    const prices = {current: 0, old: 0};
    
    S('.cart_popup__product_price > div').els.forEach(el => {
        const price = S(el).text().replace(' ₽', ' ').replace(' ₽', '').split(' ');
        prices.current += parseFloat(price[0]);
        prices.old += parseFloat(price[1]);
    })

    S('.cart_popup__sum_price').text(`${prices.current} ₽`);
    S('.cart_popup__sum_old_price').text(`${prices.old} ₽`);
}

let timerCloseSearch;
const startTimerCloseSearch = () => {
    clearTimeout(timerCloseSearch);
    timerCloseSearch = setTimeout(closeSearch, 500);
}
const closeSearch = () => {
    if (S('.header_menu_panel__actions .search__input input').val()) return;
    S('.actions_button.search').css('visibility', 'visible');
    S('.header_menu_panel__actions .search__input').delclass('active');
}
S('.header_menu_panel .actions_button.search').bind('click', (e) => {
    S(e.currentTarget).css('visibility', 'hidden');
    S('.header_menu_panel__actions .search__input').addclass('active');
});
S('.header_menu_panel__actions .search__input').bind('mouseleave', () => {
    startTimerCloseSearch()
});

S('.header_search_panel .actions_button.search').bind('click', (e) => {
    const input = S('.header_search_panel .search__input');

    if (input.isclass('active')) {
        S('.header_menu_panel').css('marginTop', '0.55em');
        input.delclass('active');
    } else {
        S('.header_menu_panel').css('marginTop', '4em');
        input.addclass('active'); 
    }
});

let current_store = localStorage.getItem('current_store');
if (current_store) {
    const store = Stores.filter(el => el.rsa_id == current_store);
    const address = store[0].store_title.split(',');
    S('.header_search_panel__store .text').text(`${address[1]}, ${address[2]}`);
    S('.header_search_panel__store').addclass('selected');
}