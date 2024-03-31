// console.log("testimonial_slider_swiper-old-code.js");

// The swipe of the text not working (need to be fix in the future) 
/* backup code: https://assets-global.website-files.com/64fe616953bedf2be1e9b86f/65f710f2f8742efcb806296a_homepage_slider.txt

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

/* vars */
const carousel = document.querySelector(".swiper-wrapper.testimonial-swiper");
const slides = carousel.querySelectorAll(".testimonial-slide-c");
const indexNumber = document.querySelector(".active-testimonial-index");
const slidesContent = document.querySelectorAll(".testimonial-text-item");
const isMobile = window.innerWidth < 991;

const testimonialSwiper = new Swiper(".swiper.testimonial-swiper", {
a11y: swiper_a11y_obj,
speed: 800,
keyboard: true,
slidesPerView: "auto",
centeredSlides: true,
spaceBetween: 20,
slideToClickedSlide: true,
preventInteractionOnTransition: true,
autoplay: {
  delay: 5000,
  stopOnLastSlide: true,
  disableOnInteraction: false,
},
breakpoints: {
  991: {
    spaceBetween: 40,
  },
},
// Navigation arrows
navigation: {
  nextEl: ".next-btn",
  prevEl: ".prev-btn",
},
on: {
  init: function (e) {
    e.slides[e.activeIndex]
      .querySelector(".testimonial-slide-c")
      .classList.remove("in-active");
    for (let i = 0; i < e.slides.length; i++) {
      const slide = e.slides[i].querySelector(".testimonial-slide-c");
      if (i !== e.activeIndex) {
        if (i - e.activeIndex === 1) {
          slide.style.transform = isMobile
            ? "translateX(3.1825rem)"
          : "translateX(28.4375rem)";
        } else if (i - e.activeIndex === 2) {
          slide.style.transform = isMobile
            ? "translateX(11.4375rem)"
          : "translateX(85.3125rem)";
        } else {
          slide.style.transform = isMobile
            ? `translateX(${(i - e.activeIndex) * 3.1825 + 6.365}rem)`
          : `translateX(${(i - e.activeIndex) * 28.4375 + 56.875}rem)`;
        }
      }
    }
  },
},
});

let currentIndex = 0;
gsap.set(slidesContent[currentIndex], {
opacity: 1,
display: "block",
});

function slideTransitionForwad(e) {
const slideTl = gsap.timeline({ paused: true });

for (let i = 0; i < e.slides.length; i++) {
  const slide = e.slides[i].querySelector(".testimonial-slide-c");
  gsap.to(
    slidesContent[i],
    {
      opacity: 0,
      display: "none",
    },
    "<"
  );
  if (i === e.activeIndex) {
    slideTl.to(
      slide,
      {
        duration: 0.8,
        transform: "translateX(0)",
        width: "100%",
        height: "100%",
      },
      0
    );
    gsap.to(slide.querySelector(".testimonial-overlay"), {
      height: "0%",
      duration: 0.2,
    });
    gsap.to(
      slidesContent[i],
      {
        opacity: 1,
        display: "block",
      },
      "<"
    );
  } else if (i < e.activeIndex) {
    if (e.activeIndex - i === 1) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(-3.1825rem)"
          : "translateX(-28.4375rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else if (e.activeIndex - i === 2) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(-11.4375rem)"
          : "translateX(-85.3125rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? `translateX(${-((e.activeIndex - i) * 3.1825 + 6.365)}rem)`
          : `translateX(${-((e.activeIndex - i) * 28.4375 + 56.875)}rem)`,
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    }
  } else if (i > e.activeIndex) {
    if (i - e.activeIndex === 1) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(3.1825rem)"
          : "translateX(28.4375rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else if (i - e.activeIndex === 2) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(11.4375rem)"
          : "translateX(85.3125rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? `translateX(${(i - e.activeIndex) * 3.1825 + 6.365}rem)`
          : `translateX(${(i - e.activeIndex) * 28.4375 + 56.875}rem)`,
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    }
  }
}
slideTl.play();
currentIndex = e.activeIndex;
indexNumber.textContent = currentIndex + 1;
}

