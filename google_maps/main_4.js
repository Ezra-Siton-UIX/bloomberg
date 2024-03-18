console.clear();

var w = document.documentElement.clientWidth || window.innerWidth;
const is_mobile = w <= 600;

/* set map English vs Hebrew */
const map_node = document.getElementById("map");
let rtl = map_node.getAttribute("map_direction");
rtl = rtl == "rtl" ? true : false;

/*#### TOC ####*/
// 1 of 4 - Pull the data from HTML (1.Persons, 2.cities, 3.semesters)
// 2 of 4  - GOOGLE MAPS
// 3 of 4 - Render InfoWindow
// 4 of 4 - Helper Functions
/*

    /* IMPORTANT 
    לזכור מבלבל - יש לכפתורי סינון 2 מקומות לטיפול - במקום אחד זה מסתיר/מציג מרקרים במקום אחר זה משנה את התוכן בתור המרקר עצמו
    */
/*#######################################################################################
              1 of 4 - Pull the data from HTML (1.Persons, 2.cities, 3.semesters)
      #########################################################################################*/

/* use to show/hide markers in the future */
var markers_google_maps_objects = [];

window.onload = function () {
  generate_data_from_the_html();
  initMap();
};

const $generate_btn = document.querySelector("[generate]");
const $add_person_btn = document.querySelector("[add]");
if ($generate_btn !== null) {
  document.querySelector("[generate]").addEventListener("click", function () {
    markersOnMap_array = []; // tel aviv, haifa //
    persons_arr = []; // avi levy, orna ben //
    semesters_arr = []; // "semester A" //
    markers_google_maps_objects = [];
    generate_data_from_the_html();
    initMap();
  });
}

if ($add_person_btn) {
  document.querySelector("[add]").addEventListener("click", function () {
    const ele = document.getElementById("persons");
    const newDiv = document.createElement("li");
    newDiv.setAttribute("data-item", "data-item");

    newDiv.innerHTML = `
      <b data-city="Jerusalem">Jerusalem</b> •
      <i data-name="Bobi bob">Bobi ${Math.random()}</i>
      <i data-name_he="${Math.random()}ירושליים">בובי </i>
      <i data-position="Red">Red</i>
      <i data-position_he="מנהל עבודה">מנהל עבודה</i>
      <i data-semester="A-wow">A</i>
              `;
    ele.appendChild(newDiv);
  });
}

/* FILTER MENU TOGGLE Active Class On Click */
const all_filter_BUTTONS = document.querySelectorAll("[button_group] button");

if (all_filter_BUTTONS.length > 0)
  set_active_to_filter_button(all_filter_BUTTONS[0]);

for (let i = 0; i < all_filter_BUTTONS.length; i++) {
  all_filter_BUTTONS[i].addEventListener("click", function () {
    set_active_to_filter_button(this);
  });
}

function set_active_to_filter_button(this_button) {
  for (let i = 0; i < all_filter_BUTTONS.length; i++) {
    all_filter_BUTTONS[i].classList.remove("active");
  }
  if (this_button !== undefined) this_button.className += " active";
}

/* the markers we want to render on the map */
let markersOnMap_array = []; // tel aviv, haifa //
let persons_arr = []; // avi levy, orna ben //
let semesters_arr = []; // "semester A" //

function generate_data_from_the_html() {
  generate_persons();
  generate_cities();
  generate_semesters();
}

function generate_persons() {
  let $persons;
  $persons = document.querySelectorAll("[persons] [data-item]");
  /* 1 of 3 -- persons */
  $persons.forEach((person) => {
    var obj = new Object();
    obj.city = get_Data_Attribute(person, "city");
    // name
    obj.name = get_Data_Attribute(person, "name");
    obj.name_he = get_Data_Attribute(person, "name_he");
    // position
    obj.position = get_Data_Attribute(person, "position");
    obj.position_he = get_Data_Attribute(person, "position_he");
    obj.semester = get_Data_Attribute(person, "semester");
    persons_arr.push(obj);
  }); /* end forEach */
}

