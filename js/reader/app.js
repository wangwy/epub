FP.app = {};

FP.app.init = (function ($) {

  var Book;

  function init(bookURL) {
    var search = window.location.search.match(/book=(.*)/),
        bookURL = bookURL || (search ? search[1] : "moby-dick");

    //-- Setup the browser prefixes
    FP.core.crossBrowserColumnCss();

    if (localStorage.getItem("bookURL") === null ||
        localStorage.getItem("bookURL") != bookURL) {

      localStorage.setItem("bookURL", bookURL);
      localStorage.setItem("spinePos", 0);
    }

    //-- Set up our sidebar
    $("#main").width($(window).width() - 40);


    Book = new FP.Book("area", bookURL + "/");
    //Book = new FP.Book("area", "/the-hound-of-the-baskervilles/");

    Book.listen("book:metadataReady", meta);
    Book.listen("book:tocReady", toc);

    //-- Wait for Dom ready to handle jquery
    $(function () {
      controls();
    });


  }

  function meta() {
    var title = Book.getTitle();
    author = Book.getCreator(),
        $title = $("#book-title"),
        $author = $("#chapter-title");

    document.title = title + " – " + author;
    $title.html(title);
    $author.html(author);

  }

  function toc() {
    var contents = Book.getTOC();
    $toc = $("#toc");

    $toc.empty();

    contents.forEach(function (item) {
      $wrapper = $("<li>");

      $item = $("<a href='#" + item.href + "' data-spinepos='" + item.spinePos + "'>" + item.label + "</a>");

      $item.on("click", function (e) {
        $this = $(this);
        Book.displayChapter($this.data("spinepos"));
        e.preventDefault();
      });

      $wrapper.append($item);
      $toc.append($wrapper);
    });


  }


  function controls() {
    var $next = $("#next"),
        $prev = $("#prev"),
        $main = $("#main"),
        $sidebar = $("#sidebar"),
        $open = $("#open"),
        $icon = $open.find("img"),
        $window = $(window),
        sidebarWidth = 40;


    $window.on("resize", function () {
      $main.width($window.width() - sidebarWidth);
    });

    $next.on("click", function () {
      Book.nextPage();
    });

    $prev.on("click", function () {
      Book.prevPage();
    });

    var lock = false;
    $(document).keydown(function (e) {
      if (lock) return;

      if (e.keyCode == 37) {
        $prev.trigger("click");

        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }
      if (e.keyCode == 39) {
        $next.trigger("click");
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);

        return false;
      }
    });

    $open.on("click", function () {
      if ($sidebar.hasClass("open")) {
        $sidebar.removeClass("open");
        $main.removeClass("closed");
        $icon.attr("src", "img/menu-icon.png");
      } else {
        $sidebar.addClass("open");
        $main.addClass("closed");
        $icon.attr("src", "img/close.png");
      }
    });

  }

  return init;

})(jQuery);