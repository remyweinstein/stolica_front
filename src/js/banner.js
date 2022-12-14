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