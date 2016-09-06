var slider = (function($) { 

    var _ = {

        class_names: {

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

            _.$window = $(window);
            _.$body = $('body');
            _.$viewer = $(_.class_names.viewer[1]);
            _.$slides_wrapper = $(_.class_names.slides_wrapper[1]);
            _.$slide = $(_.class_names.slide[1]);
            _.$num_of_slides = _.$slide.length;
            _.$toggle = _.$viewer.find(_.class_names.toggle[1]);
            _.$navNext = _.$viewer.find(_.class_names.nav_next[1]);
            _.$navPrevious = _.$viewer.find(_.class_names.nav_previous[1]);

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

                    slide.$content = $('<div class="' +  _.class_names.slide_content[0] + '"></div>')
                        .appendTo($this);

                    slide.$caption = $('<div class="' +  _.class_names.slide_caption[0] + '"></div>')
                        .append(slide.$caption_data)
                        .appendTo($this.children(_.class_names.slide_content[1]));

                    slide.$text = $('<div class="' +  _.class_names.slide_text[0] + '"></div>')
                        .append(slide.$text_data)
                        .appendTo($this.children(_.class_names.slide_content[1]));

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

                    _.$current_slide = $(this);
                    $(this).addClass('current');
                    _.zoom('in');

                }

            });

            $(_.class_names.nav_next[1]).click(function() {

                if (_.$current_slide.index() !== _.$num_of_slides - 1) {

                    _.switch('next');

                }

            });

            $(_.class_names.nav_previous[1]).click(function() {

                if (_.$current_slide.index() !== 0) {

                    _.switch('previous');

                }

            });

            $(_.class_names.toggle[1]).click(function() {

                _.zoom('out');

            });

        },

        switch: function(direction) {

            var i;

            if (direction == 'next') {

                 i = 1;
 
            } else if (direction == 'previous') {

                 i = -1;

            }

            _.animate_offset(_.$current_slide.index() + i, function() {

                var new_current = _.$slides_wrapper.children().eq(_.$current_slide.index() + i);
                _.animate_slide_content(new_current, 'appear');
                _.animate_slide_content(_.$current_slide, 'disappear');
                _.$current_slide = new_current;

            });

        },

        zoom: function(mode) {

            if (mode == 'in') {

                _.animate_offset(_.$current_slide.index());
                _.animate_slides_size('100vw', '100vh');

                _.$viewer.removeClass('viewer--zoom-out');

            }

        },

        animate_offset: function(offset, callback) {

            _.$viewer.animate({ 
                marginLeft: -offset * 100 + 'vw'
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
                t = '-40px';

            } else if (mode == 'disappear') {

                o = 0;
                t = 0;

            }

            slide.children(_.class_names.slide_content[1]).animate({
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