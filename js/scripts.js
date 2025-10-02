function expandScreen() {
  $("#game-area").addClass("iframe-full");
  $("html").css("overflow", "hidden");
  $("#close_fullscreen").show();
}

function closeFullScreen(e) {
  $("#game-area").removeClass("iframe-full");
  $("html").css("overflow", "");
  $(e).hide();
}

function remove_wishlist_cookies(_id) {
  if (!!jQuery.cookie("favorite_game") && _id !== "") {
    var favorite_array = JSON.parse(jQuery.cookie("favorite_game"));
    jQuery.each(favorite_array, function (key, value) {
      favorite_array = favorite_array.filter(function (element) {
        return element !== undefined;
      });
      if (value.id === _id && key > -1) {
        favorite_array.splice(key, 1);
      }
    });
    jQuery.cookie("favorite_game", JSON.stringify(favorite_array), {
      expires: 30,
      path: "/",
    });
    $(".favorites-add-" + _id).removeClass("favorited");
    $(".favorites-add-" + _id).html(
      '<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span> <span class="btn__text add-favorites-label">Add to Favorites</span>'
    );
    load_wishlist_cookies();
  }
}

function save_wishlish_cookies(_id, _slug, _image, _name, _state, _ratescore) {
  var favorites_count = 9;
  if (
    !!jQuery.cookie("favorite_game") &&
    _slug !== "" &&
    _image !== "" &&
    _id !== "" &&
    _name != "" &&
    _ratescore != "" &&
    _state != ""
  ) {
    var favorite_array = JSON.parse(jQuery.cookie("favorite_game"));
    let circle_html = "";
    jQuery.each(favorite_array, function (key, value) {
      if (value !== undefined && value.slug === _slug && key > -1) {
        favorite_array.splice(key, 1);
      }
    });
    favorite_array.push({
      id: _id,
      slug: _slug,
      image: _image,
      ratescore: _ratescore,
      state: _state,
      name: _name,
    });
    if (favorite_array.length > favorites_count) {
      favorite_array.shift();
    }
    jQuery.cookie("favorite_game", JSON.stringify(favorite_array), {
      expires: 30,
      path: "/",
    });
  } else {
    var data = [];
    data.push({
      id: _id,
      slug: _slug,
      image: _image,
      ratescore: _ratescore,
      state: _state,
      name: _name,
    });
    jQuery.cookie("favorite_game", JSON.stringify(data), {
      expires: 30,
      path: "/",
    });
  }
  load_wishlist_cookies();
}

function callback(event) {
  lazyLoad();
}

function copyToClipboard(element, e) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).val()).select();
  document.execCommand("copy");
  $(e).html("COPIED!!");
  setTimeout(function () {
    $(e).html("Copy");
  }, 3000);
  $temp.remove();
}

function favorite(e) {
  var image = $(e).data("image");
  var id = $(e).data("id");
  var slug = $(e).data("slug");
  var name = $(e).data("name");
  var state = $(e).data("state");
  var ratescore = $(e).data("ratescore");
  var favorited;
  if ($(e).hasClass("favorited")) {
    remove_wishlist_cookies(id);
    favorited = true;
    $(e).removeClass("favorited");
  } else {
    save_wishlish_cookies(id, slug, image, name, state, ratescore);
    $(e).addClass("favorited");
    favorited = false;
  }
  notifical_show(id, name, image, slug, favorited, e);
}

