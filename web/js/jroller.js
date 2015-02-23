/**
 * Catching errors from XHR-Requests
 */
jQuery(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
  console.log(event, jqxhr, settings, thrownError);

  var text = '[!!] Error';
  if(jqxhr.responseText) {
    var data  = jQuery.parseJSON(jqxhr.responseText);
    if(data.errorMsg) {
      text += ': ' + data.errorMsg;
    }
  }

  alert(text);
});

jQuery().ready(function(){

	// Browser switching
	$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	$.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());

  /**
   * Sortable tree management
   */
  $( "ol.is-sortable" ).sortable({
    containment: "parent",
    cursor: "move",
    distance: 5,
    tolerance: "pointer",
    axis: "y",
    update: function(event, ui) {
      var list = $(this);
      var listParams = list.sortable('serialize');
      var url = ui.item.data('change-url');

      list.addClass('on-load');
      $.post(url, listParams)
        .fail(function(data) {
          list.addClass('error');
        })
        .always(function(){
          list.removeClass('on-load');
        });
    }
  });

  $("#sf_admin_actions_menu_list").buttonset();
  $("#sf_admin_actions_menu_list a").button();

	$(window).on('load', function () {
		var widgets = $('#dashboard div.sf_admin_list.ui-grid-table');
		var heights = [];

		widgets.each(function(idx) {
			heights[idx] = $(this).parent('.widget_container').height();
		});

		$.each(heights, function( idx, height ) {
			$(widgets.get(idx)).find('table').height(height - 30); // Caption height will not calculate in total height
			if($.browser.mozilla) {
				$(widgets.get(idx)).find('table tbody').height(height - 40); // For FireFox :-<
			}
		});

	});

	// theme switcher
	if ($('#switcher').length)
	{
	  $('#switcher').themeswitcher();
	}

  // all hover and click logic for buttons
  $(".fg-button:not(.ui-state-disabled)")
  .hover(
      function(){
          $(this).addClass("ui-state-hover");
      },
      function(){
          $(this).removeClass("ui-state-hover");
      }
  )
  .mousedown(function(){
          $(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
          if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){$(this).removeClass("ui-state-active");}
          else {$(this).addClass("ui-state-active");}
  })
  .mouseup(function(){
      if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
          $(this).removeClass("ui-state-active");
      }
  });

	/*
		Javascript for list view only
	*/
	if ($('.sf_admin_list').length)
	{
		// actions menu on list view
		$('#sf_admin_actions_button').menu({ 
			content: $('#sf_admin_actions_menu').html(),
			showSpeed: 300
		});
		
		// filter button to show the modal window of available filters
		$('#sf_admin_filter_button')
			.addClass('sf_button-toggleable')
			.click(function(e) {
			  e.preventDefault();
				$('.sf_admin_filter').dialog('isOpen') ? $('.sf_admin_filter').dialog('close') : $('.sf_admin_filter').dialog('open');
			});

		// modal window for filters
		$('.sf_admin_filter').dialog({
			autoOpen: false,
			width: 600,
			close: function(evt, ui){
				$('#sf_admin_filter_button').removeClass('ui-state-active');
			},
			open: function(evt,ui){
				$('#sf_admin_filter_reset, #sf_admin_filter_submit').hide();
				$('#sf_admin_filter_button').addClass('ui-state-active');
			},
			buttons: {
				"Suchen": function() { 
					$(this).dialog("close"); 
					$('#sf_admin_filter_submit').parents('form').submit();
				}, 
			}
		});
    
    
   // boolean change
   
   $('body').on("click", 'td.sf_admin_boolean a', function(){
      
      var $target = $(this);
      var url = $target.attr("href");
      var $cell = $target.parent();
      
      $cell.html("--");
		  $cell.load( url);
      
      return false;
		});

		// toggle table visibility on caption title
		$('.sf_admin_list caption h1').click(function(){
      var table = $(this).parents('table');
      table.find('thead, tbody, tfoot').toggle();

			var tableHeight;
			if(table.data('old-height')) {
				tableHeight = table.data('old-height');
				table.data('old-height', 0);
			} else {
				tableHeight = 'auto';
				table.data('old-height', table.get(0).style.height);
			}

			table.css('height', tableHeight);

		  //$('.sf_admin_list table tbody, .sf_admin_list table thead, .sf_admin_list table tfoot').toggle();
		});

		// mouseover and click on table row
		$('.sf_admin_list table tbody tr')
		.hover(
			function() {
			  $(this).addClass('ui-state-hover');
			},
			function() {
			  $(this).removeClass('ui-state-hover');
			}
		)
		.click(function(e) {
			// change row color
			$(this).toggleClass('ui-state-highlight');
			// change checkbox status
			var chx = $(this).find('input:checkbox');
			if ($(this).hasClass('ui-state-highlight')) $(chx).attr('checked','checked');
			else $(chx).removeAttr('checked');
		});

    // batch actions
    $('.sf_admin_batch_actions_choice select').selectmenu({
      style: 'dropdown',
      width: 200
    });
	}

	/*
		Javascript for form view only
	*/
	if ($('.sf_admin_form').length)
	{
    // tabs for form edition
    $('#sf_admin_form_tab_menu').tabs().removeClass('ui-widget-content');// //addClass('ui-tabs-vertical ui-helper-clearfix');
    //$('#sf_admin_form_tab_menu li').removeClass('ui-corner-top').addClass('ui-corner-all');
    $( "#sf_admin_form_tab_menu > ul" ).removeClass("ui-corner-all").addClass("ui-corner-top");
    $( "#sf_admin_form_tab_menu .ui-tabs-panel" ).removeClass("ui-corner-all");

    // default size for input
    $('input[type="text"], input[type="password"]').each(function(){
      if ($(this).attr('size') == 0 || $(this).attr('size') == 20) {
        $(this).attr({ size: 60 });
      }
    });

    // default size for textarea
    $('textarea').each(function(){
      if ($(this).attr('rows') == 4 && $(this).attr('cols') == 30) {
        $(this).attr({ cols: 58, rows: 5 });
      }
    });

    // added focused state to inputs
    $(':input')
    .focus(function() {
			//$(this).closest('.sf_admin_form_row').addClass('focused ui-state-active ui-corner-all');
			//$(this).closest('.sf_admin_form_row').addClass('focused ui-state-default ui-corner-all');
			$(this).closest('.sf_admin_form_row:not(.ui-state-error)').addClass('focused ui-state-highlight ui-corner-all');
		})
		.blur(function() {
			//$(this).closest('.sf_admin_form_row').removeClass('focused ui-state-active ui-corner-all');
			//$(this).closest('.sf_admin_form_row').removeClass('focused ui-state-default ui-corner-all');
			$(this).closest('.sf_admin_form_row:not(.ui-state-error)').removeClass('focused ui-state-highlight ui-corner-all');
		});

		// check error messages in all tabs
		$('.ui-tabs-panel:has(span.ui-icon-alert)').each(function(i) {
		  $('.ui-tabs-nav a[href=#' + this.id + ']').prepend('<span class="ui-state-error-text"><span class="ui-icon ui-icon-alert floatright"></span></span>');
		});
	}

    // Buttons
    $('#sf_admin_filters_buttons')
          .buttonset();
    $('.sf_admin_actions_form a, .sf_admin_actions_form button, .sf_admin_td_actions a,  #sf_admin_filters_buttons a')
      .each(function() {
        $(this)
          .button({
          icons: {
            // Extracts icon name from class attribute
            primary: this.className.match(/ui-icon-[\S]+/)
          }
        })
        // To create buttons with rounded corners remove the following line
        .removeClass('ui-corner-all');

        if($(this).hasClass('disabled'))
        {
          $(this).button('disable');
        }
      });
});
