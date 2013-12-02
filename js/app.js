(function () {

    var apikey = '?client_id=c34a8a50f27c46818b6b0d04933c48b6',
    photoList = [],
    iteration = 0,
    max_iterations = 25,
    processed_photos =[];

    startProcess = function() {
        var query = 'https://api.instagram.com/v1/tags/ultrasound/media/recent' + apikey + '&callback=?'
        getData(query);

    };

    getData = function(query){
        $.getJSON(query, function(d){
            photoList = photoList.concat(d.data);
            iteration++;

            if(iteration < max_iterations){
                // $('#photos').html('Loading photos, iteration ' + iteration + ' of ' + max_iterations);
                var next_url = query + '&max_tag_id=' + d.pagination.next_max_id
                var percent = Math.round((iteration * 100) / max_iterations);
                $('#percent').html(percent + '%');
                setTimeout(getData(next_url), 500);
            } else {
                processPhotos();
            }
        });
    }

    photoTemplate = function(image, caption, full_name, created_at, week){
        var template = '<div class="imagen"><a data-weeks="' + week + '" data-user=" ' + full_name + ' " data-title=" ' + caption + ' " class="fancybox" rel="gallery" href=" ' + image + ' "><img width="200" src=" ' + image + ' "><p>week ' + week + '</p></a></div>';
        return template;
    }

    processPhotos = function(){
        $('#photobox').empty();
        photoList = photoList.shuffle();

        var i = 0;

        while(processed_photos.length < 20){
            if(photoList[i] && photoList[i].caption && photoList[i].caption.text.indexOf('week') > -1){
                var currentPhoto = {};

                var regex = /(\d+)\s?week/;
                var match = regex.exec(photoList[i].caption.text);

                if(match){
                    currentPhoto.week = +match[1];
                    currentPhoto.caption = photoList[i].caption.text;
                    currentPhoto.image = photoList[i].images.standard_resolution.url;
                    currentPhoto.created_at = new Date(+photoList[i].caption.created_time*1000);
                    currentPhoto.user = photoList[i].user.full_name;

                    processed_photos.push(currentPhoto);
                }
            }

            i++;
        }

        processed_photos.sort(compare_week);

        printPhotos();
    }

    printPhotos = function () {
        $.each(processed_photos, function(i, d){
            $('#photobox').append(photoTemplate(d.image, d.caption, d.user, d.created_at, d.week));
        });

        startBooting();

    };

    var startBooting = function() {
        bootloop = new TimeoutChain();

        bootloop.add(function() {
            $('#loading').fadeOut('slow');
            $('#one').fadeIn('slow');
        }, 1000);

        bootloop.add(function() {
            $('#one').fadeOut('slow');
            $('#two').fadeIn('slow');
        }, 6000);

        bootloop.add(function() {
            $('#two').fadeOut('slow');
            $('#three').fadeIn('slow');
        }, 6000);

        bootloop.add(function() {
            $('#three').fadeOut('slow');
            $('#four').fadeIn('slow');
        }, 6000);

        bootloop.add(function() {
            $('#four').fadeOut('slow');
            $('#photos').fadeIn('slow');
            $('#photobox .imagen').each(function(i) {
                $(this).delay((i++) * 1000).animate({'opacity': '1'}, 'slow');
            });
        }, 4000);


        bootloop.start();
    };

    startProcess();

    $('#photobox').on('click', '.fancybox', function() {
        $this = $(this);
        $.fancybox({
            href: $this.attr('href'),
            type: 'iframe',
            width: 600,
            height: 600,
            title: '<p class="title">' + $(this).data('user') + ', ' + $(this).data('weeks') + ' weeks</p>' + $(this).data('title'),
            helpers     : {
                title   : { type : 'inside' }
            }
        });
        return false;
    });

    $('.reload').on('click', function() {
        window.location.reload();
    })

})();
