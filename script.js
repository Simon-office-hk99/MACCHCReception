        // Calculate content height and send it to the parent window
        function sendHeightToParent() {
            const contentHeight = document.body.scrollHeight;
            window.parent.postMessage({
                type: 'setHeight',
                height: contentHeight
            }, 'file:///C:/New%20Folder/Playlist/'); // Replace with your parent page's origin
        }

        // Call the function to send the height to the parent window
        sendHeightToParent();

    function extractVideoId(link) {
        const url = new URL(link);
        let videoId = '';

        if (url.hostname === 'youtu.be' || url.hostname === 'www.youtube.com') {
            if (url.searchParams.has('v')) {
                videoId = url.searchParams.get('v');
            } else {
                const path = url.pathname.split('/');
                videoId = path[path.length - 1];
            }
        }
        
        return videoId;
    };

        document.addEventListener('DOMContentLoaded', function () {
            const dateDisplay = document.getElementById('dateDisplay');
            const inputDate = document.getElementById('inputDate');
            const inputYouTubeLink = document.getElementById('inputYouTubeLink');
            const qrcodeContainer = document.getElementById('qrcode');
            const iframeContainer = document.getElementById('iframeContainer');

            // Function to parse URL parameters
            function getURLParams() {
                const urlParams = new URLSearchParams(window.location.search);
                const dateParam = urlParams.get('date');
                const youtubeLinksParam = urlParams.get('youtube_link');
                return { dateParam, youtubeLinksParam };
            }


            // Function to display videos and date initially
            function displayInitialData() {
                const { dateParam, youtubeLinksParam } = getURLParams();

                if (dateParam && youtubeLinksParam) {
                         
		    document.getElementById('generateUrl').style.display = 'none';

                    const youtubeLinksArray = youtubeLinksParam.split(',').map(link => decodeURIComponent(link));
                    const youtubeVideos = youtubeLinksArray.map(link => {
                        //const videoId = link.split('/').pop().split('?')[0];
			const videoId = extractVideoId(link);
                        return `<iframe class="videoFrame" width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    });

                    dateDisplay.textContent = `Selected Date: ${dateParam}`;
                    inputDate.value = dateParam;
                    inputYouTubeLink.value = youtubeLinksParam.replace(/,/g, '\n');
                    iframeContainer.innerHTML = youtubeVideos.join('');
                }
            }

            displayInitialData(); // Display initial data

            // Flatpickr date configuration
            flatpickr(inputDate, {
                dateFormat: 'Y-m-d',
                minDate: 'today', // Allow selection of future dates
                defaultDate: 'today'
            });

            const urlForm = document.getElementById('urlForm');

            // Function to handle form submission
            urlForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const dateValue = inputDate.value.trim();
                const youtubeLinksValue = inputYouTubeLink.value.trim();

                if (dateValue && youtubeLinksValue) {
                    const youtubeLinksArray = youtubeLinksValue.split(/[\s,]+/).map(link => link.trim());
                    const youtubeLinksEncoded = youtubeLinksArray.map(link => encodeURIComponent(link)).join(',');

                    const currentPageUrl = window.location.origin + window.location.pathname;
                    const generatedURL = `${currentPageUrl}?date=${dateValue}&youtube_link=${youtubeLinksEncoded}`;

                    const urlText = document.getElementById('generatedUrlText');
                    urlText.textContent = 'Generated URL: ' + generatedURL;

                    qrcodeContainer.innerHTML = ''; // Clear previous QR code
                    const qr = qrcode(0, 'M');
                    qr.addData(generatedURL);
                    qr.make();
                    const qrImg = qr.createImgTag();
                    qrcodeContainer.insertAdjacentHTML('beforeend', qrImg);

                    iframeContainer.innerHTML = ''; // Clear previous iframe
                    youtubeLinksArray.forEach(link => {
                        //const videoId = link.split('/').pop().split('?')[0];
			const videoId = extractVideoId(link);
                        const iframe = document.createElement('iframe');
                        iframe.className = 'videoFrame';
                        iframe.width = '560';
                        iframe.height = '315';
                        iframe.src = `https://www.youtube.com/embed/${videoId}`;
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                        iframeContainer.appendChild(iframe);
                    });

                    // Update URL with new parameters
                    window.history.pushState({}, '', generatedURL);
                }
            });       
          
        });