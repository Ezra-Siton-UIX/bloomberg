document.addEventListener('DOMContentLoaded', function () {

  /*##################################################################
        Accessibility => Translate the screen Reader aria labels 
###################################################################*/

  // https://swiperjs.com/swiper-api#accessibility-a11y

  const isEnglish = window.location.href.includes("/en");

  /* Hebrew */
  const firstSlideMessage_hebrew = "הסלייד הראשון";
  const lastSlideMessage_hebrew = "הסלייד האחרון";
  const nextSlideMessage_hebrew = "הסלייד הבא";
  const prevSlideMessage_hebrew = "הסלייד הקודם";

  const slider_aria_messages = {
    firstSlideMessage: !isEnglish
    ? firstSlideMessage_hebrew
    : "This is the first slide",
    lastSlideMessage: !isEnglish
    ? lastSlideMessage_hebrew
    : "This is the last slide",
    nextSlideMessage: !isEnglish ? nextSlideMessage_hebrew : "Next slide",
    prevSlideMessage: !isEnglish ? prevSlideMessage_hebrew : "Previous slide",
  };

  const swiper_a11y_obj = {
    firstSlideMessage: slider_aria_messages.prevSlideMessage,
    lastSlideMessage: slider_aria_messages.lastSlideMessage,
    nextSlideMessage: slider_aria_messages.nextSlideMessage,
    prevSlideMessage: slider_aria_messages.prevSlideMessage,
  };


  function numberWithZero(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return num;
    }
  }

  const bgSwiper = new Swiper('.swiper.bg-swiper', {
    slidesPerView: 1,
    speed: 1600,
    effect: 'fade',
    allowTouchMove: false,
  });
  bgSwiper.changeLanguageDirection('rtl');

  const thumbsSwiper = new Swiper('.swiper.thumbnail-swiper', {
    a11y: swiper_a11y_obj,
    speed: 1600,
    loop: true,
    slidesPerView: 1,
    loopedSlides: 7,
    centeredSlides: true,
    slideToClickedSlide: true,
    spaceBetween: 8,
    allowTouchMove: false,
    breakpoints: {
      1024: {
        spaceBetween: 16,
      },
    },
    navigation: {
      nextEl: '.left-arrow',
      prevEl: '.right-arrow',
    },
  });

  bgSwiper.changeLanguageDirection('rtl');

  const textSwiper = new Swiper('.swiper.text-swiper', {
    a11y: swiper_a11y_obj,
    slidesPerView: 'auto',
    speed: 1000,
    effect: 'fade',
    loop: true,
    slideActiveClass: 'is-active',
    thumbs: {
      swiper: bgSwiper,
    },
    allowTouchMove: false,
  });
  textSwiper.changeLanguageDirection('rtl');

  const textSlides = document.querySelectorAll(
    '.swiper.text-swiper .swiper-slide'
  );
  textSlides.forEach((slide) => {
    if (slide.classList.contains('is-active')) {
      $(slide).find('.work-process-title')[0].classList.add('active');
      $(slide).find('.plan-slider-text')[0].classList.add('active');
    }
  });

  textSwiper.on('beforeSlideChangeStart', function (e) {
    for (let i = 0; i < textSlides.length; i++) {
      $(e.slides[i]).find('.work-process-title')[0].classList.remove('active');
      $(e.slides[i]).find('.plan-slider-text')[0].classList.remove('active');
    }
  });
  textSwiper.on('slideChangeTransitionEnd', function (e) {
    $(e.slides[e.activeIndex])
      .find('.work-process-title')[0]
      .classList.add('active');
    $(e.slides[e.activeIndex])
      .find('.plan-slider-text')[0]
      .classList.add('active');
  });

  const progressMarkers = document.querySelectorAll(
    '.process-pagination-bullet'
  );
  const progressCounter = document.querySelector('.process-pagination-counter');

  thumbsSwiper.on('slideChange', function (e) {
    textSwiper.slideTo(e.realIndex + 1);
    progressCounter.innerHTML = numberWithZero(e.realIndex);
  });
  thumbsSwiper.on('slideNextTransitionStart', function (e) {
    progressMarkers.forEach((marker, index) => {
      if (e.realIndex === 0) {
        marker.classList.remove('is-active');
        return;
      }
      if (index <= e.realIndex - 1) {
        marker.classList.add('is-active');
      } else {
        marker.classList.remove('is-active');
      }
    });
  });
  thumbsSwiper.on('slidePrevTransitionStart', function (e) {
    console.log(e.realIndex);

    progressMarkers.forEach((marker, index) => {
      console.log('index', index);
      if (e.realIndex === 0) {
        marker.classList.remove('is-active');
        return;
      }
      if (e.realIndex === 4) {
        marker.classList.add('is-active');
      }
      if (index <= e.realIndex - 1) {
        marker.classList.add('is-active');
      } else {
        marker.classList.remove('is-active');
      }
    });
  });


});
