var slider = (function($) { 

    var _ = {

        cls: {

            viewer: ['viewer', '.viewer'],

            slides_wrapper: ['viewer__slides-wrapper', '.viewer__slides-wrapper'],

            slide: ['viewer__slide', '.viewer__slide'],

            slide_content: ['viewer__slide-content', '.viewer__slide-content'],

            slide_caption: ['viewer__slide-caption', '.viewer__slide-caption'],

            slide_text: ['viewer__slide-text', '.viewer__slide-text'],

            toggle: ['nav__toggle', '.nav__toggle'],

            nav_next: ['nav__next', '.nav__next'],

            nav_previous: ['nav__previous', '.nav__previous']

        },

        settings: {

            // Должно совпадать с аналогичной настройкой в _vars.scss
            preview_slide_size: [320, 260],

            zoom_time: 600,

            zoom_easing: 'easeOutCubic' 

        },

        $window: null,
        $body: null,
        $viewer: null,
        $slides_wrapper: null,
        $slide: null,
        $num_of_slides: null,
        $toggle: null,
        $nav_next: null,
        $nav_previous: null,
        $current_slide: null,

        init_properties: function() {

            console.log('...init properties');

            // elements
            _.$window = $(window);
            _.$body = $('body');
            _.$viewer = $(_.cls.viewer[1]);
            _.$slides_wrapper = $(_.cls.slides_wrapper[1]);
            _.$slide = $(_.cls.slide[1]);
            _.$num_of_slides = _.$slide.length;
            _.$toggle = _.$viewer.find(_.cls.toggle[1]);
            _.$navNext = _.$viewer.find(_.cls.nav_next[1]);
            _.$navPrevious = _.$viewer.find(_.cls.nav_previous[1]);

            // other
            _.scroll_enabled = true;

        },

        init_viewer: function() {

            console.log('...init viewer');

            _.$slides_wrapper.children()
                .each(function() {

                    var $this = $(this),
                        slide;

                    slide = {
                        $image_data: $this.attr('data-image'),
                        $caption_data: $this.attr('data-caption'),
                        $text_data: $this.attr('data-text'),
                        loaded: false
                    };

                    slide.$content = $('<div class="' +  _.cls.slide_content[0] + '"></div>')
                        .appendTo($this);

                    slide.$caption = $('<div class="' +  _.cls.slide_caption[0] + '"></div>')
                        .append(slide.$caption_data)
                        .appendTo($this.children(_.cls.slide_content[1]));

                    slide.$text = $('<div class="' +  _.cls.slide_text[0] + '"></div>')
                        .append(slide.$text_data)
                        .appendTo($this.children(_.cls.slide_content[1]));

                    $this.css('background-image', 'url(' + slide.$image_data + ')');

                }) 

        },

        init_events: function() {

            console.log('...init events');

            _.$window.on('load', function() {
                _.$body.removeClass('is-loading');
            });

            _.$slide.click(function() {

                if (_.$viewer.hasClass('viewer--zoom-out')) {

                    _.scroll_enabled = false;
                    _.$body.css({ overflow: 'hidden' });
                    _.$current_slide = $(this);
                    $(this).addClass('current');
                    _.zoom('in');

                }

            });

            $(_.cls.nav_next[1]).click(function() {
                if (_.$viewer.hasClass('is-loading') || _.$current_slide.index() == _.$num_of_slides - 1) {
                    return;
                }
                _.switch('next');
            });

            $(_.cls.nav_previous[1]).click(function() {
                if (_.$viewer.hasClass('is-loading') || _.$current_slide.index() == 0) {
                    return;
                }
                _.switch('previous');
            });

            $(_.cls.toggle[1]).click(function() {
                _.zoom('out');
            });

            _.set_mouse_scrolling();

        },

        set_mouse_scrolling: function() {

            var delta = 0;

            _.$slide.on('mousemove', function(e) {
                delta = (e.clientX - window.innerWidth / 2) * 0.05;
            });

            _.$slide.on('mouseleave blur', function() {
                delta = 0;
            });

            (function f() {

                if (delta && _.scroll_enabled) {

                    _.$window.scrollLeft(function(i, v) {
                        return v + delta;
                    });

                }

                webkitRequestAnimationFrame(f);

            })();

        },

        switch: function(direction) {

            _.$viewer.addClass('is-loading');

            var i;

            if (direction == 'next') {

                 i = 1;
 
            } else if (direction == 'previous') {

                 i = -1;

            }

            var offset = (_.$current_slide.index() + i) * -100 + 'vw';

            _.animate_offset(offset, function() {

                var new_current = _.$slides_wrapper.children().eq(_.$current_slide.index() + i);
                _.animate_slide_content(new_current, 'appear');
                _.animate_slide_content(_.$current_slide, 'disappear');
                _.$current_slide = new_current;
                _.$viewer.removeClass('is-loading');

            });

        },

        zoom: function(mode) {

            if (mode == 'in') {

                var scroll = _.$window.scrollLeft() * 100 / document.documentElement.clientWidth;
                var offset = _.$current_slide.index() * -100 + scroll + 'vw';

                _.animate_offset(offset);
                _.animate_slides_size('100vw', '100vh');
                _.$viewer.removeClass('viewer--zoom-out');

            }

        },

        animate_offset: function(offset, callback) {

            _.$viewer.animate({ 
                marginLeft: offset
            }, {
                duration: _.settings.zoom_time,
                easing: _.settings.zoom_easing,
                complete: callback
            });

        },

        animate_slides_size: function(width, height) {

            _.$slide.animate({
                width: width,
                height: height
            }, {
                duration: _.settings.zoom_time,
                easing: _.settings.zoom_easing,
            });

            setTimeout(function() {

                _.animate_slide_content(_.$current_slide, 'appear');
                _.animate_navigation();

            }, _.settings.zoom_time);

        },

        animate_slide_content: function(slide, mode) {

            var o, t;

            if (mode == 'appear') {

                o = 1;
                t = '0';

            } else if (mode == 'disappear') {

                o = 0;
                t = '40px';

            }

            slide.children(_.cls.slide_content[1]).animate({
                opacity: o,
                top: t
            }, {
                duration: 400,
                easing: 'easeOutCubic'
            });

        },

        animate_navigation: function() {

            var options = {
                duration: 800,
                easing: 'easeOutCubic',
            }

            $('.nav').animate({
                opacity: 1
            }, options);

            $('.nav__previous').animate({
                marginLeft: '.8em'
            }, options);

            $('.nav__next').animate({
                marginRight: '.8em'
            }, options);

        },

        init: function() {

            console.log('init started');

            skel.breakpoints({
                xlarge: '(max-width: 1680px)',
                large: '(max-width: 1280px)',
                medium: '(max-width: 980px)',
                small: '(max-width: 736px)',
                xsmall: '(max-width: 480px)'
            });

            _.init_properties();
            _.init_viewer();
            _.init_events();

        }

    }

    return _;
    
})(jQuery);

slider.init();