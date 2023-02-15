(function ($) {
  $(document).ready(function () {
    getProjects();
    setTimeout(function () {
      initPackery();
    }, 2000);
    initSlider();
    validEmail();
  });

  function initSlider() {
    $('.content-right .slider').slick({
      // vertical: true,
      // verticalSwiping: true,
      adaptiveHeight: true,
      nextArrow:
        '<button type="button" class="next-slide"><i class="fas fa-chevron-down" aria-hidden="true"></i></button>',
      prevArrow:
        '<button type="button" class="prev-slide"><i class="fas fa-chevron-up" aria-hidden="true"></i></button>',
    });
  }

  function validEmail() {
    $('[name="email"]').on('input', function () {
      testValidEmail($(this));
    });
    function testValidEmail(emailtest) {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (emailtest.val() != 0 && emailtest.val().length > 0) {
        if (pattern.test(emailtest.val())) {
          emailtest.attr({ style: 'border: 1px solid green' });
        } else {
          emailtest.attr({ style: 'border: 1px solid orange' });
        }
      }
    }
  }

  function getProjects() {
    $.getJSON('./js/json-handler.json', function (data) {
      var project = '';
      $.each(data, function (i, item) {
        project += '<div class="item hidden">';
        project += '<div class="img-holder">';
        project += '<img src="' + item.image + '" alt="">';
        project += '</div>';
        project += '<div class="hide-icons">';
        project += '<img src="./img/heart-icon.png" alt="">';
        project += '<img src="./img/eye-icon.png" alt="">';
        project += '</div>';
        project += '<div class="hide-content">';
        project +=
          '<div class="hide-content__info"><h5>' + item.title + '</h5>';
        project += '<p>' + item.description + '</p>';
        project += '</div>';
        project += '</div>';
        project += '</div>';
      });
      $('.latest-projects__content--items').append(project);
    });
  }

  function initPackery() {
    if ($('.latest-projects__content--items').get(0)) {
      var $container = $('.latest-projects__content--items').isotope({
        itemSelector: '.item',
        masonry: {
          columnWidth: 100,
          gutter: 26,
        },
      });

      var initShow = 7;
      var counter = initShow;
      var iso = $container.data('isotope');
      loadMore(initShow);

      function loadMore(toShow) {
        $container.find('.hidden').removeClass('hidden');
        var hiddenElems = iso.filteredItems
          .slice(toShow, iso.filteredItems.length)
          .map(function (item) {
            return item.element;
          });

        $(hiddenElems).addClass('hidden');
        $container.isotope('layout');
        if (hiddenElems.length == 0) {
          jQuery('#load-more').hide();
        } else {
          jQuery('#load-more').show();
        }
      }

      $container.after(
        '<div class="latest-projects__content--button"><button id="load-more" class="button">See All</button></div>'
      );

      $('#load-more').click(function () {
        counter = counter + initShow;
        loadMore(counter);
      });
    }
  }
})(jQuery);
