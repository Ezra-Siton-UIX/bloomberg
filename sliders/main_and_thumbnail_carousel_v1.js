document.addEventListener( 'DOMContentLoaded', function () {

  const isEnglish = window.location.href.includes('/en');
  const direction = isEnglish ? "ltr" : "rtl";


  /* הכיוון ומה שמוגדר בתוך וובפלואו צריכים להיות תואמים אחרת יש איזשהו באג */

  /*##################################################################
       Accessibility => Translate the screen Reader aria labels 
  ###################################################################*/

  // // https://splidejs.com/guides/version4/

  /* Hebrew */
  const firstSlideMessage_hebrew = "הסלייד הראשון";
  const lastSlideMessage_hebrew = "הסלייד האחרון";
  const nextSlideMessage_hebrew = "הסלייד הבא"
  const prevSlideMessage_hebrew = "הסלייד הקודם";
  const slideX = "%s מעבר לסלייד";

  const slider_aria_messages = {
    firstSlideMessage: !isEnglish ? firstSlideMessage_hebrew : 'This is the first slide',
    lastSlideMessage: !isEnglish ? lastSlideMessage_hebrew : 'This is the last slide',
    nextSlideMessage: !isEnglish ? nextSlideMessage_hebrew : 'Next slide',
    prevSlideMessage: !isEnglish ? prevSlideMessage_hebrew : 'Previous slide',
    slideX: !isEnglish ? prevSlideMessage_hebrew : 'Go to slide %s',
  }
  /* splide and swiper aria setting */
  const splide_i18n_obj = {
    first: slider_aria_messages.firstSlideMessage,
    last: slider_aria_messages.lastSlideMessage,
    prev: slider_aria_messages.prevSlideMessage,
    next: slider_aria_messages.nextSlideMessage,
  }
  /* slider 1 of 3 */
  var main = new Splide( '[main_carousel]', {
    i18n: splide_i18n_obj,/* aria */
    type      : 'fade',
    rewind    : true,
    pagination: false,
    arrows    : false,
  } );

  /* slider 2 of 3 */
  const thumbnails_setting = {
    i18n: splide_i18n_obj,/* aria */
    direction: direction,

    //paginationDirection: direction,
    keyboard: true,
    isNavigation: true,
    pagination : false,
    rewind      : true,
    autoWidth: true,
    arrows    : false,
    gap         : 10,

    breakpoints : {
      600: {
        fixedWidth : 140,
        autoWidth: false,
        gap         : 10,
      },
    },
  } 

  var thumbnails = new Splide( '[thumbnail_carousel]', thumbnails_setting);

  /* slider 3 of 3 */
  var background_carousel = new Splide( '[background_carousel]', {
    i18n: splide_i18n_obj,/* aria */
    type      : 'fade',
    rewind    : true,
    pagination: false,
    arrows    : false,
    noDrag: true
  } );

  main.sync( thumbnails );
  main.sync( background_carousel );
  main.mount();
  thumbnails.mount();
  background_carousel.mount();  

} );
