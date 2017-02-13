(function($) {
  $.fn.VegSlider = function(options) {
    var VegSlider = $(this), settings = $.extend({
      container: this,
      btn_prev: ".VegSlider_btn-prev",
      btn_next: ".VegSlider_btn-next",
      animation: "fade",
      timer: 2000,
      debuger: true,
      autoPlay: false,
      exibeNav: true,
      exibeTextos: true,
      habilitaTouch: true,
      current: 3,
      //fixed_width: 720,
      //fixed_height: 393
      fixed_width: '',
      fixed_height: ''
    }, options);

    var total = 0;
    var current = 0;
    var slides;
    var paused = false;
    var timer;
    var container_id = "";

    createArrow = function(_pos){
      var arrow = $("<div></div>");
      var arrowi = 'left';
      if(_pos == "r"){
        arrowi = 'right';
        arrow.click(next);
      } else {
        arrow.click(prev);
      }
      arrow.attr("class", "VegSlider-nav-arrow VegSlider-nav-arrow-"+arrowi);
      $(settings.container).append(arrow);
    }

    next = function(){ navigate('next'); }
    prev = function(){ navigate('prev'); }
    setSizes = function(){
      if(settings.fixed_height != ""){
        $(settings.container).css('height', settings.fixed_height);
      }
      if(settings.fixed_width != ""){
        $(settings.container).css('width', settings.fixed_width);
      }
    }

    centerer = function(){
      var centerer = $("<div></div>");
      centerer.attr("class", "VegSlider-centerer");
      return centerer;
    }

    ajustaImagens = function(){
      slides.each(function( index ) {
        //$( this ).attr('data-active', "false");
        //CriaElemento dentralizador vertical
        var containerImg = $( this ).find('.VegSlider-img');
        containerImg.prepend(centerer());
        if(settings.fixed_height != ""){
          $( this ).css('height', settings.fixed_height);
        }
        if(settings.fixed_width != ""){
          $( this ).css('width', settings.fixed_width);
        }
        slides.eq( current ).css( 'opacity', 1 );
        /*
        if(index > 0){
          $( this ).attr('data-active', "false");
          $( this ).hide();
        } else {
          $( this ).attr('data-active', "true");
          $( this ).show();
        }*/
      });
    }
    navigate = function(direction){
      if( paused ){ timer = setInterval(navigate, settings.timer); }
      var anteiror = slides.eq(current);
      if( direction === 'next' || direction === "") {
        current = current < total - 1 ? ++current : 0;
		  } else if( direction === 'prev' ) {
        current = current > 0 ? --current : total - 1;
      }
      var proximo = slides.eq(current);
      anteiror.css('opacity', 0);
      proximo.css('opacity', 1);
    }

    debug = function(){
      debugVar = {
        container: $(settings.container),
        total: total,
        slides: slides,
        paused: paused,
        current: current,
        container_id, container_id
      }
      console.log(debugVar);
      return debugVar;
    }
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
        args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      };
    };

    /**
      * Inicia toutch em elemento container
      * @see Doc http://www.javascriptkit.com/javatutors/touchevents2.shtml
      */
    initTouch = function(){
      window.addEventListener('load', function(){
        var touchsurface = document.getElementById(container_id),
        startX,
        startY,
        dist,
        threshold = 150, //required min distance traveled to be considered swipe
        allowedTime = 200, // maximum time allowed to travel that distance
        elapsedTime,
        startTime
        function handleswipe(isrightswipe){ if (isrightswipe){ next(); } else { prev(); } }
        touchsurface.addEventListener('touchstart', function(e){
          var touchobj = e.changedTouches[0]
          dist = 0
          startX = touchobj.pageX
          startY = touchobj.pageY
          startTime = new Date().getTime() // record time when finger first makes contact with surface
          e.preventDefault()
        }, false)
        touchsurface.addEventListener('touchmove', function(e){
          e.preventDefault() // prevent scrolling when inside DIV
        }, false)
        touchsurface.addEventListener('touchend', function(e){
          var touchobj = e.changedTouches[0]
          dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
          elapsedTime = new Date().getTime() - startTime // get time elapsed
          // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
          var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100)
          handleswipe(swiperightBol)
          e.preventDefault()
        }, false)
      }, false) // end window.onload
    }

    init = function(){
      slides = $(settings.container).find( "li" );
      total = slides.length;
      container_id = $(settings.container).attr('id');
      setSizes();
      ajustaImagens();
      if(settings.exibeNav){ createArrow("l"); createArrow("r"); }
      if(!settings.exibeTextos){ $(settings.container).find('.VegSlider-textos').hide(); }
      if(settings.habilitaTouch){ initTouch(); }
      if(settings.autoPlay){
        timer = setInterval(function(){ navigate('next') }, settings.timer);
      }
      if(settings.debuger == true){debug();}
    }

    init();
    return {
      pause: function(){
        paused = true;
        clearInterval(timer);
      },
      play: function(){
        paused = false;
        navigate()
      },
      dump: function(){
        debug();
      }
    };
  };
})(jQuery);
