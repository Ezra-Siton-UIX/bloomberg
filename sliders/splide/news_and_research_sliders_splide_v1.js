//console.log("news_and_research_sliders_splide.js loaded");

// Example usage for multiple sliders
document.addEventListener('DOMContentLoaded', function () {

  /*##################################################################
            Accessibility => Translate the screen Reader aria labels 
    ###################################################################*/

  // // https://splidejs.com/guides/version4/

  const isEnglish = window.location.href.includes('/en');
  const slider_direction = isEnglish ? "ltr" : "rtl";

  console.log(slider_direction);

  /* Hebrew */
  const firstSlideMessage_hebrew = "הסלייד הראשון";
  const lastSlideMessage_hebrew = "הסלייד האחרון";
  const nextSlideMessage_hebrew = "הסלייד הבא"
  const prevSlideMessage_hebrew = "הסלייד הקודם";
  const slide_hebrew = "סלייד";
  const carousel_hebrew = "סליידר מתחלף של קישורים"
  const slideX = "%s מעבר לסלייד";


  const slider_aria_messages = {
    firstSlideMessage: !isEnglish ? firstSlideMessage_hebrew : 'This is the first slide',
    lastSlideMessage: !isEnglish ? lastSlideMessage_hebrew : 'This is the last slide',
    nextSlideMessage: !isEnglish ? nextSlideMessage_hebrew : 'Next slide',
    prevSlideMessage: !isEnglish ? prevSlideMessage_hebrew : 'Previous slide',
    //slide_hebrew: !isEnglish ? slide_hebrew : 'slide',  
    carousel: !isEnglish ? carousel_hebrew : 'carousel', 
    slideX: !isEnglish ? prevSlideMessage_hebrew : 'Go to slide %s',
  }
  /* splide and swiper aria setting */
  const splide_i18n_obj = {
    first: slider_aria_messages.firstSlideMessage,
    last: slider_aria_messages.lastSlideMessage,
    prev: slider_aria_messages.prevSlideMessage,
    next: slider_aria_messages.nextSlideMessage,
    //slideX: slider_aria_messages.slideX,
    carousel: slider_aria_messages.carousel,
    // slide              aria-roledescription of each slide 
  }


  function initializeSlider(containerId, config) {
    /* if the item not exsist stop the function */
    const slides_nodes = document.querySelectorAll(`${containerId} .splide__slide`);
    if(document.querySelector(containerId) == null)return;


    var splide = new Splide(containerId, config);

    splide.mount();

    if(containerId == "#splideNews" ){
      console.log();
      let btns = document.querySelectorAll('.splide__slide:not(splide__slide--clone) a');

      btns.forEach(function (item) {
        console.log(item.tabIndex, "tabIndex")

        //item.tabIndex = -1;


        item.addEventListener('focus', function() {

          //splide.go('+${i}');

        });


      });
    }


    function updatePagination(activeIndex) {
      const pagination = document.querySelector(`${containerId} .splide__pagination`);
      const totalPages = splide.length;


      // Format slide numbers (e.g., "03/06" for the third slide out of six)
      const formattedCurrent = activeIndex + 1;
      const formattedTotal = totalPages;

      // Update separate navigation with current slide number and total slides
      const navText = $(`${containerId} .navtext`); // Change this selector if needed
      $(navText).text(`${formattedCurrent}/${formattedTotal}`);
    }

    // Listen to the 'moved' event to update the pagination
    splide.on('moved', () => {
      //console.log(splide);

      const activeIndex = splide.index;
      //console.log(`Current Slide in ${containerId}:`, activeIndex + 1);
      updatePagination(activeIndex);
      /* custom focus */
      /* set the focus manually to the correct a item */
      //slides_nodes[activeIndex].querySelector('a').focus();
    });


    splide.on('arrows:updated', () => {
      //console.log("arrows");

    });




    splide.on('click', () => {
      console.log("wwwwwwwwwwwww");
      const url = this.querySelector('a').getAttribute('href')
      window.location.href = url;
    });




    // Initialize pagination on page load
    updatePagination(splide.index);

    const paginationItems = document.querySelectorAll(`${containerId} .splide__pagination__page`);
    paginationItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        splide.go(index); // Navigate to the corresponding slide when pagination is clicked
      });
    });
  }


  const keyboard_setting = true;

  // splideNews
  initializeSlider('#splideNews', {
    i18n: splide_i18n_obj,/* aria */
    keyboard: keyboard_setting, /* keyboard accessibility */
    slideFocus: false,/*  Determines whether to add tabindex="0" to visible slides or not. The default value is false when isNavigation is false, and true when isNavigation is true. This is because:

 */
    direction: slider_direction,
    pagination : false,
    type   : 'loop',
    focus: 0,





    perMove: 1,
    perPage: 3,
    gap: '5rem',

    speed: 300,
    easing: 'cubic-bezier(.22,.48,.23,.92)',
    pagination: false,

    breakpoints: {
      767: {
      },

      // Webflow Max Width { 0 - 476px }
      477: {
        perPage: 1,
        gap: '1rem',
        focus: "center",
        padding: {  right: "5%" }
      },
    },

    classes: {
      prev  : 'splide__arrow--prev',
      next  : 'splide__arrow--next',
      pagination: 'splide__pagination',
      page: 'splide__pagination__page is-outlined',
    },
  });


  // splideResearch 
  initializeSlider('#splideResearch', {
    i18n: splide_i18n_obj,/* aria */
    keyboard: keyboard_setting, /* keyboard accessibility */
    slideFocus: false,/*  Determines whether to add tabindex="0" to visible slides or not. The default value is false when isNavigation is false, and true when isNavigation is true. This is because:

 */
    direction: slider_direction,
    pagination : false,
    type   : 'loop',
    focus: 0,



    perMove: 1,
    perPage: 2,
    gap: '5rem',

    padding: {left: '12vw'},
    speed: 300,
    easing: 'cubic-bezier(.22,.48,.23,.92)',

    breakpoints: {
      767: {
        perPage: 2,
        gap: '0.5rem',
        padding: {left: '2.5rem'},
        focus: "center"
      },

      // Webflow Max Width { 0 - 476px }
      477: {
        perPage: 1,
      },

    },

    classes: {
      prev  : 'splide__arrow--prev',
      next  : 'splide__arrow--next',
      pagination: 'splide__pagination',
      page: 'splide__pagination__page is-outlined',
    },
  });  

  // splideTeam
  initializeSlider("#splideTeam", {
    i18n: splide_i18n_obj,/* aria */
    keyboard: keyboard_setting, /* keyboard accessibility */
    slideFocus: true,/* focus */
    type: "loop",
    direction: slider_direction,
    perMove: 1,
    perPage: 1,
    gap: "0.75rem",
    padding: { left: "5vw" },
    speed: 300,
    easing: "cubic-bezier(.22,.48,.23,.92)",
    pagination: false,
    focus: 0,
    mediaQuery: "min",

    breakpoints: {
      478: {
        destroy: true,
      },
    },

    classes: {
      prev: "splide__arrow--prev",
      next: "splide__arrow--next",
      pagination: "splide__pagination",
      page: "splide__pagination__page is-outlined",
    },
  });
});
