var slider = (function($) { 

    var _ = {

        $window         : null,
        $body           : null,
        $slider         : null,
        $viewer         : null,
        $slides_wrapper : null,
        $slide          : null,
        $navPrevious    : null,
        $navNext        : null,
        $sidebarL       : null,
        $sidebarR       : null,
        scroll_enabled  : null,
        $num_of_slides  : null,

        init_properties: function() {

            // dom elements
            _.$window         = $(window);
            _.$body           = $('body');
            _.$slider         = $('.slider');
            _.$viewer         = $('.viewer');
            _.$slides_wrapper = $('.slides-wrapper');
            _.$slide          = $('.slide');
            _.$navPrevious    = $('.previous');
            _.$navNext        = $('.next');
            _.$sidebarL       = $('.sidebar.left');
            _.$sidebarR       = $('.sidebar.right');

            // other
            _.scroll_enabled = true;
            _.$num_of_slides = _.$slide.length;

        },

        init_viewer: function() {

            // making some slides
            _.$slides_wrapper.children().each(function() {

                var s = $(this);

                $('<div class="content"></div>').appendTo(s);

                $('<div class="caption"></div>').append(s.attr('data-caption')).
                                                 appendTo(s.children('.content'));
                $('<div class="text"></div>').append(s.attr('data-text')).
                                                 appendTo(s.children('.content'));

                s.css('background-image', 'url(' +  s.attr('data-image') +')');

            }) 

        },

        init_events: function() {

            _.$window.on('load', function() {
                _.$body.removeClass('is-loading');
            });

            // scrolling via mouse hovering
            _.init_scrolling();

            // zoom-in
            _.$slide.click(function() {
                if (_.$slider.hasClass('zoomed-out')) {
                    _.scroll_enabled = false;
                    _.$body.css({ overflow: 'hidden' });
                    _.$current_slide = $(this);
                    $(this).addClass('current');
                    _.zoom('in');
                }
            });

            // zoom-out
            $('.all-slides').click(function() {
                $('.sidebar').each(function() {
                    $(this).removeClass('shown');
                    _.$slider.removeClass('zoomed-in');
                    setTimeout(function() {
                        _.zoom('out');
                    }, 600);
                })
            });

            // sidebar appearance
            var f = function() {
                var self = $(this);
                setTimeout(function() {
                    var sbar = self.attr('class') == 'previous' ? _.$sidebarL : _.$sidebarR;
                    sbar.addClass('shown');
                }, 300)
            }

            _.$navNext.hover(f);
            _.$navPrevious.hover(f);

            // switch slide
            _.$sidebarL.children('.preview').click(function() {
                if (_.$current_slide.index() == 0) return;
                _.switch('previous');
            });

            _.$sidebarR.children('.preview').click(function() {
                if (_.$current_slide.index() == _.$num_of_slides - 1) return;
                _.switch('next');
            });

        },


        init_scrolling: function() {

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

            var offset = (_.$current_slide.index() + i) * -100 + (_.$window.scrollLeft() * 100 / document.documentElement.clientWidth) + 'vw';

            _.animate_offset(offset, function() {
                var new_current = _.$slides_wrapper.children().eq(_.$current_slide.index() + i);
                // _.animate_slide_content(new_current, 'appear');
                // _.animate_slide_content(_.$current_slide, 'disappear');
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
                _.$slider.removeClass('zoomed-out');

                setTimeout(function() {
                    _.$slider.addClass('zoomed-in');
                }, 600);

            } else if (mode == 'out') {

                _.$slider.addClass('zoomed-out');
                _.animate_slides_size(320, 260);
                _.animate_offset(0, function() {
                    _.scroll_enabled = true;
                });
                _.$body.css('overflow', 'auto');

            }

        },

        animate_offset: function(offset, callback) {

            _.$viewer.animate({ 
                marginLeft: offset
            }, {
                duration: 600,
                easing: 'easeOutCubic',
                complete: callback
            });

        },

        animate_slides_size: function(width, height) {

            _.$slide.animate({
                width: width,
                height: height
            }, {
                duration: 600,
                easing: 'easeOutCubic',
            });

        },

        init: function() {

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