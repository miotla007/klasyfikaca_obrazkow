/*jslint browser: true, sloppy: true */
/*global $: false */

$(document).ready(function () {

    var socket = io.connect('http://localhost:3000');

    socket.on('connect', function(){
        $('#selectedItems').children().remove();
    });
    var picId = 0;


    var addNewSelectedItem = function (data){
        return '<tr id="item'+data.id+'" hidden="true"><td><img class="img-polaroid" src="'+ data.img +'"></img></td>'+
        '<td><span class="badge badge-success rank">'+data.rank+'</span></td>'+
                    '<td><button class="btn btn-warning" id="itemBtn'+data.id+'">VOTE</button></td></tr>';
    }

    var voteListBtnClick = function(that) {
        var id = $(that).attr('id');
         console.log(id);
        var img = $('#img'+id).attr('src');
        // console.log(img);

        var data = {};
        data.src = img;
        //data.id = id;

        // console.log(addNewSelectedItem(data));
        socket.emit('addNewImg', data);
    }

    var voteItemBtnClick = function(that){
        var orgId = $(that).attr('id');
        var id = orgId.substring(7, orgId.length);
        // console.log(id);
        var img = $('#item'+id+' img').attr('src');
        // console.log(img);

        socket.emit('addNewImg', {'src': img});
    }
    $('#buttonTag').click(function () {
        $("#alertdiv").fadeOut("slow");
        //$(".alert").alert('close');
        var value = document.getElementById("inputSuccessTags").value;
        var numpic = document.getElementById("inputSuccessPic").value;
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
            tags: value,
            tagmode: "any",
            format: "json"
        }, function (data) {
            $('#responseOutput').children().remove();
            $.each(data.items, function (i, item) {
                console.log(item.media.m);
                $('#responseOutput').append('<tr><td><img id="img'+picId+'" class="img-polaroid" src="'+ item.media.m +'"></img><td></td>'+
                    '<td><button class="btn btn-success" id="'+picId+'">SELECT AND VOTE</button></td></tr>');
                picId++;
                if (i === (numpic-1)) {
                    return false;
                }
            });
            $('#responseOutput button').click(function(){ voteListBtnClick(this);  });
        });
    });

    socket.on('setNewImg', function(data) {
        //console.log(data);
        var items = $('#selectedItems tr').filter('#item'+data.id);
        if(items.length === 0){
            $('#selectedItems').append(addNewSelectedItem(data));
            $('#item'+data.id).slideDown('slow', function(){
                $('#item'+data.id+' button').click(function() { voteItemBtnClick(this); });
            });
            
        }else{
            $('#item'+data.id+' .rank').text(data.rank);
        }

        //sortowanie na widoku
        var trs = $('#selectedItems tr').sort( function(a,b) {
            return parseInt($('#'+ ($(b).attr('id')) + ' .rank').text(), 10) -
                 parseInt($('#'+ ($(a).attr('id')) + ' .rank').text(), 10);
        });

        $('#selectedItems').children().remove();
        $('#selectedItems').append(trs);
        //console.log(trs);
        $('#selectedItems button').click(function() { voteItemBtnClick(this); });
    });
});
