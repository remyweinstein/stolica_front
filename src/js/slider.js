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
  
      let step = 304;
  
      const _fnPrev = (e) => {
        _clearTimer();
        const posX = oUL.el.style;
        let moveX = posX.left.replace(/[^0-9-]+/g, "")*1 + step;

        if (moveX > 0) {
            moveX = 0;
        }

        moveUl(moveX);
      }
  
      const _fnNext = (e) => {
        _clearTimer();
        const posX = oUL.el.style;
        let moveX = posX.left.replace(/[^0-9-]+/g, "")*1 - step;

        if (moveX < -maxLeft) {
            moveX = -maxLeft;
        }

        moveUl(moveX);
      }

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
      }

      const _moveSlide = (x) => {
        slide.el.style.left = (-x * widthSlide * widthObject) / (widthWrapper * widthLine * 4) + 'px';
      }

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
      }
      
      const _clearTimer = () => {
        clearInterval(timer);
        timer = null;
      }

      const init = () => {
        _touchEvents();
        oPrev.bind('click', (e) => { _fnPrev(e) });
        oNext.bind('click', (e) => { _fnNext(e) });
      }
  
      const _touchEvents = () => {
        var startX = 0,
            lastX = null,
            route = null;
  
        oB.bind('touchend', (e) => {
            if (route) {
              console.log('route=', route);
              if (Math.abs(route) > 40) {
                if (route > 0) {
                  _fnNext(e);
                } else {
                  _fnPrev(e);
                }
              } else {
                //oUL.css('left', (parseInt(oUL.css('left').replace("px", "")) + route) + 'px');
              }
            }
  
            route  = null;
            lastX  = null;
            startX = 0;
        })
  
        oB.bind('touchstart',
          (e) => {
              startX = e.touches[0].pageX;
          }
        )
  
        oB.bind('touchmove',
          (e) => {
              const moveX = e.touches[0].pageX;
  
              if (!lastX) {
                lastX = startX;
              }
  
              const x = lastX - moveX;
  
              route = x === 0 ? null : startX - moveX;
  
              //oUL.css('left', (parseInt(oUL.css('left').replace("px", "")) - x) + 'px');
              lastX = moveX;
          }
        )
      }
      
      return init();
    }
    
    S('.offers').els.forEach((el) => {
      new Slider(el);
    })
    
  })(S);