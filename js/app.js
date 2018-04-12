document.load = getAllData();

//funcion de scroll
jQuery(document).ready(function() {
    $('.search-pokemon').addClass('animated fadeInLeft');
    $('.order-button').addClass('animated fadeInRight');
    $('.pokemon-card').addClass('animated fadeInUp');
    jQuery('.pokemon-card').addClass("hide").viewportChecker({
        classToAdd: 'show animated fadeInUp',
        offset: 100
       });
});


const $filterInput = $('.filtered-pokemon');

$filterInput.keyup(filterPokemons);

// función que busca la data y la 'cachea'
function getAllData() {
  if(!localStorage.getItem('data-pokemon')) {
    $.post({
      url: 'https://graphql-pokemon.now.sh/',
      data: JSON.stringify({ "query": " { pokemons(first: 151) { id name image height { maximum } weight { maximum } classification types resistant weaknesses } } " }),
      contentType: 'application/json'
    }).done(function(response) {
      let pokemonsData = ('Fetched Pokemons:', response.data.pokemons);
      localStorage.setItem('data-pokemon', JSON.stringify(pokemonsData));
      getPokemonsData(localStorage.getItem('data-pokemon'))
      });
  } else {
    getPokemonsData(localStorage.getItem('data-pokemon'))
  }
}

// función que obtiene la data 'cacheada'
function getPokemonsData(data) {
  let pokemonsData = JSON.parse(data)
  .forEach(pokemon => {
    paintPokemonCard(pokemon);
  })
}

// función que pinta en html cada pokemon
function paintPokemonCard(pokemon){
  let card = '';
  card +=
  `<div class="col-12 col-sm-6 col-lg-3 pokemon-card" data-toggle="modal" id=${pokemon.name} data-target="#pokemon-detail" data-id="${pokemon.id}">
    <div class="card">
      <div class="cardtable">
        <img class="card-img-top img-fluid rounded mx-auto d-block" src="${pokemon.image}" alt="pokemon-${pokemon.name}">
      </div>
      <div class="card-body align-bottom">
        <h2 class="text-center ">${pokemon.name}</h2>
      </div>
    </div>
  </div>`

  $('#pokemons-container').append(card)
}

// función que filtra los pokemones
function filterPokemons(){
  let searchPokemon = $filterInput.val().toLowerCase();
  $('#pokemons-container').empty();
  if($filterInput.val().trim().length > 0){
    var filteredPokemons = JSON.parse(localStorage.getItem('data-pokemon')).filter( pokemon => {
      let nameMatch = pokemon.name.toLowerCase().indexOf(searchPokemon) >=0
      return nameMatch
    }).forEach(pokemon => {
      paintPokemonCard(pokemon)
    })
    $('#pokemons-container:empty').html('<p class="h1">Lo sentimos, no encontramos coincidencias <i class="fa fa-frown-o" aria-hidden="true"></i></p>');
  } else {
    $('#pokemons-container').empty();
    JSON.parse(localStorage.getItem('data-pokemon')).forEach(pokemon => {
      paintPokemonCard(pokemon)
    })
  }
}

// función que crea los modales con los datos particulares del pokemon
$('#pokemon-detail').on('show.bs.modal', function (event) {
  let card = $(event.relatedTarget) // Button that triggered the modal
  let pokemon = JSON.parse(localStorage.getItem('data-pokemon')).find( pokemon => {
    return pokemon.id === card.data('id')
  })
  var modal = $(this)
  modal.find('.modal-title').text(pokemon.name);
  modal.find('.modal-img').attr('src',pokemon.image);
  modal.find('.classification').text(pokemon.classification);
  modal.find('.type').empty().text(createTypesButtons(pokemon.types));
  modal.find('.height').text(pokemon.height.maximum);
  modal.find('.weight').text(pokemon.weight.maximum);
  modal.find('.resistant').empty().text(createResistantButtons(pokemon.resistant));
  modal.find('.weaknesses').empty().text(createWeaknessesButtons(pokemon.weaknesses));
})

// función que crea botones 'type' del modal
function createTypesButtons(array){
  return array.forEach(item => {
    var templateButton = '';
    templateButton += `<button type="button" class="btn btn-sm ${item}">${item}</button>`
    $('.type').append(templateButton)
  })
}



// funciones para ordenar alfabeticamente
$('.order-button').click(function(){
   ops = $("#pokemons-container #pokemon-card").atrr("id");
   $('#pokemons-container').empty();
   orden = $("#pokemons-container div#pokemon-card").atrr("id");
  let pokemonsData = JSON.parse(data)
  let card = '';
  card += ''
  
 });


// función qye crea botoenes 'resistant' del modal
function createResistantButtons(array){
    return array.forEach(item => {
      var templateButton = '';
      templateButton += `<button type="button" class="btn btn-sm ${item}">${item}</button>`
      $('.resistant').append(templateButton)
    })
}

// función que crea los botones 'weaknesses' del modal
function createWeaknessesButtons(array){
    return array.forEach(item => {
      var templateButton = '';
      templateButton += `<button type="button" class="btn btn-sm ${item}">${item}</button>`
      $('.weaknesses').append(templateButton)
    })
}
