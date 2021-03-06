/*! jquery spiner - v0.1.0 - 2013-08-20
* https://github.com/amazingSurge/jquery-spiner
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function($) {

    var Spinner = $.spinner = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Spinner.defaults, options);
        this.namespace = this.options.namespace;
        this.enabled = true;
        this.step = this.options.step;
        this.value = this.options.value;

        this.classes = {
            enabled: this.namespace + '_enable',
            skin: this.namespace + '_' + this.options.skin
        };
        
        this.init();
    };

    Spinner.prototype = {
        constructor: Spinner,

        init: function() {
            var self = this;

            this.$control = $('<div class="' + this.namespace + '-control"><span class="' + this.namespace + '-prev"></span><span class="' + this.namespace + '-next"></span></div>');

            this.$prev = this.$control.find('.' + this.namespace + '-prev');
            this.$next = this.$control.find('.' + this.namespace + '-next');

            this.$element.wrap('<div tabindex="0" class="' + this.namespace + '-wrap"></div>');
            this.$wrap = this.$element.parent();
            this.$wrap.addClass(this.classes.enable);
            this.$element.addClass(this.namespace);

            if (this.options.skin !== null) {
                this.$wrap.addClass(this.classes.skin);
            }

            this.$control.appendTo(this.$wrap);

            // attach event
            this.$prev.on('click', function() {
                self.prev.call(self);
                return false;
            });

            this.$next.on('click', function() {
                self.next.call(self);
                return false;
            });

            this.$element.on('focus', function() {
                self._set(self.value);
                return false;
            }).on('blur', function() {
                var value = self.$element.val().replace(' ','');
                
                if ($.isNumeric(value) === false) {
                    value = self.value;
                }

                if (self.isOutOfBounds(value) === 'min') {
                     value = self.options.min;  
                }
                if (self.isOutOfBounds(value) === 'max') {
                    value = self.options.max;
                }

                self.set(value);
                return false;
            });

            this.$wrap.on('blur', function() {
                self.set(self.value);
                return false;
            });

            // keyboard
            this.$element.on('focus', function() {
                self.$element.on('keydown', function(e) {
                    var key = e.keyCode || e.which;
                    if (key === 38) {
                        self.next();
                        return false;
                    }
                    if (key === 40) {
                        self.prev();
                        return false;
                    }
                });
            }).on('blur', function() {
                self.$element.off('keydown');
            });

            // inital
            this.set(this.value);
        },
        isNumber: function(value) {
            // get rid of NaN
            if (typeof value === 'number' && $.isNumeric(value)) {
                return true;
            } else {
                return false;
            }
        },
        isOutOfBounds: function(value) {
            if (value < this.options.min) {
                return 'min';
            }

            if (value > this.options.max) {
                return 'max';
            }

            return false;
        },
        _set: function(value) {
            if (this.enable === false) {
                return;
            }
            this.value = value;
            this.$element.val(value);
        },

        /*
            Public Method
         */
        
        set: function(value) {
            if (this.enable === false) {
                return;
            }

            this.value = value;

            if ($.type(this.options.callback) === 'function') {
                value = this.options.callback(value);
            }

            this.$element.val(value);
        },
        get: function() {
            return this.value;
        },
        prev: function() {
            if (!$.isNumeric(this.value)) {
                this.value = 0;
            }
            this.value = parseInt(this.value) - parseInt(this.step);
            if (this.isOutOfBounds(this.value) === 'min') {
                if (this.options.looping === true) {
                    this.value = this.options.max;
                } else {
                    this.value = this.options.min;
                }        
            }
            this._set(this.value);

            return this;
        },
        next: function() {
            if (!$.isNumeric(this.value)) {
                this.value = 0;
            }
            this.value = parseInt(this.value) + parseInt(this.step);
            if (this.isOutOfBounds(this.value) === 'max') {
                if (this.options.looping === true) {
                    this.value = this.options.min;
                } else {
                    this.value = this.options.max;
                }   
            }
            this._set(this.value);
            return this;
        },
        enable: function() {
            this.enabled = true;
            this.$wrap.addClass(this.classes.enabled);
            return this;
        },
        disable: function() {
            this.enabled = false;
            this.$wrap.removeClass(this.classes.enabled);
            return this;
        },
        destroy: function() {
            this.$prev.off('click');
            this.$next.off('click');
            this.$element.off('keyup');
        }
    };

    Spinner.defaults = {
        namespace: 'spinner',
        skin: null,

        value: 0,
        min: -10,
        max: 10,
        step: 1,
        looping: true,

        callback: function(value) {
            return value + ' minutes';
        }
    };

    $.fn.spinner = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'spinner');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                if (!$.data(this, 'spinner')) {
                    $.data(this, 'spinner', new Spinner(this, options));
                }
            });
        }
    };
    
}(jQuery));