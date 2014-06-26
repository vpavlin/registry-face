$( document ).ready(function(){
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


    $('.tag-ids').click(function(e){
//        alert($(this).attr('title'));
        if ($('#clipboard').length > 0 && $('#clipboard').hasClass($(this).html())) {
            return
        }
        
        $('#clipboard').remove()

        t = $('<input type="text" class="span12 '+$(this).html()+'" id="clipboard" />')
        $(t).insertAfter(this)
        t.attr('value', $(this).attr('pull')).focus().select()
        e.preventDefault()
        e.stopPropagation()
        $('#clipboard').click(function(){
            e.stopPropagation()
            $(this).focus().select()
            return false
        });
        $('body').click(function(){
            if ($(e.target).attr('id') == "clipboard")
                return false
            $('#clipboard').remove()
            
        });
        
    });

    $('#search').on('input',function(){search($(this).val())});


    function search(query){
        if (localStorage['remember-search'] == "true") {
            localStorage['search-input']=query;
        }
        $('#repositories > li > a').each(function(){
            if ($(this).html().indexOf(query) == -1)
                $(this).parent().hide()
            else
                $(this).parent().show()
        });

        $('.images .card-heading').each(function(){
            image = $(this).attr('repo')+"/"+$(this).html()
            if (image.indexOf(query) == -1)
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
