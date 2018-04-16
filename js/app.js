document.load = getAllData();

var HZperPage = 20,//numero de resultados
     HZwrapper = 'pokemons-container',//clase de contenedor
     HZlines   = 'pokemon-card',//clase de items
     HZpaginationId ='pagination-container',//id de paginador
     HZpaginationArrowsClass = 'paginacaoCursor',//clase de pagina
     HZpaginationColorDefault =  '#356ABC',//color de paginación
     HZpaginationColorActive = '#311b92', //color de clic
     HZpaginationCustomClass = 'btn-group'; //clase para css

$(document).ready(function(){
  paginationShow();
})

//funcion animada
jQuery(document).ready(function() {
    $('.input-group').addClass('animated fadeInLeft');
    $('.text-right.search-pokemon').addClass('animated fadeInRight');
    $('.img-logo').addClass('animated pulse');
    $('.pokemon-card').addClass('animated fadeInUp');
});

function paginationShow(){
		if($("#"+HZpaginationId).children().length>8){
			var a=$(".activePagination").attr("data-valor");
			if(a>=4){
				var i=parseInt(a)-3,o=parseInt(a)+2;
				$(".paginacaoValor").hide(),exibir2=$(".paginacaoValor").slice(i,o).show()
			}else $(".paginacaoValor").hide(),exibir2=$(".paginacaoValor").slice(0,5).show()
		}
}

paginationShow(),$("#beforePagination").hide(),$("."+HZlines).hide();
for(var tamanhotabela=$("."+HZwrapper).children().length,porPagina=HZperPage,paginas=Math.ceil(tamanhotabela/porPagina),i=1;i<=paginas;)
	$("#"+HZpaginationId).append("<button type='button' class='paginacaoValor btn' data-valor="+i+">"+i+"</button>"),i++,$(".paginacaoValor").hide(),exibir2=$(".paginacaoValor").slice(0,5).show();
  $(".paginacaoValor:eq(0)").addClass("activePagination").addClass("btn-info");
  var exibir=$("."+HZlines).slice(0,porPagina).show();
$(".paginacaoValor").on("click",function(){
	$(".paginacaoValor").removeClass("activePagination").removeClass("btn-info"),$(this).addClass("activePagination").addClass("btn-info");
	var a=$(this).attr("data-valor"),i=a*porPagina,o=i-porPagina;$("."+HZlines).hide(),exibir=$("."+HZlines).slice(o,i).show(),"1"===a?$("#beforePagination").hide():$("#beforePagination").show(),a===""+$(".paginacaoValor:last").attr("data-valor")?$("#afterPagination").hide():$("#afterPagination").show(),paginationShow()
}),$(".paginacaoValor").last().after($("#afterPagination")),
	$("#beforePagination").on("click",function(){
	var a=$(".activePagination").attr("data-valor"),i=parseInt(a)-1;$("[data-valor="+i+"]").click(),paginationShow()
}),$("#afterPagination").on("click",function(){
	var a=$(".activePagination").attr("data-valor"),i=parseInt(a)+1;
	$("[data-valor="+i+"]").click(),paginationShow()
});

const $filterInput = $('.filtered-pokemon');

$filterInput.keyup(filterPokemons);

// función que busca la data y la 'cachea'
function getAllData() {
  if(!localStorage.getItem('data-pokemon')) {
    $.post({
      url: 'https://graphql-pokemon.now.sh/',
      data: JSON.stringify({ "query": " { pokemons(first: 151) { id number name image height { maximum } weight { maximum } classification types resistant weaknesses } } " }),
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
		/*cont++;
    var string = cont;
    document.getElementById('dato').innerHTML = string*/
    paintPokemonCard(pokemon);
  })
}

// función que pinta en html cada pokemon
function paintPokemonCard(pokemon){
  let card = '';
  card +=
  `<div class="col-12 col-sm-6 col-lg-3 pokemon-card" data-toggle="modal" data-num="${pokemon.number}" id=${pokemon.name} data-target="#pokemon-detail" data-id="${pokemon.id}">
    <div class="card">
      <div class="cardtable">
        <img class="card-img-top img-fluid rounded mx-auto d-block" src="${pokemon.image}" alt="pokemon-${pokemon.name}">
      </div>
      <div class="card-body align-bottom">
        <h2 class="text-center ">${pokemon.name}</h2>
      </div>
    </div>
  </div>`;
  
  $('#pokemons-container').append(card);
	/*if (pokemon.number === 20) {
		break;
	}*/
}

// función que filtra los pokemones
function filterPokemons(){
  let searchPokemon = $filterInput.val().toLowerCase();
  $('#pokemons-container').empty();
	$('#pagination-container').hide();
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
		$('#pagination-container').show();
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

// funciones para ordenar alfabeticamente
//accion de botones
$('.order-button-nro').click(function(){
	 $('#pokemons-container').empty();
   getPokemonsData(localStorage.getItem('data-pokemon'));
	 paginationShow();
   $('.order-button').show();
	 $('.order-button-nro').hide();
 });

$('.order-button').click(function(){
   tinysort('section#pokemons-container>div', {attr: 'id'});
	 paginationShow();
   $('.order-button-nro').show();
	 $('.order-button').hide();
 });

// función qye crea botoenes 'resistant' del modal
function createResistantButtons(array){
    return array.forEach(item => {
      var templateButton = '';
      templateButton += `<div class="col-6 col-md-12"><button type="button" class="btn btn-block char ${item}">${item}</button></div>`
      $('.resistant').append(templateButton)
    })
}

// función que crea botones 'type' del modal
function createTypesButtons(array){
  return array.forEach(item => {
    var templateButton = '';
    templateButton += `<div class="col-12"><button type="button" class="btn btn-block char ${item}">${item}</button></div>`
    $('.type').append(templateButton)
  })
}

// función que crea los botones 'weaknesses' del modal
function createWeaknessesButtons(array){
    return array.forEach(item => {
      var templateButton = '';
      templateButton += `<div class="col-6 col-md-12"><button type="button" class="btn btn-block char ${item}">${item}</button></div>`
      $('.weaknesses').append(templateButton)
    })
}

//boton de subir Srcoll to top
$(window).scroll(function() {
    if ($(this).scrollTop() >= 100) {        // cuando Se baja mas de 50px;
        $('#return-to-top').fadeIn(200);    // Fade in
    } else {
        $('#return-to-top').fadeOut(200);   // Fade out
    }
});
$('#return-to-top').click(function() {      // Cuando se da clic en pokebola, sube
    $('body,html').animate({
        scrollTop : 0                      
    }, 500);
});
