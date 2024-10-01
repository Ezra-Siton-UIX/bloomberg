document.addEventListener("DOMContentLoaded", (event) => {

  if(window.location.pathname !== "/cpe/boomboom/index.html"){



    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      'cmsload',
      (listInstances) => {
        console.log('cmsload Successfully loaded!');



        load_list_js_data();;



        // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
        const [listInstance] = listInstances;

        // The `renderitems` event runs whenever the list renders items after switching pages.
        listInstance.on('renderitems', (renderedItems) => {
          console.log(renderedItems);

        });
      },
    ]);




  }

  if(window.location.pathname == "/cpe/boomboom/index.html"){
    load_list_js_data();
  }


  function load_list_js_data(){
    const is_en = window.location.href.includes('/en') ||window.location.href.includes('cdpn');

    $("[list_js_list_class]").addClass("list_js_list_class"); 
    $("[fuzzy-search]").addClass("search__");
    $(".active_state").removeClass("active_state");
    $("[empty_list_message]").hide();


    const bogrim_program = is_en ? "Leadership Program" : "תכנית המנהיגות";
    const button_that_open_the_modal_text = is_en ? "Filters" : "סינון";

    const bogrim_program_filter_btn = $(`[data_filter_btn="${bogrim_program}"]`).closest(".w-dyn-item").show();


    const button_selector = "data_filter_btn";
    const filter_mode = "and" // "or", "and"
    const mayor_group_value = "Mayor";

    /*
                                          צריך לתרגם את מחזור 
                                          */

    /* ## 🤖🤖 IS MAYOR (Group Filter) ## */
    const is_mayor = [
      is_en ? "Mayor" : "ראש עיר",
      is_en ? "Mayor of Regional Council" : "ראש מועצה איזורית",
      is_en ? "Mayohttps://codepen.io/r of Local council" : "ראש מועצה מקומית"
    ]


    /* if we want the "all button" **works better with "or" mode */
    const show_all_button = false;
    if(show_all_button)$(`[filter_type][data_filter_btn="All"]`).css({"opacity": 1, "display": "initial"});
    if(show_all_button)$(`[filter_type][data_filter_btn="All"]`).addClass("active_state");


    let filter_query = {
      is_mayor:[
      ],
      role: [
      ],
      class: [
      ],
      team: [
      ],
      program: [
      ],
      location: [
      ],
    };


    function set_active_state(filter_mode, btn_filter_type, this_filter_value, filter_query, is_checkbox){

      if(is_checkbox){
        $(`[filter_type="${btn_filter_type}"]`).toggleClass("active_state");
        return;
      }

      switch (filter_mode) {
        case 'or':
          /* GUI update - or */
          $(`[filter_type="${btn_filter_type}"]`).removeClass("active_state");
          $(`[filter_type="${btn_filter_type}"][data_filter_btn="${this_filter_value}"]`).addClass("active_state");
          break;
        case 'and':
          /* GUI update - and */
          if(this_filter_value == "all" || filter_query[btn_filter_type].length == 0){
            $(`[filter_type="${btn_filter_type}"]`).removeClass("active_state");
            $(`[filter_type="${btn_filter_type}"][data_filter_btn="All"]`).addClass("active_state");
          }else{/* not all btn */
            console.table(filter_mode, btn_filter_type, this_filter_value);
            $(`[filter_type="${btn_filter_type}"][data_filter_btn="All"]`).removeClass("active_state");
            $(`[filter_type="${btn_filter_type}"][data_filter_btn="${this_filter_value}"]`).toggleClass("active_state");
          }
          break;
      }
    }


    $(`[${button_selector}]`).on('click', function() {
      console.clear();

      /* ## 1 - get btn values (value and type) ## */
      let this_filter_value = $(this).attr(button_selector);
      const btn_filter_type =  $(this).attr("filter_type");

      //console.log("btn_filter_type", btn_filter_type);
      // console.log("this_filter_value", this_filter_value);

      /* Toogle Mechanizem */
      const is_checkbox =  $(this).attr("checkbox") !== undefined ? true : false;
      if(is_checkbox){
        $(this).attr("data_filter_btn", this_filter_value == "true" ? "false" : "true");
      }

      /* ## 2 -😬😬😬😬😬  Set active state 😬😬😬😬😬 ## */
      if(this_filter_value.toLowerCase() == "all"){
        filter_query[btn_filter_type] = [];
      }else{
        switch (filter_mode) {
            /* 🥶🥶🥶🥶🥶🥶 */ 
          case 'or':
            filter_query[btn_filter_type] = [];
            filter_query[btn_filter_type].push(this_filter_value);
            break;
            /* 🤯🤯🤯🤯🤯🤯 */ 
          case 'and':
            /* ## 1 - check if the value already exists ## */
            //console.log("filter_query[btn_filter_type]", filter_query[btn_filter_type], "this_filter_value", this_filter_value)

            let is_filter_exist = filter_query[btn_filter_type].includes(this_filter_value); // true


            /* ## 👽👽 The value exist remove from => filter query ## */
            if(is_filter_exist){

              /* ## 🤖🤖 Toogle IS MAYOR ## */  
              if(btn_filter_type == "role"){

                filter_query["role"] = [];
              }

              /* no mayor - remove normally to the filter query */
              filter_query[btn_filter_type] = filter_query[btn_filter_type].filter(function (this_filter_query_value) {
                return this_filter_query_value !== this_filter_value;
              });


            }
            /* ## 👾👾 The value not exist add to => filter query ## */
            else{
              if(btn_filter_type == "role" && this_filter_value == mayor_group_value){
                is_mayor.forEach(function(is_mayor_v) {
                  filter_query["role"].push(is_mayor_v);
                });
              }else{
                /* no mayor - push normally to the filter query */
                filter_query[btn_filter_type].push(this_filter_value);
              }

            };

            if(is_checkbox && this_filter_value !== "false"){
              filter_query[btn_filter_type] = [];
              filter_query[btn_filter_type].push(this_filter_value);
            };

            break;
        }
      }

      /* 3 set active state (or -or- and) */
      set_active_state(filter_mode, btn_filter_type, this_filter_value, filter_query, is_checkbox);

      console.log(filter_query);

      if(btn_filter_type == "program" && this_filter_value == bogrim_program){
        filter_query[btn_filter_type] = [];

      }

      const this_query = buildFilter(filter_query);
      const result = filterData(list_js_data, this_query);
      //console.log(JSON.stringify(filter_query));
      list_js_data.sort("is_mayor");






      uptade_the_number_of_active_filters(false);



    });

    function uptade_the_number_of_active_filters(clear){
      /* count the num of active filters */
      let num_of_filters = 0;
      Object.entries(filter_query).forEach(([key, value]) => {
        if(value.length > 0){
          num_of_filters = num_of_filters + value.length
        }
      });

      /* prefare data */
      const $filter_btn_text_node = $("[filter_btn_text]");
      let filter_btn_text = num_of_filters > 0 ? `${button_that_open_the_modal_text} (${num_of_filters})` : button_that_open_the_modal_text;
      num_of_filters > 0 ? $filter_btn_text_node.text(`Filter (${num_of_filters})`) : $filter_btn_text_node.text(`${button_that_open_the_modal_text}(${num_of_filters})`);

      /* Update The UI */
      if(!clear){
        $("[filter_btn_text]").text(filter_btn_text);
      }else{
        $("[filter_btn_text]").text(button_that_open_the_modal_text);
      }
    }


    /* #################### 1 of 2 - pre step add class to data attributes for list js to work */

    $("[data-filter]" ).each(function( index ) {
      const this_filter_type = $( this ).attr("data-filter");
      const this_data_filter_node = $( this );

      this_data_filter_node.addClass(this_filter_type);

      /* add mayor or not to the list */
      if(this_filter_type == "role"){
        let compare_all_roles_arr = [];

        const this_filter_value = $( this ).attr("data-value");
        is_mayor.forEach(function(is_mayor_v) {
          if(this_filter_value == is_mayor_v){
            this_data_filter_node.after( "<p class='is_mayor' data-filter='0'>0</p>" );
            compare_all_roles_arr.push(0); /* true */
          }else{
            compare_all_roles_arr.push(1); /* not found */
          }
        });/* end loop is_mayor */

        const allEqual =
              arr => arr.every(v => v === arr[0]); /* if this role is not mayor, Mayor of Regional Council or Mayor of Local council*/
        if(allEqual(compare_all_roles_arr)){
          this_data_filter_node.after( "<p class='is_mayor' data-filter='1'>1</p>" );
        }

      }/* end filter type role */

      /* תכנית מנהיגות להוסיף את הדאטה ידנית */
      if(this_filter_type == "program"){
        const this_program_filter_node = $( this );
        console.log(this_program_filter_node.text().length);
        if(this_program_filter_node.text().length == 0){
          this_program_filter_node.text("");

        }
      }


    });


    /* #################### 2 of 2 - initialize list js object + sort */
    const list_js_options = {
      valueNames: [ 'name', 'role', 'program','location', 'class', 'is_mayor'],
      listClass: "graduates-list",

    };

    var list_js_data = new List('companies', list_js_options);
    list_js_data.sort("is_mayor");
    $("[total_list_items]").text(list_js_data.matchingItems.length);
    $("[result_count]").text(list_js_data.matchingItems.length);



    /* on load  */

    /* 🐩🐩🐩🐩🐩 HANDLE updated events 🐩🐩🐩🐩🐩🐩*/

    //const insert_before_node_not_mayor = $("[data-filter='role']").closest("li");

    list_js_data.on('filterStart', function ({matchingItems, filtered }) {
      //console.log("filterStart");
      $("[list_js_list_class] [list_card]").css("opacity", 0);
    });

    list_js_data.on('filterComplete', function ({matchingItems }) {
      //console.log("filterComplete");

      // Defining the function

      $("[list_js_list_class] [list_card]").css("opacity", 1);



    });

    /* ############################################
                            ############################################
                            ############################################
                            ############################################
                            ############################################
                            ################# updated ##########################
                            ############################################
                            ############################################
                            ############################################
                            ############################################
                            ############################################
                            */

    list_js_data.on('updated', function ({matchingItems, filtered, items  }) {
      console.log(items.length, matchingItems.length );
      const is_not_filtered = items.length == matchingItems.length

      is_not_filtered ? $("[clear_filters]").css("opacity", 0) : $("[clear_filters]").css("opacity", 1)


      $("[total_list_items]").text(list_js_data.matchingItems.length);
      $("[result_count]").text(list_js_data.matchingItems.length);

      uptade_the_number_of_active_filters(true)

      /* ## HANDEL EMPTY RESULTS ## */
      if(matchingItems.length == 0){
        $("[empty_list_message]").show();
      }else{
        $("[empty_list_message]").hide();
      }
      $("[insert_before]").hide();

      /* ADD TITLE BEFORE GROUP */
      insert_before_title();

    });

    function insert_before_title(){
      /* on load state */
      $("[insert_before]").hide();
      let insert_before_node_mayor = $(`.is_mayor[data-filter="0"]`).closest("[list_card]")
      let insert_before_node_not_mayor = $(`.is_mayor[data-filter="1"]`).closest("[list_card]")

      $( "[insert_before=mayor]" ).clone().insertBefore( insert_before_node_mayor.eq(0));
      $( "[insert_before=not-mayor]" ).clone().insertBefore( insert_before_node_not_mayor.eq(0));

      $( "[insert_before]" ).show();

      //$("<h1 insert_before>mayor</h1>").insertBefore( insert_before_node_mayor.eq(0));
      //$("<h1 insert_before>not-mayor</h1>").insertBefore( insert_before_node_not_mayor.eq(0) );
    }

    insert_before_title();


    /* ################# CLICK EVENTS ############### */
    $("[clear_filters]").on( "click", function() {
      /* reset query */
      filter_query = {
        is_mayor:[
        ],
        role: [
        ],
        class: [
        ],
        team: [
        ],
        program: [
        ],
        location: [
        ],
      };

      $(".active_state").removeClass("active_state");
      /* clear search */
      $("input[search]").val("")
      list_js_data.search(); // Show all items in list
      // Remove all filters
      list_js_data.filter(); 
    });





    $(".search__").on( "focus", function() {
      let this_text = $(this).val();
      list_js_data.fuzzySearch(this_text); 
    } );




    $( "[fs-cmsfilter-clear=name]" ).on( "click", function() {
      list_js_data.search(""); // Show all items in list
    } );






    /* REMOVE EMPTY Buttons (without any items) => usefull for webflow CMS */

    /* list.js remove empty filter btns */
    let all_categories_array = [];

    $("[data-filter=program]" ).each(function( index ) {
      let this_text = $( this ).text();
      all_categories_array.push(this_text);
    });


    $("[filter_type=program]:not([data_filter_btn=All])").closest(".w-dyn-item").hide();

    /* Show only categories with items (hide empty categories) */
    all_categories_array.forEach(function(program) {
      //console.log("all_categories_array", all_categories_array)
      /* hide webflow cms collection item */
      $(`[data_filter_btn="${program}"]`).closest(".w-dyn-item").show();
      $(`[data_filter_btn="${program}"]`).closest(".w-dyn-item").css("opacity", 1);
    });

    bogrim_program_filter_btn.closest(".w-dyn-item").show();
    bogrim_program_filter_btn.css("opacity", 1);










    /* on load change styles */
    $("[data_filter_btn=All]").addClass("is_active");
    $("[list_js_list_class] [list_card]").css("opacity", 1);
    $("[total_list_items]").css("opacity", 1);
    $("[meta_search_div]").css("opacity", 1);

    /* HELPER FUNCTIONS */

    /* ################# FILTERS ################# */
    buildFilter = (filter) => {
      /* code reference: Tyler Burdsall - Medium:
                                                        https://tylerburdsall.medium.com/building-a-dynamic-filter-with-es6-javascript-71dfeb50c371
                                                        */
      let query = {};
      for (let keys in filter) {
        //console.log(keys, filter[keys], filter, query[keys], filter[keys])
        if ( (filter[keys].constructor === Object) || (filter[keys].constructor === Array && filter[keys].length > 0)) {
          query[keys] = filter[keys];
        }
      }
      return query;
    };
    filterData = (data, query) => {
      /* code reference: Tyler Burdsall - Medium:
                                                        https://tylerburdsall.medium.com/building-a-dynamic-filter-with-es6-javascript-71dfeb50c371
                                                        */
      const keysWithMinMax = [
        'listPrice',
        'bedrooms'
      ];
      const filteredData = list_js_data.filter((this_item) => {
        const list_js_item = this_item._values;/*list js data */

        for (let key in query) {
          //console.log(query[key], list_js_item[key]);

          if (list_js_item[key] === undefined) {/* if 1 */
            return false;
          }
          else if (keysWithMinMax.includes(key)) {
            if (query[key]['min'] !== null && list_js_item[key] < query[key]['min']) {
              return false;
            }
            if (query[key]['max'] !== null && list_js_item[key] > query[key]['max']) {
              return false;
            }
          }
          else if (!query[key].includes(list_js_item[key])) {/* if 3 */
            return false;
          }
        }/* end inner loop */

        /* 2 of 2 - return true */
        return true;
      });
      return filteredData;
    };

    /* ## Disable form feild form subbmition ## */
    $('[search_form]').submit(function() {
      return false;
    });


  }/* close load list js function */


});/* end DOMContentLoaded */