function open_fullscreen() {
  let game = document.getElementById("game-area");
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (game.requestFullscreen) {
      game.requestFullscreen();
    } else if (game.msRequestFullscreen) {
      game.msRequestFullscreen();
    } else if (game.mozRequestFullScreen) {
      game.mozRequestFullScreen();
    } else if (game.webkitRequestFullscreen) {
      game.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


jQuery(document).ready(function ($) {
  // Handle form submit
  $('#search-form').on('submit', function(e) {
    e.preventDefault();
    const searchValue = $('#input-search').val().trim();
    if (searchValue) {
      window.location.href = '/search?q=' + encodeURIComponent(searchValue);
    }
    return false;
  });

  // Handle input changes for button state
  $('#input-search').on('input', function() {
    const searchValue = $(this).val().trim();
    $('#button-search').prop('disabled', !searchValue);
  });
});

jQuery(document).ready(function ($) {
	
  lazyLoad();
  // slider_js();
  //slider_menu_js();
  load_wishlist_cookies();
 
  var btn = $("#back-to-top");
  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });
  btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      "300"
    );
  });
  $(".scrollTo").on("click", function (e) {
    e.preventDefault();
    var target = $(this).attr("data-target");
    let id_target = $("#" + target);
    $("html, body").animate(
      {
        scrollTop: id_target.offset().top,
      },
      500,
      "swing"
    );
  });

  $("button.svelte-1vb2u1t").click(function () {
    $(
      "div.text-box.svelte-1vb2u1t div.text-box-container div.text-description"
    ).toggleClass("isExpanded");
    if (
      $(
        "div.text-box.svelte-1vb2u1t div.text-box-container div.text-description"
      ).hasClass("isExpanded")
    ) {
      $(this).text("Show less");
    } else {
      $(this).text("Show more");
    }
  });

  menu_header();
  hide_show_content();
  change_theme();
  slide_game();
  game_share();


  function game_share() {
    close_popup();
    $("._share_btn").click(function () {
      open_popup();
    });
    $(".popup-close").click(function () {
      close_popup();
    });
    $(".popup-bg").click(function () {
      close_popup();
    });
  }

  function open_popup() {
    $(".popup-bg").show();
    $(".popup-share").show();
    $(".share_social_list").find(".st-btn").addBack().show();
    $("html").css("overflow", "hidden");
  }

  function close_popup() {
    $(".popup-bg").hide();
    $(".popup-share").hide();
    $("html").css("overflow", "");
  }


  function hide_show_content() {
    let height_content = $(".content-inner .game-description").outerHeight();

    if (height_content <= 549) {
      $(".show_content").css({ display: "none" });
      $(".content-inner").css({ "padding-bottom": "20px" });
      $(".content-inner").attr(
        "style",
        "height:" + (height_content + 24) + "px"
      );
    } else {
      $(".content-inner").attr("style", "height:500px;overflow:hidden");
      $(".show_content").css({ display: "flex" });
      $(".game-content-page").css({ "padding-bottom": "60px" });
      $(".game-description").css({ "padding-bottom": "20px" });
    }

    $(".ShowMore_button").click(function () {
      if ($(".ShowMore_button").hasClass("more")) {
        $(".ShowMore_button").removeClass("more");
        $(".content-inner").animate(
          {
            height: height_content + "px",
            overflow: "hidden",
            animation: "height 1000ms ease 0ms",
          },
          {
            easing: "swing",
            complete: function () {
              $(".content-inner").attr("style", "height:auto");
              $(".ShowMore_button").html(
                '<span>Show less</span> <span class="svg-icon svg-icon--share btn__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/></svg></span>'
              );

              $(".ShowMore_button").addClass("less");
            },
          }
        );
      } else {
        $(".ShowMore_button").removeClass("less");
        $(".content-inner").animate(
          {
            height: "500px",
            overflow: "hidden",
            animation: "height 1000ms ease 0ms",
          },
          {
            easing: "swing",
            complete: function () {
              $(".content-inner").attr("style", "height:550px;overflow:hidden");
              $(".ShowMore_button").html(
                '<span>Show more</span> <span class="svg-icon svg-icon--share btn__icon" aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/></svg> </span>'
              );

              $(".ShowMore_button").addClass("more");
            },
          }
        );
      }
    });
  }

  function menu_header() {
    $(".header-menu-button").click(function () {
      if ($(window).width() < 900) {
        $("aside.custom-scrollbar").toggleClass("mobile-open");
        $(".backdrop").toggleClass("mobile-open");
        if ($("aside.custom-scrollbar").hasClass("mobile-open")) {
//           $(this).find(".menu-mobile").find("svg").attr("style", "fill: #fff");
          $("#main-content").addClass("open");
        } else {
          $(this)
            .find(".menu-mobile")
            .find("svg")
//             .attr("style", "fill: #fff; transform: rotateY(180deg);");
          $("#main-content").removeClass("open");
        }
      } else {
        $("aside.custom-scrollbar").toggleClass("open");
        if ($("aside.custom-scrollbar").hasClass("open")) {
//           $(this).find(".menu").find("svg").attr("style", "fill: #fff;");
          $("#main-content").addClass("open");
        } else {
          $(this)
            .find(".menu")
            .find("svg")
//             .attr("style", "fill: #fff; transform: rotateY(180deg);");
          $("#main-content").removeClass("open");
        }
      }
    });
    $(".backdrop").click(function () {
      if ($(this).hasClass("mobile-open")) {
        $("aside.custom-scrollbar").removeClass("mobile-open");
        $(this).removeClass("mobile-open");
        $("#main-content").addClass("open");
        $(".header-menu-button")
          .find(".menu-mobile")
          .find("svg")
//           .attr("style", "fill: #fff; transform: rotateY(180deg);");
      }
    });
    // aside fit top
    let height_menu = $("header.svelte-14w8umz").outerHeight();
    $(window).scroll(function () {
      if ($(window).scrollTop() > height_menu) {
        $(".custom-scrollbar .menu").css("padding-top", "0px");
      } else {
        $(".custom-scrollbar .menu").css("padding-top", height_menu + 8 + "px");
      }
    });
  }

  function slide_game() {
    $("#gamesFeatured").slick({
      infinite: true,
      variableWidth: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      focusOnSelect: true,
      prevArrow: $(".slide_featured_left"),
      nextArrow: $(".slide_featured_right"),
    });
    $("#game_slide_hot .games_slide_hot").slick({
      infinite: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      focusOnSelect: true,
      autoplay: true,
      speed: 1500,
      autoplaySpeed: 2000,
      prevArrow: $("#game_slide_hot .btn-left"),
      nextArrow: $("#game_slide_hot .btn-right"),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    });
    $(window).resize(function () {
      $("#game_slide_hot .games_slide_hot")
        .not(".slick-initialized")
        .slick("resize");
    });

    $(window).on("orientationchange", function () {
      $("#game_slide_hot .games_slide_hot")
        .not(".slick-initialized")
        .slick("resize");
    });
    $("#game_slide_hot .games_slide_hot").on(
      "beforeChange",
      function (event, slick, currentSlide, nextSlide) {
        lazyLoad();
      }
    );
    $("#game_slide_hot .games_slide_hot").on(
      "afterChange",
      function (event, slick, currentSlide, nextSlide) {
        lazyLoad();
      }
    );
    $("#newGames").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      focusOnSelect: true,
      prevArrow: $(".slide_new_left"),
      nextArrow: $(".slide_new_right"),
    });
  }

  function lazyLoad() {
    $(".lazy").Lazy({
      effect: "fadeIn",
      effectTime: 300,
    });
  }

  var gameShare = document.querySelectorAll("._game-share");
  gameShare.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      if (navigator.share) {
        navigator
          .share({
            title: document.title,
            url: location.href,
          })
          .then(function () {})
          ["catch"](console.error);
      } else {
      }
    });
  });

  function notifical_show(id, name, image, slug, favorited, e) {
    let str = "";
    str +=
      '<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span><span class="btn__text add-favorites-label">' +
      (favorited == true ? "Add" : "Remove") +
      " to Favorites</span>";
    $(e).html(str);
    let html = "";
    html +=
      '<div class="wrapper notification-success"> <div class="toastt"> <div class="content"> <div class="icon"><img width="50" height="50" src="' +
      image +
      '" class="img-fluid" /></div> <div class="details"> <span>' +
      (favorited == true ? "Remove" : "Add") +
      " Success</span> <p>" +
      name +
      "</p> </div> </div> </div> </div>";
    $("body").one("click", e, function () {
      notification(html, 1000);
    });
  }

  function notification(s, time) {
    $(s)
      .appendTo("body")
      .fadeTo(time, 1, function () {
        $(this).fadeTo(1000, 0, function () {
          $(this).addClass("hide");
          $(this).remove();
        });
      });
  }

  function load_wishlist_cookies() {
    if (!!jQuery.cookie("favorite_game")) {
      var favorites = JSON.parse(jQuery.cookie("favorite_game"));
      let circle_html = "";
      if (favorites.length > 0) {
        //Load checked compare
        var str_wishlist = "";
        let str = "";
        var $leng = favorites.length;

        var slug_array = [];
        let label_game = "";
        for (var i = $leng - 1; i >= 0; i--) {
          var value = favorites[i];
          slug_array.push(value.slug + "_" + value.kind);
          if (value.state == "hot") {
            label_game = "GameLabel_hot__cd7o3";
          } else if (value.state == "new") {
            label_game = "GameLabel_new__ZOGIJ";
          } else if (value.state == "trending") {
            label_game = "GameLabel_top-rated__etkoJ";
          }
          //str_wishlist += '<a href="/' + value.slug + '" class="card"> <picture> <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="' + value.image + '" alt="' + value.name + '" class="lazy img-fluid"> </picture> <div class="card-body"> <h3>' + value.name + '</h3> </div> </a>'

          if (value.state) {
            str_wishlist +=
              '<li class="games__item"><div class="snippet"><a href="/' +
              value.slug +
              '" title="' +
              value.name +
              '" class="snippet__url"><span class="badge badge--' +
              value.state +
              '">' +
              value.state +
              '</span><span class="snippet__img-wrap" data-index="' +
              value.id +
              '"><img class="snippet__img" src="' +
              value.image +
              '" width="170" height="134" alt="' +
              value.slug +
              '" style=""></span><span class="snippet__name">' +
              value.name +
              '</span><span class="snippet-tag--rating info-rate"><span class="svg-icon svg-icon--info-rating snippet-tag__icon" aria-hidden="true"><svg class="svg-icon__link"><use xlink:href="#icon-star-full"></use></svg></span>' +
              value.ratescore +
              "</span></a></div></li>";
          } else {
            str_wishlist +=
              '<li class="games__item"><div class="snippet"><a href="/' +
              value.slug +
              '" title="' +
              value.name +
              '" class="snippet__url"><span class="snippet__img-wrap" data-index="' +
              value.id +
              '"><img class="snippet__img" src="' +
              value.image +
              '" width="170" height="134" alt="' +
              value.slug +
              '" style=""></span><span class="snippet__name">' +
              value.name +
              '</span><span class="snippet-tag--rating info-rate"><span class="svg-icon svg-icon--info-rating snippet-tag__icon" aria-hidden="true"><svg class="svg-icon__link"><use xlink:href="#icon-star-full"></use></svg></span>' +
              value.ratescore +
              "</span></a></div></li>";
          }
          if (
            value.slug === current_slug &&
            !$(".favorites-add-" + value.id).hasClass("favorited")
          ) {
            $(".favorites-add-" + value.id).addClass("favorited");
          }
        }
        if ($(".favorites_btn").hasClass("favorited")) {
          str =
            '<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span></i> <span class="btn__text add-favorites-label">Remove to Favorites</span>';
        } else {
          str =
            '<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span> <span class="btn__text add-favorites-label">Add to Favorites</span>';
        }
        $(".favorites_btn").html(str);
        if ($leng > 0) {
          circle_html +=
            '<span class="nav-badge favourites_qty">+' + $leng + "</span>";
        }
        if ($(".favorite_link").find(".favourites_qty").length > 0) {
          $(".favorite_link").find(".favourites_qty").remove();
          $(".favorite_link").append(circle_html);
        }
        let html = "";
        if (str_wishlist != "") {
          jQuery("#favoriteGames").html(str_wishlist);
        }
        $(".empty_favorite").hide();
      } else {
        circle_html += "";
        $(".empty_favorite").show();
        $(".empty_favorite").html("<center>No favorite game</center>");
        jQuery("#favoriteGames").html("");
      }

      /*var $listItems = $('#number-favorite > div');

        $listItems.each(function (id) {
            $listItems.eq(id).remove();

        });
        $('#number-favorite').append(circle_html);*/
      jQuery(".favorite-link .count_num").html(circle_html);
    } else {
      $(".empty_favorite").show();
      $(".empty_favorite").html("<center>No favorite game</center>");
      jQuery("#favoriteGames").html("");
    }
  }

  function change_theme() {
    var dark_theme_css = document.getElementById("dark_theme_css");
    var theme_css_ctrls = document.querySelectorAll('[name="fgbtheme"]');

    function cssThemeSwitcher() {
      var theme = "light";
      theme_css_ctrls.forEach(function (ctrl) {
        if (ctrl.checked) {
          theme = ctrl.value;
        }
      });
      if ("dark" === theme) {
        dark_theme_css.setAttribute("media", "all");
      } else {
        dark_theme_css.setAttribute("media", "none");
      }
    }

    if (dark_theme_css && theme_css_ctrls) {
      theme_css_ctrls.forEach(function (ctrl) {
        ctrl.addEventListener("change", cssThemeSwitcher);
      });
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme_css_ctrls.forEach(function (ctrl) {
          if ("dark" === ctrl.value) {
            ctrl.checked = true;
          } else {
            ctrl.checked = false;
          }
        });
      }
    }
  }

  function toggleAside() {
    document.body.classList.toggle("aside-opened");
  }

  var asideTriggers = document.querySelectorAll("._aside_trigger");
  if (asideTriggers) {
    asideTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", toggleAside);
    });
  }

  var modals = document.querySelectorAll(".modal-overlay");
  var openModals = document.querySelectorAll("._open_modal");
  var closeModals = document.querySelectorAll("._close_modal");

  function openModalsFn(id) {
    var modal = document.getElementById("modal_" + id);
    if (modal) {
      modal.classList.add("is-opened");
      modal.addEventListener("click", closeModalOverlay);
    }
  }

  function closeModalOverlay(event) {
    if (event.target.closest(".modal")) {
      return;
    }
    closeModalsFn();
  }

  function closeModalsFn() {
    modals.forEach(function (modal) {
      modal.classList.remove("is-opened");
      modal.removeEventListener("click", closeModalOverlay);
    });
  }

  if (openModals) {
    openModals.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        openModalsFn(this.getAttribute("data-modal"));
      });
    });
    closeModals.forEach(function (btn) {
      btn.addEventListener("click", closeModalsFn);
    });
  }

  load_menu_css();

  function load_menu_css() {
    jQuery(".custom-scrollbar .menu a .item").removeClass("active");
    var href = window.location.href;
    var path_name = window.location.pathname;
    jQuery(".custom-scrollbar .menu a").each(function (e) {
      var current_url = jQuery(this).attr("href");
      if (
        href == current_url ||
        href == current_url + "/" ||
        path_name == current_url
      ) {
        jQuery(this).find(".item").addClass("active");
      }
    });
  }

  function add_iframe() {
    let isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    let link_iframe = "";
    let html = "";
    let height = "";
    let width = "";
    let _isOpen = false;


	const style = document.createElement('style');
	style.textContent = `
	  .no-select {
		-webkit-touch-callout: none !important;
		-webkit-user-select: none !important;
		-khtml-user-select: none !important;
		-moz-user-select: none !important;
		-ms-user-select: none !important;
		user-select: none !important;
	  }
	  .no-select * {
		-webkit-touch-callout: none !important;
		-webkit-user-select: none !important;
		-khtml-user-select: none !important;
		-moz-user-select: none !important;
		-ms-user-select: none !important;
		user-select: none !important;
	  }
	`;
	document.head.appendChild(style);



    $("#show-embed").click(function () {
      link_iframe = $(this).attr("data-src");
      width = $(this).attr("data-width");
      height = $(this).attr("data-height");
      html =
        '<iframe class="game-iframe" loading="lazy" id="game-area" src="' +
        link_iframe +
        '" width="' +
        width +
        '" height="' +
        height +
        '" scrolling="none" frameborder="0" allowfullscreen> </iframe>';
      if (isMobile) {
        $("#game-code").css("display", "none");
        $("body").addClass("isFullscreen");
        $(".game_area_frame").addClass("frame_fix_mobile");
        $(".close_mobile_box").removeClass("hide");
        if (_isOpen) {
          $(".game-preview").css("display", "none");
          $("#game-code-mobile").css("display", "block");
        } else {
          $("#game-code-mobile").html(html);
          _isOpen = true;
          $(".game-preview").css("display", "none");
          $("#game-code-mobile").css("display", "block");
        }
		  
// 		  new code
		   $(".game_area_frame").addClass("no-select");
		  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
		  
		   $(".game_area_frame").on("load", function() {
      const iframeDocument = this.contentDocument || this.contentWindow.document;
      const iframeWindow = this.contentWindow;

      $(iframeDocument).on("touchstart touchend touchmove", preventDefaults);
      $(iframeDocument).on("contextmenu", preventDefaults);
      
      // Disable text selection in the iframe
      $(iframeDocument.body).addClass("no-select");
      
      // Prevent long touch from triggering text selection
      iframeWindow.addEventListener('selectstart', preventDefaults);
      
      // Disable zoom
      $(iframeDocument.head).append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
    });
		  
		  
      } else {
        $("#game-code-mobile").css("display", "none");
        $("body").removeClass("isFullscreen");
        $(".game_area_frame").removeClass("frame_fix_mobile");
        $(".close_mobile_box").addClass("hide");
        $("#game-code").html(html);
        $(".game-preview").css("display", "none");
        $("#game-code").css("display", "block");
      }
    });

    $("#mobile-nav").click(function () {
      $("body").removeClass("isFullscreen");
      $(".game_area_frame").removeClass("frame_fix_mobile");
      $(".close_mobile_box").addClass("hide");
      $(".game-preview").css("display", "block");
      $("#game-code-mobile").css("display", "none");
    });
  }

  add_iframe();
});
