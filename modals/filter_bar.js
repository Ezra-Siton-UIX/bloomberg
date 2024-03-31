/* ## OPEN MODAL ## */
/*
      1. set close button by close_modal attribute (the same for open)
      2. add focus_inside_modal attribute for the item you want to be on focus when the modal open
      3. add data-attribute for the filter-btn
      4. add role=dialog and aria-modal=true
      5. aria-labelledby add id for the modal title
      */

const en = window.location.href.includes('/en');
const open_filter_modal_btns = document.querySelectorAll("[open_modal]");
const close_filter_modal_btns = document.querySelectorAll("[close_modal]");
const filter_modal = document.querySelector("[filters_modal]");
const open_filter_menu_btn = document.querySelector("[filter-btn]");
const graduate_filter_items = document.querySelectorAll("[graduate-filter-item]");
const focus_this_when_modal_open = document.querySelector("[focus_this_when_modal_open]");

/* open events */
open_filter_menu_btn.addEventListener("click", function (e) {
  set_focus_when_modal_open();
});

/* ## CLOSE MODAL ## */
/* filter close_modal btn */
close_filter_modal_btns.forEach((close_filter_modal_btn) => {
  close_filter_modal_btn.addEventListener("click", function (e) {
    set_focus_when_modal_close();
  });
});

/* ## open/close modal functions ## */

graduate_filter_items.forEach((graduate_filter_item) => {
  graduate_filter_item.addEventListener("keydown", function (e) {
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      console.log("enter")
      this.querySelector("label").click();
    }
  });
});

function set_focus_when_modal_open(){
  setTimeout(() => {
    console.log(close_filter_modal_btns[0]);

    close_filter_modal_btns[0].focus();
    filter_modal.setAttribute("aria-hidden","false")
  }, 500); 


  /* set active when click enter */

  /* TAB TRAP */

  // place this line in the dialog show function - to only add the listener when the dialog is shown
  filter_modal.addEventListener('keydown', handleKey);
  // uncomment and place this in the dialog close/hide function to remove the listener when dialog is closed/hidden
  // window.removeEventListener('keydown', handleKey);
  function handleKey(e) {
    if (event.key === 'Escape') {
      // close modal here
      close_filter_modal_btns[0].click();
    }

    if (e.keyCode === 9) {
      let focusable = document.querySelector('.graduate-filter-form').querySelectorAll('a, input,button,select,textarea');
      if (focusable.length) {
        let first = focusable[0];
        let last = focusable[focusable.length - 1];
        let shift = e.shiftKey;
        if (shift) {
          if (e.target === first) { // shift-tab pressed on first input in dialog
            last.focus();
            e.preventDefault();
          }
        } else {
          if (e.target === last) { // tab pressed on last input in dialog
            first.focus();
            e.preventDefault();
          }
        }
      }
    }
  }/* handle key */
}

function set_focus_when_modal_close(){
  setTimeout(() => {
    open_filter_menu_btn.focus();
    filter_modal.setAttribute("aria-hidden","true")
  }, 500); 
}

/* index accordion */
const toggle_color_index_btn = document.querySelector("[toggle_color_index_btn]");
const color_index_content = document.querySelector("[color_index_content]");

toggle_color_index_btn.addEventListener("click", toogle_index_accordion);
let is_expanded = false; /* close by deafult */

function toogle_index_accordion(){
  is_expanded = !is_expanded;
  console.log(is_expanded);
  toggle_color_index_btn.setAttribute("aria-expanded", is_expanded);
  color_index_content.setAttribute("aria-hidden", !is_expanded);
}

/* OPEN SEARCH */

document.addEventListener("DOMContentLoaded", function() {
  // Code to be executed when the DOM is ready

  const open_search = document.querySelector("[open_search]");
  const input_search = document.querySelector("[input_search]");
  const close_search = document.querySelector("[close_search]");
  const search_block = document.querySelector("[search_block]");

  const search_block_id = "search_block";

  search_block.setAttribute("id",search_block_id);
  search_block.setAttribute("aria-hidden", "true");
  const label_value = en ? "חיפוש": "Search";
  search_block.setAttribute("aria-label", label_value);

  search_block.style.display = "none";

  open_search.setAttribute("aria-expanded","false");
  open_search.setAttribute("aria-controls",search_block_id);
  close_search.setAttribute("aria-controls",search_block_id);

  /*    open_search */
  open_search.addEventListener("click", function (e) {
    show_search_bar();
  });
  /* close_search */
  close_search.addEventListener("click", function (e) {
    hide_search_bar();
  });

  function hide_search_bar(){
    open_search.setAttribute("tabindex","0");
    open_search.style.pointerEvents = "initial";
    open_search.setAttribute("aria-expanded","false");
    search_block.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      search_block.style.display = "none";
    }, 400);
  }

  function show_search_bar(){
    open_search.setAttribute("tabindex","-1");
    open_search.style.pointerEvents = "none";
    search_block.style.display = "block";
    open_search.setAttribute("aria-expanded","true")
    search_block.setAttribute("aria-hidden", "false")
  }

});
