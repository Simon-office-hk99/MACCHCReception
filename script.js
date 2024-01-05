	const ParentUrl_origin = 'https://receptionmacchc.tiiny.site/';
        const ParentUrl_path = '';
	var apiUrl_sha = '';

const apiUrl = 'https://api.github.com/repos/simon-office-hk99/MACCHCReception/contents/path_to_your_file.txt';

//const token = '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';
import { githubToken } from 'https://receptionmacchc.tiiny.site/config.js';

// Make a GET request to retrieve the file details
fetch(apiUrl)
  .then(response => response.json()) 
        .then(data => {
        // The SHA of the file is available in the response data
    	apiUrl_sha = data.sha;
    	console.log('SHA of the file:', apiUrl_sha);
  	})
  .catch(error => {
    console.error('Error fetching file details:', error);
  });

const requestData = {
    message: 'Commit message',
    sha: apiUrl_sha,
    content: btoa('Your data to be stored in the file'), // Encode data to base64
};

fetch(apiUrl, {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer ${githubToken}',
	'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(requestData),
})
.then(response => {
    if (response.ok) {
        console.log('File updated successfully.');
    } else {
        console.error('Failed to update file:', response.statusText);
    }
})
.catch(error => {
    console.error('Error:', error);
});


        // Calculate content height and send it to the parent window
        function sendHeightToParent() {
            const contentHeight = document.body.scrollHeight;
            window.parent.postMessage({
                type: 'setHeight',
                height: contentHeight + 50
            }, ParentUrl_origin); // Replace with your parent page's origin
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

        // Call the function to send the height to the parent window
        sendHeightToParent();

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

                    const currentPageUrl = ParentUrl_origin + ParentUrl_path;
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

		    sendHeightToParent();

                    // Update URL with new parameters
                    window.history.pushState({}, '', generatedURL);
			
                }
            });       
          
        });
