const S = function (s, p) {
    const d = document;
    this.isS = true;
    this.isNodeList = (nodes) => {
        const stringRepr = Object.prototype.toString.call(nodes);

        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            (typeof nodes.length === 'number') &&
            (nodes.length === 0 || (typeof nodes[0] === 'object' && nodes[0].nodeType > 0));
    };
    this.isNode = (obj) => {
        return obj && obj.nodeType ? true : false;
    };
    this.isDocument = (obj) => {
        return obj instanceof Document || obj instanceof Window;
    };
    this.isclass = (cl) => {
        return this.els[0].classList.contains(cl);
    };
    this.defineEls = () => {
        if (this.isNode(s) || this.isDocument(s)) {
            return [s];
        }
        
        if (this.isNodeList(s)) {
            return s;
        }

        if (p && p.isS) {
            p = p.els[0];
        }

        return this.isNode(p) ? p.querySelectorAll(s) : d.querySelectorAll(s);
    };
    this.defineEl = () => {
        return this.els[0];
    };
    this.els = this.defineEls(),
    this.el = this.defineEl(),
    this.on = (type, s, fn, except) => {
        const p = this;
        let i;

        this.bind(type, (e) => {
            const el = (p.isNode(s) || p.isNodeList(s)) ? s : S(s).els;
            const ex = except || false;
            let t = e.target;

            while (t && t !== this) {
                if (ex) {
                    for (i = 0; i < S(ex).els.length; i++) {
                        if (t === S(ex).els[i]) {
                            break;
                        }
                    }
                }

                for (i = 0; i < el.length; i++) {
                    if (t === el[i]) {
                        fn(e, t);
                        break;
                    }
                }

                if (t) {
                    t = t.parentNode;
                } else {
                    break;
                }
            }
        });

        return this;
    };
    this.strToNode = (h) => {
        let terk;

        if (!this.isNode(h)) {
            const div = this.create('div');

            div.html(h);
            terk = [div.el.children[0]];
        } else {
            terk = [h];
        }

        this.els = terk;
        this.el = terk[0];

        return this;
    };
    this.css = function(style, value) {
        if (!value && value!=='') {
          return this.els[0].style[style];
        }
        
        for (var i = 0; i < this.els.length; i++) {
          this.els[i].style[style] = value;
        }
        
        return this;
    };
    this.data = (data, value) => {
        if (!value && value!=='') {
          if (this.els[0].dataset) {
            return this.els[0].dataset[data];
          } else {
            return this.els[0].getAttribute(data);
          }  
        }
        
        for (var i = 0; i < this.els.length; i++) {
          if (this.els[i].dataset) {
            this.els[i].dataset[data] = value;
          } else {
            return this.els[i].setAttribute(data, value);
          }  
        }
        
        return this;
    };
    this.attr = (attr, value) => {
        if (!value) {
            return this.el.getAttribute(attr);
        }

        this.els.forEach((el) => {
            el.setAttribute(attr, value);
        });

        return this;
    };
    this.create = (tag) => {
        const el = d.createElement(tag);
        this.els = [el];
        this.el = el;

        return this;
    };
    this.append = (el) => {
        this.el.append(el.el);
    };
    this.style = (st, val) => {
        this.els.forEach((el) => {
            el.style[st] = val;
        });

        return this;
    };
    this.addclass = (cls) => {
        if (!cls) {
            return;
        }
        
        if (!Array.isArray(cls)) {
            cls = [cls];
        }

        this.els.forEach((el) => {
            cls.forEach((cl) => {
                el.classList.add(cl);
            });
        });

        return this;
    };
    this.togclass = (cl) => {
        this.els.forEach((el) => {
            el.classList.toggle(cl);
        });

        return this;
    };
    this.delclass = (cls) => {
        if (!Array.isArray(cls)) {
            cls = [cls];
        }

        this.els.forEach((el) => {
            cls.forEach((cl) => {
                el.classList.remove(cl);
            });
        });

        return this;
    };
    this.remove = (el) => {
        let elem = el.el;

        if (d.body.contains(elem)) {
            elem.parentNode.removeChild(elem);
        }
        
        return this;
    };
    this.delStor = (key) => {
        localStorage.removeItem(key);
        return this;
    };
    this.setStor = (key, val) => {
        localStorage.setItem(key, val);
        return this;
    };
    this.getStor = (key) => {
        return localStorage.getItem(key);
    };
    this.bind = (type, fn) => {
        let addEvent;

        if (!type || !fn) {
            return this;
        }

        if (typeof addEventListener === 'function') {
            addEvent = (el, type, fn) => {
                el.addEventListener(type, fn, false);
            }
        } else if (typeof attachEvent === 'function') {
            addEvent = (el, type, fn) => {
                el.attachEvent(`on${type}`, fn);
            }
        } else {
            return this;
        }

        if (this.isNodeList(this.els) || this.els.length > 0) {
            this.els.forEach((el) => {
                addEvent(el, type, fn);
            });
        } else if (this.isNode(this.els[0]) || this.isDocument(this.els[0])) {
            addEvent(this.els[0], type, fn);
        }

        return this;
    };
    this.html = (html) => {
        if (html !== '' && !html) {
            return this.els[0].innerHTML;
        }

        this.els.forEach((el) => {
            el.innerHTML = html;
        });

        return this;
    };
    this.text = (text) => {
        if (text !== '' && !text) {
            return this.els[0].innerText;
        }

        this.els.forEach((el) => {
            el.innerText = text;
        });

        return this;
    };
    this.val = (value) => {
        if (value !== '' && !value) {
            return this.els[0].value;
        }

        this.els.forEach((el) => {
            el.value = value;
        });

        return this;
    };

    if (this instanceof S) {
        return this.S;
    } else {
        return new S(s, p);
    }
};
/*next file*/

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
/*next file*/