function generate_cities() {
  let $cities;
  $cities = document.querySelectorAll("[cities] [data-item]");
  /* 2 of 3 -- cities */
  $cities.forEach((city) => {
    var obj = new Object();
    obj.city = get_Data_Attribute(city, "city");
    obj.city_he = get_Data_Attribute(city, "city_he");
    obj.location = [
      {
        lat: Number(get_Data_Attribute(city, "lat")),
        lng: Number(get_Data_Attribute(city, "lng")),
      },
    ];
    markersOnMap_array.push(obj);
  }); /* end forEach */
}

function generate_semesters() {
  let $semesters;
  $semesters = document.querySelectorAll("[semesters] [data-item]");
  /* 3 of 3 -- semesters */
  $semesters.forEach((semester, key) => {
    var obj = new Object();
    obj.name = get_Data_Attribute(semester, "name");
    obj.name_he = get_Data_Attribute(semester, "name_he");
    obj.key = key;
    semesters_arr.push(obj);
  }); /* end forEach */
}

/* HELPER */
function get_Data_Attribute(item, property_name) {
  const $this_node = item.querySelector(`[data-${property_name}]`);
  if ($this_node == null)
    console.error("get_Data_Attribute => No Property Named:" + property_name);
  if ($this_node !== null) return $this_node.dataset[property_name];
}

/*#######################################################################################
                                       2 of 4  - GOOGLE MAPS
  #########################################################################################*/

var map;
var InforObj = [];
let map_zoom_level = 5;
/* map deafult Coordinates loaction */
const centerCords = {
  lat: is_mobile ? 31.0 : 31.54,
  lng: 34.86864294563691,
};

const israel_BOUNDS = {
  west: 34.26,
  south: 29.18,
  east: 35.836,
  north: 35 /* bigger number show more from the top */,
};

async function addMarkers() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } =
    await google.maps.importLibrary("marker");

  let $show_b_btn;

  /* Create markers loop */
  for (var i = 0; i < markersOnMap_array.length; i++) {
    let persons_list_for_this_city = get_list_from_city(
      markersOnMap_array[i].city,
    );
    console.log(persons_list_for_this_city.length);

    // infoWindow
    const infoWindow = new InfoWindow({
      minWidth: 250,
    });

    // Marker Styles
    const pinBackground = new PinElement({
      scale: 1,
      background: "#4D0C48",
      glyphColor: "#4D0C48",
      borderColor: "#ffffff",
    });

    //    let contentString_semester_A = contentString = infoWindow_contentString(markersOnMap_array[i], "A");

    /* A. Create html data for the markers */
    let content_strings_for_each_semester = [];

    _.each(semesters_arr, (this_semester, key) => {
      /*render_infoWindow_contentString(city, sememster_name)*/
      const this_content = render_infoWindow_contentString(
        markersOnMap_array[i],
        this_semester.name,
      );
      content_strings_for_each_semester.push(this_content);
    }); /* end each semsester */

    let contentString_all_semesters = render_infoWindow_contentString(
      markersOnMap_array[i],
      "all",
    );

    infoWindow.setContent(contentString_all_semesters);

    /* B. generate markers position and label */
    if (persons_list_for_this_city.length > 0) {
      const marker = new AdvancedMarkerElement({
        position: markersOnMap_array[i].location[0],
        map: map,
        title: rtl ? markersOnMap_array[i].city_he : markersOnMap_array[i].city,
        content: pinBackground.element,
      });

      marker.addListener("click", function () {
        closeOtherInfo();
        infoWindow.open({
          anchor: marker,
          map,
        });
        InforObj[0] = infoWindow;
      });

      google.maps.event.addListener(map, "click", function (event) {
        infoWindow.close();
      });

      markers_google_maps_objects.push(marker);
    } else {
      console.error(
        "Marker not added => No persons under: ",
        markersOnMap_array[i].city,
      );
    }

    //**####### "click" type 1: setContent CLICK EVENTS (type 1 is to show/hide markers under initMap()) ##########**//
    const $show_all_btn = document.querySelector("[show_all]");

    if ($show_all_btn !== null) {
      $show_all_btn.addEventListener("click", (event) => {
        infoWindow.setContent(contentString_all_semesters);
      });
    }

    const content_inside_infoWindow_filter_BUTTONS = document.querySelectorAll(
      "[button_group] button:not([show_all])",
    );
    for (let i = 0; i < content_inside_infoWindow_filter_BUTTONS.length; i++) {
      content_inside_infoWindow_filter_BUTTONS[i].addEventListener(
        "click",
        function () {
          closeOtherInfo();
          infoWindow.setContent(content_strings_for_each_semester[i]);
        },
      );
    }
  } /* end marker creation loop */

  return markers_google_maps_objects;
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    mapId: "ab8da44af7b29d1",
    restriction: {
      latLngBounds: israel_BOUNDS,
      strictBounds: false,
    },
    clickableIcons: false, // this is to disable all labels icons except your custom infowindow or Infobox.
    zoom: is_mobile ? 7 : 7.9,
    zoomControl: true,
    maxZoom: 11,
    minZoom: 6,
    maxWidth: 300,
    disableDefaultUI: true, // a way to quickly hide all controls
    zoomControl: true,
    center: centerCords,
    //styles: ==>styles under Google Cloud Styles Editor //
  });

  let markers_after_init = await addMarkers();

  //**####### "click" type 2:  show/hide markers(type 1 is setContent inside infoWindow) ##########**//
  const $show_all_btn = document.querySelector("[show_all]");
  if ($show_all_btn !== null) {
    $show_all_btn.addEventListener("click", (event) => {
      show_all_markers(markers_after_init);
    });
  }

  let $show_a_btn = document.querySelector("[show_a]");

  const filter_marker_on_maps_BUTTONS = document.querySelectorAll(
    "[button_group] button:not([show_all])",
  );
  for (let i = 0; i < filter_marker_on_maps_BUTTONS.length; i++) {
    filter_marker_on_maps_BUTTONS[i].addEventListener("click", function () {
      if (semesters_arr[i] !== undefined) {
        show_only_semester_this_semester(
          markers_after_init,
          semesters_arr[i].name,
        );
      } else {
        console.error("No Such Semester", this.innerText);
      }
    });
  }
} /* end initmap();*/

