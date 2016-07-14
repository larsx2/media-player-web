var videojs = require('video.js');
require('videojs-playlist');
var $ = require('jquery');
var _ = require('lodash');
var handlebars = require('handlebars');

$(document).ready(function() {
    var videoList = [];
    var videos = [];

    function loadVideos () {
        $.getJSON('/music/playlist', function(videos) {
            videos = _.orderBy(videos, 'votes', 'desc');
            _.each(videos, function(video) {
                videoList.push({
                    sources: [{
                        src: video.media_url,
                        type: 'video/mp4'
                    }]
                });
            });
        });
    }
    loadVideos();

    videojs('player').ready(function() {
        var player = this;
        player.playlist(videoList);
        player.playlist.autoadvance(0);

        var template = handlebars.compile(
            $('#video-list').html()
        );
        var content = template({videos: videos});
        $('#playlist-wrapper').html(content);

        //Starts player
        $(function() {
            $('#playlist li').first().trigger('click');
        });


        //Events
        $('#playlist li').on('click', function(e) {
            e.preventDefault();
            
            $(this).addClass('playing').siblings().removeClass('playing'); 
            //set video details
            var artist = $(this).find('a').attr('data-band');
            var song = $(this).find('.video-name').text();
            $('#band-name').text(artist);
            $('#song-name').text(song);
            
            player.playlist.currentItem($(this).index());
            player.play();
        });

        //Listener
        player.on('ended', function() {
            console.log('Video ended!');
            loadVideos();
            player.playlist.first();
            player.play();
        });

    });
    //videojs.options.flash.swf = "../node_modules/video.js/dist/video-js.swf"
});