(function(S, d, w) {
  const Carousel = function(elBanner) {
    const oB = S(elBanner);
    const mW = 625;
    const opt = {
      interval: oB.data('interval')
    };
    
    const options = opt || {};
    const interval = options.interval || 10000;
    const oUL = S("ul", oB);

    oUL.html(oUL.html() + oUL.html());
    
    const aLI = S("ul > li", oB);
    const len = aLI.els.length;
    const oL = len / 2;
    let tB = 0;

    S(".banner_navigation_all_page", oB).text(oL);
    oUL.css('top', tB + 'px');

    const oPrev = S(".but_next_prev.prev", oB);
    const oNext = S(".but_next_prev.next", oB);

    let liW = 0;
    let step = 0;
    let timer = null;
    let now = 0;

    const _fnPrev = function() {
      if (now > 0) {
        now--;
      } else {
        now = Math.round((oL) - 1);
        oUL.css('left', -(step * oL) + 'px');
      }

      _scroll();
    };

    const _fnNext = function() {
      if (now < ( len - 1 ) ) {
        now++;
      } else {
        //now = 0;
        now = oL;
        oUL.css('left', -(step * (oL - 1)) + 'px');
      }

      _scroll();
    };

    const _fnMouseOver = function() {
      clearInterval(timer);
    };

    const _fnMouseOut = function() {
      timer = setInterval(function(){_fnNext();}, interval);
    };

    const _cssCapture = function(obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr];
      } else {
        return getComputedStyle(obj, null)[attr];
      }
    };

    const _act = function (obj, attr, target) {
      obj.timer && clearInterval(obj.timer);

      obj.timer = setInterval(function() {
        let stop = true,
            curr = parseInt(_cssCapture(obj.el, attr)),
            speed = (target - curr) / 8;

        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

        if (curr !== target) {
          stop = false;
          obj.css(attr, curr + speed + "px");
        }

        if (stop) {
          clearInterval(obj.timer);
          obj.timer = null;
        }

      }, 30);
    };

    const _scroll = function() {
      _act(oUL, 'left', -step * now);
      S(".banner_navigation_cur_page").text(Math.round(now % oL)+1);
    };

    const _captureVPWidth = function() {
      const iBannerWidth = Math.round(oB.el.offsetWidth);

      oUL.css('width', iBannerWidth * len + "px");
      aLI.css('width', iBannerWidth + "px");

      liW = iBannerWidth;
      step = Math.round(liW);

      timer = setInterval(function(){_fnNext();}, interval);
    };

    const _throttle = function(wait) {
      const self = this;
      let context = this, args, result;
      let timeout = null;
      let previous = 0;
      const func = _captureVPWidth();

      const later = function() {
        previous = +new Date();
        timeout = null;
        result = func.apply(context, args);

        if (!timeout) {
          context = args = null;
        }
      };

      return function() {
        const nowDate = +new Date();

        if (!previous) {
          previous = nowDate;
        }

        const remaining = wait - (nowDate - previous);

        context = self;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          previous = nowDate;
          result = func.apply(context, args);

          if (!timeout) {
            context = args = null;
          }

        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    };

    const init = function() {
      _changeHeight();
      S(w).bind('load', function() { _throttle(4000); });
      oPrev.bind('click', function() { _fnPrev(); });    
      oNext.bind('click', function() { _fnNext(); });
      oB.bind('mouseover', function() { _fnMouseOver(); });
      oB.bind('mouseout', function() { _fnMouseOut(); });
      S(w).bind('resize', function () { _reload(); });

      _touchEvents();
    };

    const _reload = function () {
      clearInterval(timer);
      timer = null;
      _changeHeight();
      _captureVPWidth();
    };

    const _changeHeight = function () {
      if (S('.wrapper').el.offsetWidth > 850) {
        return;
      }

      const diff = oB.el.offsetWidth < mW ? 25 : 45;
      let height = S('.wrapper').el.offsetWidth / 3.16 + diff;
      oB.css('height', height + tB + "px");
    };

    const _touchEvents = function () {
      var startX = 0,
          lastX = null,
          route = null;

      oB.bind('touchend', 
        function() {
          if (route) {
            if (Math.abs(route) > 40) {
              if (route > 0) {
                _fnNext();
              } else {
                _fnPrev();
              }
            } else {
              oUL.css('left', (parseInt(oUL.css('left').replace("px", "")) + route) + 'px');
            }
          }

          route  = null;
          lastX  = null;
          startX = 0;
          _fnMouseOut();
        }
      );

      oB.bind('touchstart',
        function(e) {
            startX = e.touches[0].pageX;
            _fnMouseOver();
        }
      );

      oB.bind('touchmove',
        function(e) {
            var moveX = e.touches[0].pageX;

            if (!lastX) {
              lastX = startX;
            }

            var x = lastX - moveX;

            route = x === 0 ? null : startX - moveX;

            oUL.css('left', (parseInt(oUL.css('left').replace("px", "")) - x) + 'px');
            lastX = moveX;
        }
      );
    };
    
    return init();
  };
  
  S('.banner').els.forEach((el) => {
    new Carousel(el);
  })
  
})(S, document, window);
/*next file*/

