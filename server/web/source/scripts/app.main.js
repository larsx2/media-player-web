var videojs = require('video.js');
require('videojs-playlist');
var $ = require('jquery');
var _ = require('lodash');
var handlebars = require('handlebars');
var noty = require('noty');

$(document).ready(function() {
    var videoList = [];
    var videos = [];
    var template = handlebars.compile(
        $('#video-list').html()
    );


    function loadVideos (player) {
        videoList = [];
        $.getJSON('/music/playlist', function(tracks) {
            videos = _.orderBy(tracks, 'votes', 'desc');
            _.each(videos, function(video) {
                videoList.push({
                    sources: [{
                        src: video.media_url,
                        type: 'video/mp4'
                    }]
                });
            });
            var content = template({videos: videos});
            $('#playlist-wrapper').html(content);
            if (player) {
                player.playlist(videoList);
                $('#playlist-wrapper li').first().trigger('click');
            }
        });
    }
    loadVideos();

    setTimeout(function() {
        videojs('player').ready(function() {
            var player = this;
            player.playlist(videoList);
            //Starts player
            $(function() {
                $('#playlist li').first().trigger('click');
            });

            //Events
            $('#playlist-wrapper').on('click', 'li', function(e) {
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
                var songId = $('li.playing').find('a').attr('data-id');
                $.post("/action/played/" + songId).done(function(songs) {
                    loadVideos(player);
                });
            });

            setInterval(function() {
                $.getJSON('/music/playlist', function(videos) {
                    _.each(videos, function(video) {
                        var votes = $("a[data-id='" + video._id + "']").find(".votes");
                        var pastVotes = parseInt(votes.text());
                        var votesAdded = parseInt(video.votes) - pastVotes;

                        if (votesAdded > 0) {
                            votes.text(video.votes);
                            notify('+' + votesAdded + ' for ' + video.name);
                        }
                    });
                });
            }, 1000);
        });
    }, 1000);

    function notify(text, type, layout) {
        return noty({
            text: text,
            type: type || 'success',
            theme: "relax",
            dismissQueue: true,
            layout: layout || 'bottomRight',
            maxVisible: 5,
            modal: false,
            animation: {
                open: 'animated flipInX',
                close: 'animated flipOutX'
            },
            timeout: 3000,
            closeWith: ['click', 'hover'],
            animation: {
                open: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceInLeft'
                close: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceOutLeft'
                easing: 'swing',
                speed: 250 // opening & closing animation speed
            },
        });
    }
    //videojs.options.flash.swf = "../node_modules/video.js/dist/video-js.swf"
});
