// global variables
var userInputs = [];
var page = Math.floor(Math.random() * 10) + 1;
console.log(page);

// materialize navbar
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, {});
});

// movie recommendation function
function movieRecommendation() {

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/discover/movie?with_genres=" + userInputs[1] + userInputs[3] + userInputs[2] + "&page=" + page + "&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-US&with_original_language=en&api_key=d12c2969d92f9ef15d80bab89a0cdf8d",
    "method": "GET",
    "headers": {},
    "data": "{}",
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    var x = parseInt(Math.random()*response.results.length);
    var movie = response.results[x].title;
    var year = response.results[x].release_date.substring(0,4);

    $.ajax({
      url: "https://www.omdbapi.com/?apikey=63f86544&t=" + movie,
      type: "GET",
    }).then(function(response) {
      console.log(response);
      // get metadata from omdb and write to card
      var poster = $('<img>').attr({
        class: "responsive-img",
        src: response.Poster
      });
      var title = $('<h3>').text(response.Title);
      var director = $('<p>').addClass("flow-text").text('Director: ' + response.Director);
      var cast = $('<p>').addClass("flow-text").text('Main Cast: ' + response.Actors);
      var plot = $('<p>').addClass("flow-text").text('Synopsis: ' + response.Plot);
      var release = $('<p>').addClass("flow-text").text('Released: ' + response.Released);
      var rating = $('<p>').addClass("flow-text").text('Rating: ' + response.Rated);
      var br = $('<br>');
      $("#poster").html(poster);
      $('#resultCard').append(title, release, rating, director, cast, plot, br);
      // get ratings from omdb and generate plotly graph
      var imdb = parseFloat(response.Ratings[0].Value)*10;
      var rotten = parseInt(response.Ratings[1].Value);
      var meta = parseInt(response.Ratings[2].Value);
      var d3 = Plotly.d3;
      var img_jpg= d3.select('#jpg-export');
      
      var xValue = [imdb, rotten, meta];

      var yValue = ['IMDB', 'RT', 'Meta'];
      var data = [{
        y: yValue,
        x: xValue,
        text: xValue.map(String),
        textposition: 'auto', 
        orientation: 'h',
        marker:{
          color: ['rgb(245,197,23)', 'rgb(250,50,9)', 'rgb(1,51,100)'],
          width: 1.5
        },
        type: 'bar'
      }];
      
      var layout = { 
        title: 'Critical Ratings',
        font: {size: 24},
      };
      Plotly.newPlot('ratingsDiv', data, layout).then(
        
        function(gd)
         {
          Plotly.toImage(gd,{height:500,width:1000})
             .then(
                 function(url)
             {
                 img_jpg.attr("src", url);
                 return Plotly.toImage(gd,{format:'jpeg',height:500,width:1000});
             }
             )
        });
    });

    var ytQuery = "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&q=" + movie + "+trailer+&key=AIzaSyAs4LN-8AAtpD25meiR3Upyat-7B-nnqck"
    $.ajax({
      url: ytQuery,
      method: "GET"
    }).then(function(response) {
      var trailer = $("<iframe>").attr("src", "https://www.youtube.com/embed/" + response.items[0].id.videoId)
      $("#embedTrailer").append(trailer);
      });

  });
    
};