/*## google maps helper functions ##*/
function show_only_semester_this_semester(markers_after_init, semester) {
  hide_all_Markers(markers_after_init);
  _.map(markers_after_init, (val, key) => {
    let semseter_a_in_this_city = semester_exist_in_this_city(key, semester);
    if (semseter_a_in_this_city) showMarker(val, map);
  });
}

function hide_all_Markers(markers_after_init) {
  _.map(markers_after_init, (val, key) => {
    hideMarker(val);
  });
}

function show_all_markers(markers_after_init) {
  _.map(markers_after_init, (val, key) => {
    showMarker(val, map);
  });
}

function closeOtherInfo() {
  if (InforObj.length > 0) {
    /* detach the info-window from the marker ... undocumented in the API docs */
    InforObj[0].set("marker", null);
    /* and close it */
    InforObj[0].close();
    /* blank the array */
    InforObj.length = 0;
  }
}

function hideMarker(marker) {
  marker.map = null;
}

function showMarker(marker, map) {
  marker.map = map;
}

/*#######################################################################################
                                      3 of 4 - Render InfoWindow
      #########################################################################################*/

//## Render 1 ## //
/*
  טריקי - יצרתי לופ שיוצר רשימה לכל עיר ופילטר -
  יהיה קשה מאוד ליצור כזה למקרה של גם וגם
  */
/* infoWindow_contentString */
function render_infoWindow_contentString(marker_on_the_map, filter = "all") {
  /** createElement **/
  const infowindow_content = document.createElement("div");
  infowindow_content.setAttribute("infoWindow", "infoWindow");
  infowindow_content.style.textAlign = rtl
    ? "right"
    : "left"; /*multi language */
  infowindow_content.style.direction = rtl ? "rtl" : "ltr"; /*multi language */
  infowindow_content.classList.add(rtl ? "info_window_rtl" : "info_window_ltr");
  render_infowindow_city_title(marker_on_the_map, infowindow_content);

  /** marker_on_the_map **/
  let persons_list_for_this_city = get_list_from_city(marker_on_the_map.city);
  let list = "";

  _.each(semesters_arr, (this_semester, key) => {
    /* filter */
    if (this_semester.name == semesters_arr[key].name) {
      render_infowindow_list(
        filter,
        key,
        persons_list_for_this_city,
        infowindow_content,
        this_semester,
      );
    }
  }); /* end each semsester */

  return infowindow_content;
}

