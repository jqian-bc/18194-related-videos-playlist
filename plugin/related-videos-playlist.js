videojs.registerPlugin('relatedVideosPlaylist', function() {
    var myPlayer = this,
        loadAndPlay,
        myPlayer,
        returnedPlaylist,
        nextVideoTimeout;

    videojs('myPlayerID').ready(function () {
      var playlistID = 4609649081001,
        htmlElement = '',
        // build a div that will be used as overlay content
        overlayDiv = createEl('div', {
          id: 'bclsOverlay'
        });

      // get the playlist using the catalog
      myPlayer.catalog.getPlaylist(playlistID, function (error, playlist) {
        //deal with error
        returnedPlaylist = playlist;
        // be sure no more than 9 videos in playlist
        returnedPlaylist = returnedPlaylist.slice(0, 9);
        // call function to use video objects to build div using thumbnails
        htmlElement = createVideoList(returnedPlaylist);
        // append div of thumbnails to overlay element
        overlayDiv.appendChild(htmlElement);
      });

      // use overlay plugin to display related videos on pause and video end
      // note that only starting on pause event as on ended event a pause event is also dispatched
      myPlayer.overlay({
        overlays: [{
          align: 'top',
          content: overlayDiv,
          start: 'pause',
          end: 'play'
        }]
      });

      // Listen for end of video event
      // Set timeout to play next video in playlist after 5 seconds
      myPlayer.on("ended", function () {
        nextVideoTimeout = setTimeout(function() {
          loadAndPlay(1);
        }, 5000);
      });

      // This will get triggered whenever the timestamp on the video changes (during playback, when user manually skips to another time etc..)
      // Since when this gets triggered, we are no longer at the "end" of the video, we will cancle the timeout (nextVideoTimeout) for the autoplay
      myPlayer.on("timeupdate", function () {
        clearTimeout(nextVideoTimeout);
      });    
    });

    /**
     * loads and plays a video
     * this function called with thumbnails in
     * the overlay are clicked
     * @param {integer} idx the index of the video object in the videoData array
     */
    loadAndPlay = function (idx) {
      myPlayer.catalog.load(returnedPlaylist[idx]);
      myPlayer.play();
    }

    /**
     * create an element
     *
     * @param  {string} type - the element type
     * @param  {object} attributes - attributes to add to the element
     * @return {HTMLElement} the HTML element
     */
    function createEl(type, attributes) {
      var el,
        attr;
      el = document.createElement(type);
      if (attributes !== null) {
        for (attr in attributes) {
          el.setAttribute(attr, attributes[attr]);
        }
        return el;
      }
    }

    /**
     * create the html for the overlay
     *
     * @param {array} videoData array of video objects
     * @return {HTMLElement} videoList the div element containing the overlay
     */
    function createVideoList(videoData) {
      var i,
        iMax = videoData.length,
        videoList = createEl('div', {
          id: 'videoList'
        }),
        videoHeader = createEl('h1', {
          style: 'color:#666600;font-size: 2em;margin-bottom:.5em'
        }),
        videoWrapper = createEl('div'),
        thumbnailLink,
        thumbnailImage;
      videoList.appendChild(videoWrapper);
      for (i = 0; i < iMax; i++) {
        thumbnailLink = createEl('a', {
          href: '#'
        });
        thumbnailImage = createEl('img', {
          class: 'video-thumbnail',
          src: videoData[i].thumbnail
        });
        thumbnailLink.setAttribute('data-index', i);
        thumbnailLink.addEventListener('click', function(e) {
          e.preventDefault();
          loadAndPlay(this.getAttribute('data-index'));
        });
        videoWrapper.appendChild(thumbnailLink);
        thumbnailLink.appendChild(thumbnailImage);
      }
      return videoList;
    }

});
