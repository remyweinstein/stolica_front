const S = function (s, p) {
    const d = document;
    this.isS = true;
    this.isNodeList = (nodes) => {
        const stringRepr = Object.prototype.toString.call(nodes);

        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            (typeof nodes.length === 'number') &&
            (nodes.length === 0 || (typeof nodes[0] === 'object' && nodes[0].nodeType > 0));
    }
    this.isNode = (obj) => {
        return obj && obj.nodeType ? true : false;
    }
    this.isDocument = (obj) => {
        return obj instanceof Document || obj instanceof Window;
    }
    this.isclass = (cl) => {
        return this.els[0].classList.contains(cl);
    }
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
    }
    this.defineEl = () => {
        return this.els[0];
    }
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
    }
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
    }
    this.css = function(style, value) {
        if (!value && value!=='') {
          return this.els[0].style[style];
        }
        
        for (var i = 0; i < this.els.length; i++) {
          this.els[i].style[style] = value;
        }
        
        return this;
    }
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
    }
    this.attr = (attr, value) => {
        if (!value) {
            return this.el.getAttribute(attr);
        }

        this.els.forEach((el) => {
            el.setAttribute(attr, value);
        });

        return this;
    }
    this.create = (tag) => {
        const el = d.createElement(tag);
        this.els = [el];
        this.el = el;

        return this;
    }
    this.append = (el) => {
        this.el.append(el.el);
    }
    this.style = (st, val) => {
        this.els.forEach((el) => {
            el.style[st] = val;
        });

        return this;
    }
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
    }
    this.togclass = (cl) => {
        this.els.forEach((el) => {
            el.classList.toggle(cl);
        });

        return this;
    }
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
    }
    this.remove = (el) => {
        let elem = el.el;

        if (d.body.contains(elem)) {
            elem.parentNode.removeChild(elem);
        }
        
        return this;
    }
    this.delStor = (key) => {
        localStorage.removeItem(key);
        return this;
    }
    this.setStor = (key, val) => {
        localStorage.setItem(key, val);
        return this;
    }
    this.getStor = (key) => {
        return localStorage.getItem(key);
    }
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
    }
    this.html = (html) => {
        if (html !== '' && !html) {
            return this.els[0].innerHTML;
        }

        this.els.forEach((el) => {
            el.innerHTML = html;
        });

        return this;
    }
    this.text = (text) => {
        if (text !== '' && !text) {
            return this.els[0].innerText;
        }

        this.els.forEach((el) => {
            el.innerText = text;
        });

        return this;
    }
    this.val = (value) => {
        if (value !== '' && !value) {
            return this.els[0].value;
        }

        this.els.forEach((el) => {
            el.value = value;
        });

        return this;
    }

    if (this instanceof S) {
        return this.S;
    } else {
        return new S(s, p);
    }
};