(function(S) {
    const Slider = function(elSlider) {
      const oB = S(elSlider);
      const oUL = S("ul", oB);
      const oLI = S("li", oUL);
      const widthWrapper = S('.wrapper').el.offsetWidth;
      const widthObject = oLI.els.length * (oLI.el.offsetWidth + 5);
      const maxLeft = widthObject - widthWrapper;
      oUL.el.style.width = widthObject + 'px';
  
      const oPrev = S(".but_next_prev.prev", oB);
      const oNext = S(".but_next_prev.next", oB);
      const line = S(".progress_bar__line", oB);
      const widthLine = line.el.offsetWidth;
      const slide = S(".progress_bar__line_slider", oB);
      const widthSlide = slide.el.offsetWidth;
  
      let step = 100;
  
      const _fnPrev = (e) => {
        _clearTimer();
        const posX = oUL.el.style;
        let moveX = posX.left.replace(/[^0-9-]+/g, "")*1 + step;

        if (moveX > 0) {
            moveX = 0;
        }

        moveUl(moveX);
      };
  
      const _fnNext = (e) => {
        _clearTimer();
        const posX = oUL.el.style;
        let moveX = posX.left.replace(/[^0-9-]+/g, "")*1 - step;

        if (moveX < -maxLeft) {
            moveX = -maxLeft;
        }

        moveUl(moveX);
      };

      const _checkDisableButton = (x) => {
        const d = "disabled";

        if (x == -maxLeft) {
            oNext.addclass(d);
        } else {
            oNext.delclass(d);
        }

        if (x == 0) {
            oPrev.addclass(d);
        } else {
            oPrev.delclass(d);
        }
      };

      const _moveSlide = (x) => {
        slide.el.style.left = (-x * widthSlide * widthObject) / (widthWrapper * widthLine * 4) + 'px';
      };

      let timer;

      const moveUl = (x) => {
        _checkDisableButton(x);
        _moveSlide(x);

        timer = setInterval(function() {
          const curr = oUL.el.style.left.replace(/[^0-9-]+/g, "")*1;
          let stop = true;
          let speed = (x - curr) / 8;
  
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
  
          if (curr !== x) {
            stop = false;
            oUL.el.style.left = curr + speed + 'px';
          }

          if (stop) {
            _clearTimer();
          }
        }, 30);
      };
      
      const _clearTimer = () => {
        clearInterval(timer);
        timer = null;
      };

      const init = () => {
        _touchEvents();
        oPrev.bind('click', (e) => { _fnPrev(e) });
        oNext.bind('click', (e) => { _fnNext(e) });
      };
  
      const _touchEvents = () => {
        var startX = 0,
            lastX = null,
            route = null;
  
        oB.bind('touchend', (e) => {
            if (route) {
              if (Math.abs(route) > 40) {
                if (route > 0) {
                  _fnNext(e);
                } else {
                  _fnPrev(e);
                }
              } else {
                oUL.css('left', (parseInt(oUL.css('left').replace("px", "")) + route) + 'px');
              }
            }
  
            route  = null;
            lastX  = null;
            startX = 0;
        });
  
        oB.bind('touchstart',
          (e) => {
              startX = e.touches[0].pageX;
          }
        );
  
        oB.bind('touchmove',
          (e) => {
              const moveX = e.touches[0].pageX;
  
              if (!lastX) {
                lastX = startX;
              }
  
              const x = lastX - moveX;
  
              route = x === 0 ? null : startX - moveX;
  
              oUL.css('left', (parseInt(oUL.css('left').replace("px", "")) - x) + 'px');
              lastX = moveX;
          }
        );
      };
      
      return init();
    };
    
    S('.offers').els.forEach((el) => {
      new Slider(el);
    })
    
  })(S);
/*next file*/

