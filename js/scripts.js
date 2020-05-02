/* globals jQuery */
(function($) {
  // 'use strict';

  $(function() {

  	$('select').selectric();

  	/*===============================
      Menu
    ================================*/

  	$(document).on('click', '.btMenu', function(e){

          e.preventDefault();
          $(this).toggleClass('ativo');
          $("nav").toggleClass('ativo');
          $("header").toggleClass('ativo');
    });

  	$('.btMenu').click(function(){
	  $(this).toggleClass('active');
	  });

    /*===============================
      Pop-up brindes
    ================================*/

    $(document).ready(function() {
      $('.popup-brindes').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#usuarios-brindes',

        callbacks: {
          beforeOpen: function() {
            if($(window).width() < 700) {
              this.st.focus = false;
            } else {
              this.st.focus = '#usuarios-brindes';
            }
          }
        }
      });
      $(document).on('click', '.mfp-close', function (e) {
          e.preventDefault();
          $.magnificPopup.close();
        });
    });

    /*===============================
      Textarea com contador
    ================================*/

    $(document).on('click', '.btComentar', function(e){

          e.preventDefault();
          $(this).toggleClass('ativo');
          $(".comentar").toggleClass('ativo');

          return false;
    });

    $('.btComentar').click(function(){
    $(this).toggleClass('active');
    });

   if( $('#comentario, #infoContato, #descriPerfil').length > 0 ) {

      $('textarea[maxlength]').keyup(function(){
          
          var limit = parseInt($(this).attr('maxlength'));
          
          var text = $(this).val();
         
          var chars = text.length;

         
          if(chars > limit){
              
              var new_text = text.substr(0, limit);

              $(this).val(new_text);
          }
          calletras(this);
      });


      function calletras(textarea){
        var limit = parseInt($(textarea).attr('maxlength'));
        var text = $(textarea).val();
        var chars = text.length;
        $('#contador').text(limit -chars);
      }

      calletras('#comentario, #infoContato, #descriPerfil');
    }

    /*===============================
      Contato
    ================================*/


    // if( $('#infoContato').length > 0 ) {

    //   $('textarea[maxlength]').keyup(function(){
          
    //       var limit = parseInt($(this).attr('maxlength'));
          
    //       var text = $(this).val();
         
    //       var chars = text.length;

         
    //       if(chars > limit){
              
    //           var new_text = text.substr(0, limit);

    //           $(this).val(new_text);
    //       }
    //       calletras(this);
    //   });


    //   function calletras(textarea){
    //     var limit = parseInt($(textarea).attr('maxlength'));
    //     var text = $(textarea).val();
    //     var chars = text.length;
    //     $('#contador').text(limit -chars);
    //   }

    //   calletras('#infoContato');
    // }

    /*==============================
      MODAL
    ==========================*/

    var mfpOptsDefault = {
          delegate: 'a[href$=".jpg"], a[href$=".gif"], a[href$=".png"]',
          type: 'image',
          removalDelay: 300,
          mainClass: 'mfp-fade',
          closeMarkup: '<button title="%title%" class="mfp-close icon icon-close"></button>',
          
          gallery: {
            enabled: true,
            preload: [0,2],
            navigateByImgClick: true,
            // arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% icon icon-chev%dir%"></button>',
            // tPrev: 'Anterior (Seta esquerda)',
            // tNext: 'Próximo (Seta direita)',
            tCounter: ''
          }
        };    
    $('.fotoGaleria').magnificPopup(mfpOptsDefault);

  /*==============================
      foto
    ==========================*/
    $('.btn-upload input').change(function(){
      if( $(this).val() ) {
        $(this).closest('.file').addClass('has-file');
        readURL(this);
      } else {
        $(this).closest('.file').removeClass('has-file');
      }
    });

    $('.btn-delete').on('click', function(){
      $(this).closest('.file').removeClass('has-file');
      $(this).closest('.file').find('input').val('');
      return false;
    });


    function readURL(input) {
      $img = $(input).closest('.file').find('img');

      if (input.files && input.files[0]) {
        var leitor = new FileReader();
        leitor.onload = function (e) {
          $img.attr('src', e.target.result);
        }
        leitor.readAsDataURL(input.files[0]);
      }
    }


    /*==============================
     Excluir conta
    ==========================*/

      document.querySelector('.excluiConta button').onclick = function(){
        swal({
          title: "Deseja Excluir sua conta?",
          text: "Esse processo é irreversivelmente!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Sim, delete!',
          cancelButtonText: 'Cancelar',
          closeOnConfirm: false
        },
        function(){
          swal("Deletada!", "Obrigada por ter utilizado o Collection Of Beer!", "success");
        });
      };


      $('#ckeckBeer :radio.star').rating();




	
  });
}(jQuery));
