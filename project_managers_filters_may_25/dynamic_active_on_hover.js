function set_facnybox_values(){

}
// add # to each data-src value (from "about" to "#about") //

$("[data-w-tab]").each(function( outer_index ) {


  $( this ).find("[data-src]" ).each(function( index ) {
    const this_data_src =  $( this ).attr("data-src");

    if(this_data_src.length > 0){
      const new_data_src = "#"+this_data_src;
      $( this ).attr("data-src", new_data_src);
      $( this ).attr("data-fancybox", new_data_src);

      /* set thumbnail */
       // const img_url = $(`[team_image="${this_data_src}"]`).attr("src");
      //$( this ).attr("data-thumb", img_url);

    }



  });



});



Fancybox.bind("[data-fancybox]", {
  // Your custom options
  closeButton: false,
  autoFocus: false,
  groupAll: false,
  Thumbs: {
    type: "classic",
  },
  on: {
    reveal: (fancybox, slide) => {
      // The content of this slide is loaded and ready to be revealed
      console.log("reveal");
      //lenis.stop()
    },
    close: (fancybox, slide) => {
      // The content of this slide is loaded and ready to be revealed
      console.log("close");
      //lenis.start()
    },
  },
});


// for page: a2. תוכנית הצמיחה

const cards = document.querySelectorAll('[card]');
let trigger_is_hover = true;

if(document.querySelector('[trigger_is_hover]') !== null){
  const trigger_is_hover_attribute = document.querySelector('[trigger_is_hover]').getAttribute("trigger_is_hover");

  if(trigger_is_hover_attribute !== null){
    trigger_is_hover = trigger_is_hover_attribute;
  }
}

console.log("trigger_is_hover", trigger_is_hover);

const active_class = "active";
const breakpoint_touch_devices = 991;
let event_trigger = trigger_is_hover || trigger_is_hover == "true" ? "mouseover" : "click";

var self_innerWidth = self.innerWidth;
//var h = window.outerHeight;

if (self_innerWidth < breakpoint_touch_devices) {
  // on mobile we want only to use Click mode (no hover) //
  event_trigger = "click";
  re_render_addEventListener("click");
}else{
  console.log(innerWidth, event_trigger)
  re_render_addEventListener(event_trigger);
}



function reportWindowSize() {
  var self_innerWidth = self.innerWidth;
  //var h = window.outerHeight;

  console.log(self_innerWidth, "re_render_addEventListener")

  if (self_innerWidth < breakpoint_touch_devices) {
    re_render_addEventListener("click");
  }else{
    re_render_addEventListener(event_trigger);
  }

}

window.onresize = reportWindowSize;



function set_active_card(evt) {
  // add an "active" class to the button that opened the tab
  const contain_active =  evt.currentTarget.classList.contains("active");
  const this_btn = evt.currentTarget;


  if(contain_active && event_trigger === "click"){
    remove_active_class_from_cards();
  }

  if(!contain_active){
    remove_active_class_from_cards();
    this_btn.classList.add(active_class);
  }



}

function remove_active_class_from_cards(event_trigger){
  // Get all elements with class="tablinks" and remove the class "active"
  const cards = document.querySelectorAll('[card]');
  for (i = 0; i < cards.length; i++) {
    cards[i].className = cards[i].className.replace(active_class, "");
  }
}





function re_render_addEventListener(event_trigger){
  const cards = document.querySelectorAll('[card]');

  // removeEventListener

  cards.forEach(function (card, idx) {
    card.removeEventListener('mouseover', set_active_card)
    card.removeEventListener('click', set_active_card)
    card.removeEventListener('mouseleave', set_active_card)
    card.removeEventListener("mouseleave", remove_active_class_from_cards)  
  });



  // addEventListener click -or- mouseover
  cards.forEach(function (card, idx) {
    card.addEventListener(event_trigger, set_active_card)
  });

  // addEventListener mouseleave
  cards.forEach(function (card, idx) {
    if(event_trigger == "mouseover")card.addEventListener("mouseleave", remove_active_class_from_cards)  
  });
}

/* disable flip card when you click/hover on link inside the card */
const cards_links = document.querySelectorAll('[card] a');
cards_links.forEach(function (cards_link, idx) {
  cards_link.addEventListener(event_trigger, function (event) {
    // event.stopPropagation();
  });
});
