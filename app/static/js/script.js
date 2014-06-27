$( document ).ready(function(){
    var hashing = false;
    $('#search').focus()
    if (localStorage['remember-search'] == "true") {
        $('#remember-search').attr('checked','checked')
        $('#search').val(localStorage['search-input'])
        search(localStorage['search-input'])
    }

    $('#remember-search').click(function(){
        localStorage['remember-search'] = $(this).is(":checked")
        if ($(this).is(":checked"))
            localStorage['search-input'] = $('#search').val()
        else
            localStorage['search-input'] = ""
        
    })
    
    hash(false)
    $(window).bind( 'hashchange', function(e) {
        if (hashing)
            return
        hashing = true;
        hash(true);
        hashing = false;
    });

    $('.title-link').click(function(){
        if (hashing)
            return
        hashing = true;
        hash(true);
        hashing = false
        
    });

    
    $('.pull-name').click(function(){ 
        var input = $(this).children("input");

        $(input).get(0).scrollLeft = $(input).get(0).scrollWidth
        $(input).select();

    });


    $('.tag-ids').click(function(e){
//        alert($(this).attr('title'));
        if ($('#clipboard').length > 0 && $('#clipboard').hasClass($(this).html())) {
            return
        }
        
        $('#clipboard').remove()

        t = $('<input type="text" class="span12 '+$(this).html()+'" id="clipboard" />')
        $(t).insertAfter(this);
        t.attr('value', $(this).attr('pull')).focus().select()
        e.preventDefault()
        e.stopPropagation()
        $('#clipboard').click(function(e){
            e.stopPropagation()
            e.preventDefault()
            $(this).focus().select()
            return false
        });
        $('body').click(function(e){
            if ($(e.target).attr('id') == "clipboard")
                return false
            $('#clipboard').remove()
        });
        
    });

    $('#search').on('input',function(e){search($(this).val())});
    $('#search').keyup(function(e) {
        if (e.keyCode == 27) { 
            $('#search').val('')  
            search('')
        }   // esc
    });

    function hash(override) {
        var q = window.location.hash.indexOf("q=")
         query = q > -1 ? window.location.hash.substring(q+"q=".length) : ""
         if (override || q > -1) {
             $('#search').val(query)
             search(query, true)
         }

         if (q == -1) {
             window.location = window.location;
         }
    }

    function search(query, exact){
        if (localStorage['remember-search'] == "true") {
            localStorage['search-input']=query;
        } 
        if (!exact || query.length == 0) { 
            $('#repositories > li > a').each(function(){
                if ($(this).html().indexOf(query) == -1)
                    $(this).parent().hide()
                else
                    $(this).parent().show()
            });
        }

        $('.images .card-heading').each(function(){
            image = $(this).attr('repo')+"/"+$(this).children("span").text()
            //alert ((!exact && image.indexOf(query) == -1) +" "+ (exact && image == query)+" "+query+" "+image)
            if (((!exact && image.indexOf(query) == -1) || (exact && image != query)) && query.length > 0)
                $(this).parent().hide()
            else
                $(this).parent().show()
        });

        $('.title').each(function(){
            var repo = "#"+$(this).find("span").text()+"-repo"
            var children = $(this).next().children();
            var hide = children.length === children.not(':visible').length
            if (hide)
                $(repo).hide()
            else
                $(repo).show()

            $(this).css('display', hide ? 'none' : 'block')
                
            
        });




    }

});