function slideTransitionBackward(e) {
const slideTl = gsap.timeline({ paused: true });

for (let i = 0; i < e.slides.length; i++) {
  const slide = e.slides[i].querySelector(".testimonial-slide-c");
  gsap.to(
    slidesContent[i],
    {
      opacity: 0,
      display: "none",
    },
    "<"
  );
  if (i === e.activeIndex) {
    slideTl.to(
      slide,
      {
        duration: 0.8,
        transform: "translateX(0)",
        width: "100%",
        height: "100%",
      },
      0
    );
    gsap.to(slide.querySelector(".testimonial-overlay"), {
      height: "0%",
      duration: 0.2,
    });
    gsap.to(
      slidesContent[i],
      {
        opacity: 1,
        display: "block",
      },
      "<"
    );
  } else if (i < e.activeIndex) {
    if (e.activeIndex - i === 1) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(-3.1825rem)"
          : "translateX(-28.4375rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else if (e.activeIndex - i === 2) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(-11.4375rem)"
          : "translateX(-85.3125rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? `translateX(${-(e.activeIndex - i) * 3.1825 + 6.365}rem)`
          : `translateX(${-(e.activeIndex - i) * 28.4375 + 56.875}rem)`,
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    }
  } else if (i > e.activeIndex) {
    if (i - e.activeIndex === 1) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(3.1825rem)"
          : "translateX(28.4375rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else if (i - e.activeIndex === 2) {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? "translateX(11.4375)"
          : "translateX(85.3125rem)",
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    } else {
      slideTl.to(
        slide,
        {
          duration: 0.8,
          transform: isMobile
          ? `translateX(${(i - e.activeIndex) * 3.1825 + 6.365}rem)`
          : `translateX(${(i - e.activeIndex) * 28.4375 + 56.875}rem)`,
          width: isMobile ? "54%" : "17%",
          height: isMobile ? "70%" : "50%",
        },
        0
      );
    }
  }
}

slideTl.play();
currentIndex = e.activeIndex;
indexNumber.textContent = currentIndex + 1;
}

testimonialSwiper.on("slideChangeTransitionStart", function (e) {
if (e.previousIndex < e.activeIndex) {
  slideTransitionForwad(e);
} else {
  slideTransitionBackward(e);
}
});

slides.forEach((slide, index) => {
slide.addEventListener("mouseenter", () => {
  if (index !== currentIndex) {
    gsap.to(slide.querySelector(".testimonial-overlay"), {
      height: "100%",
      duration: 0.2,
    });
  }
});
slide.addEventListener("mouseleave", () => {
  if (index !== currentIndex) {
    gsap.to(slide.querySelector(".testimonial-overlay"), {
      height: "0%",
      duration: 0.2,
    });
  }
});
});

/*####################### new code (march 24) toggle autoplay #######################*/

const testimonialSwiper_play_stop_toggle_button = document.querySelector(
"a[testimonials_toggle_play_stop_btn]"
);

let testimonialSwiper_play_icon;
let testimonialSwiper_stop_icon;


var testimonialSwiper_clickCounter = 0;

if(testimonialSwiper_play_stop_toggle_button !== null){

testimonialSwiper_stop_icon =
  testimonialSwiper_play_stop_toggle_button.querySelector("[toggle_stop]");

testimonialSwiper_play_icon =
  testimonialSwiper_play_stop_toggle_button.querySelector("[toggle_play]");
testimonialSwiper_play_icon.style.opacity = "0";


}

if(testimonialSwiper_play_stop_toggle_button !== null){
testimonialSwiper_play_stop_toggle_button.addEventListener(
  "click",
  toggle_testimonialSwiper_autoplay
);
}

function toggle_testimonialSwiper_autoplay() {
console.log("toggle");
testimonialSwiper_clickCounter = testimonialSwiper_clickCounter + 1;
//check if the number is even
if (testimonialSwiper_clickCounter % 2 == 0) {
  console.log("The number is even.");
  play_testimonialSwiper();
}
// if the number is odd
else {
  console.log("The number is odd.");
  stop_testimonialSwiper();
}
}

function play_testimonialSwiper() {
testimonialSwiper_stop_icon.style.opacity = "1";
testimonialSwiper_play_icon.style.opacity = "0";
testimonialSwiper_play_stop_toggle_button.title = "STOP";
testimonialSwiper.autoplay.start();
console.log("start testimonialSwiper");
}

function stop_testimonialSwiper() {
testimonialSwiper_stop_icon.style.opacity = "0";
testimonialSwiper_play_icon.style.opacity = "1";
testimonialSwiper_play_stop_toggle_button.title = "PLAY";
testimonialSwiper.autoplay.stop();
console.log("stop testimonialSwiper");
}