// TV recommendation function
function tvRecommendation() {

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/discover/tv?include_null_first_air_dates=false&with_genres=" + userInputs[1] + userInputs[3] + "&timezone=America%2FNew_York&page=1" + userInputs[2] + "&sort_by=popularity.desc&language=en-US&with_original_language=en&api_key=d12c2969d92f9ef15d80bab89a0cdf8d",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  
  $.ajax(settings).done(function(response) {
    console.log(response);
    var x = parseInt(Math.random()*response.results.length);
    var series = response.results[x].original_name;
    var poster = $('<img>').attr({
      class: "responsive-img",
      src: "https://image.tmdb.org/t/p/w500/" + response.results[x].poster_path
    });
    var title = response.results[x].name;
    var name = $('<h3>').text(title);
    var plot = $('<p>').addClass("flow-text").text('Synopsis: ' + response.results[x].overview);
    var airDate = $('<p>').addClass("flow-text").text('Aired: ' + response.results[x].first_air_date);
    var br = $('<br>');
    $("#poster").html(poster);
    $('#resultCard').append(name, airDate, plot, br);

    $.ajax({
      url: "https://www.omdbapi.com/?apikey=63f86544&t=" + title,
      type: "GET",
    }).then(function(response) {
      console.log(response);
    });

    var ytQuery = "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&q=" + series + "+trailer&key=AIzaSyAs4LN-8AAtpD25meiR3Upyat-7B-nnqck"
    $.ajax({
      url: ytQuery,
      method: "GET"
    }).then(function(response) {
      var trailer = $("<iframe>").attr('src', "https://www.youtube.com/embed/" + response.items[0].id.videoId);
      $("#embedTrailer").append(trailer);
      });

  });
    
};

// animate.css
function animateCSS(element, animationName, callback) {
  const node = document.querySelector(element)
  node.classList.add('animated', animationName)

  function handleAnimationEnd() {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
  }

  node.addEventListener('animationend', handleAnimationEnd)
}

// Button onclick function with animation through all Questionnaire cards
$('#startBtn').click(function() {
  userInputs = [];
  $(function() {
    $('#introCard').hide()
  });
  $(function() {
    $('#promptCard1').show()
    animateCSS('#promptCard1', 'fadeIn')
  });
});

$('.card1btn').click(function() {
  var userMedia = $(this).attr("data-medium");
  userInputs[0] = userMedia;
  $(function () {
    $('#promptCard1').hide()
  });

  $(function() {
    $('#promptCard2').show()
    animateCSS('#promptCard2', 'fadeIn')
  });
});

$('.card2btn').click(function() {
  var userGenre = $(this).attr("data-genre");
  userInputs[1] = userGenre;
  $(function () {
    $('#promptCard2').hide()
  });

  $(function () {
    $('#promptCard3').show()
    animateCSS('#promptCard3', 'fadeIn')
  });
});

$('.card3btn').click(function() {
  if (userInputs[0] === "movie") {
    var userEra = $(this).attr("data-movieDate");
    userInputs[2] = userEra;
  } else {
    var userEra = $(this).attr("data-tvDate");
    userInputs[2] = userEra;
  }

  $(function () {
    $('#promptCard3').hide()
  });

  $(function() {
    $('#promptCard4').show()
    animateCSS('#promptCard4', 'fadeIn')
  });
});

// function for displaying results
var displayResults = function() {
  $('#loadingCard').hide()
  $('#results').show()
  $("#resultBtns").show()
  $(function() {
    animateCSS('#results', 'fadeIn')
    animateCSS('#resultBtns', 'slideInUp')
  });
};

// click function for next recommendation
$("#newRecommendation").click(function(){
  $("#resultCard").empty();
  var page = Math.floor(Math.random() * 10) + 1;
  console.log(page);
  if (userInputs[0] === "movie") {
    movieRecommendation();
  } else {
    tvRecommendation();
  };
  $('html, body').animate({scrollTop:0}, 'slow');
});

// click function for start over
$("#startOver").click(function(){
  $("#results").hide();
  $("#poster").empty();
  $("#resultCard").empty();
  $("#resultBtns").hide();
  $("#introCard").show();
});

// Show loading card
$('.card4btn').click (function(){
  // set final parameter in userInputs object
  var userRating = $(this).attr("data-rating");
  userInputs[3] = userRating;
  $(function () {
    $('#promptCard4').hide()
  });
  // show loading card and run recommendation function
  $(function () {
    $('#loadingCard').show()
    animateCSS('#loadingCard', 'slideInUp')
    if (userInputs[0] === "movie") {
      movieRecommendation();
    } else {
      tvRecommendation();
    }
  });
  // after 4 seconds, display results
  setTimeout(displayResults, 4000);
});
