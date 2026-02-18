let videoList = document.querySelectorAll('.video-list-container .list');

videoList.forEach(iframe =>{
   iframe.onclick = () =>{
      videoList.forEach(remove =>{remove.classList.remove('active')});
      iframe.classList.add('active');
      let src = iframe.querySelector('.list-video').src;
      let title = iframe.querySelector('.list-title').innerHTML;
      document.querySelector('.main-video-container .main-video').src = src;
      document.querySelector('.main-video-container .main-video').play();
      document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
   };
});