//## Render 2 ## //
function render_infowindow_list(
  filter = "all",
  index_key,
  persons_list_for_this_city,
  infowindow_content,
  this_semester,
) {
  let once = 0;
  /* semster_wrapper */
  let semster_wrapper;
  let ul;

  _.each(persons_list_for_this_city, (this_person, key) => {
    /* [A,B,C] */

    if (this_person.semester == semesters_arr[index_key].name) {
      /*infowindow semesters title */
      if (once == 0) {
        /* semster_wrapper */
        semster_wrapper = document.createElement("div");
        semster_wrapper.setAttribute("semester", this_person.semester);
        ul = document.createElement("ul");
        /* FILTER - Case Example: if `eli cohen` from tel aviv semester is "A" => appendChild */
        if (this_person.semester == filter || filter == "all") {
          infowindow_content.appendChild(semster_wrapper);
        }
        /* semster title */
        render_infowindow_semester_title(this_semester, semster_wrapper);
        semster_wrapper.appendChild(ul);
        once++;
      }
      /* person infowindow html */
      render_infowindow_person_list_item(this_person, ul);
    }
  }); /* each */
}

//## Render 3 ## //
/* Render person infowindow html */
function render_infowindow_person_list_item(this_person, node) {
  let li = document.createElement("li");
  const person_positon = rtl
    ? this_person.position_he
    : this_person.position; /*multi language */
  const person_name = rtl
    ? this_person.name_he
    : this_person.name; /*multi language */
  li.innerHTML = `<span position_name>${person_positon}</span>: ${person_name}`;
  li.setAttribute("infowindow_semester_person_li", this_person.name);
  /* innerHTML  */
  node.appendChild(li);
}

//## Render 4 ## //
/* Render semester infowindow title */
function render_infowindow_semester_title(this_semester, node) {
  const $semester_title = document.createElement("h6");
  const content = rtl
    ? this_semester.name_he
    : this_semester.name; /*multi language */
  $semester_title.setAttribute("semester_title", content);
  $semester_title.innerHTML = `${content}`;
  node.appendChild($semester_title);
}

//## Render 5 ## //
/* Render city infowindow title */
function render_infowindow_city_title(this_city, node) {
  const city_title = document.createElement("h5");
  const content = rtl ? this_city.city_he : this_city.city; /*multi language */
  city_title.setAttribute("infowindow_city_title", content);
  city_title.innerHTML = `${content}`;
  node.appendChild(city_title);
}

/*#######################################################################################
                                      4 of 4 - Helper Functions
      #########################################################################################*/

/* check if semester exsist in a city */
function semester_exist_in_this_city(index, semester) {
  let persons_in_this_city = get_list_from_city(markersOnMap_array[index].city);

  let exist_arr = [];
  let is_exists;
  _.map(persons_in_this_city, function (person, key) {
    let exist = _.includes(person.semester, semester);
    exist_arr.push(exist);
    is_exists = _.includes(exist_arr, true);
    //console.log("semseter", semester, "in", markersOnMap_array[index].city, is_exists);
  }); /* end map */
  return is_exists;
}

/* check_if_semeter_exsist_for_a_city */
function check_if_semeter_exsist_for_a_city(
  persons_list_for_this_city,
  compare_value,
) {
  _.map(persons_list_for_this_city, function (person) {
    console.log("check", person);
    let exist = _.includes(person, compare_value);
    if (exist == true) {
    }
  });
}

/* get list of persons from_city */
function get_list_from_city(city) {
  /* Render InfoWindow Data */
  // case one - City and All Semesters //
  let city_persons_list;

  city_persons_list = _.filter(persons_arr, function (this_item) {
    if (this_item.city == city) {
      return true;
    }
  });
  return city_persons_list;
}

/*
                              let show_marker;
                            let compare_value = "red";

                            _.map(persons_list_for_this_city, function (person) {
                              let exist = _.includes(person, compare_value);
                              if(exist == true){
                                show_marker = true;
                              }
                            });

                            if(!show_marker)hideMarker(markers_after_init[1]);
                            */
