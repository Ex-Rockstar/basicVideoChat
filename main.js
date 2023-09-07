let myConnection = new RTCPeerConnection()
let localStream;
let remoteStream;

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true })
    remoteStream = new MediaStream()
    document.getElementById('user-1').srcObject = localStream
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        myConnection.addTrack(track, localStream);
    });

    myConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
        });
    };
}

let createOffer = async () => {


    myConnection.onicecandidate = async (event) => {
        // Event that fires off when a new offer ICE candidate is created
        if(event.candidate){
            document.getElementById('offer-sdp').value = JSON.stringify(myConnection.localDescription)
        }
    };

    const offer = await myConnection.createOffer();
    await myConnection.setLocalDescription(offer);
}

let createAnswer = async () => {

    let offer = JSON.parse(document.getElementById('offer-sdp').value)

    myConnection.onicecandidate = async (event) => {
        //Event that fires off when a new answer ICE candidate is created
        if(event.candidate){
            console.log('Adding answer candidate...:', event.candidate)
            document.getElementById('answer-sdp').value = JSON.stringify(myConnection.localDescription)
        }
    };

    await myConnection.setRemoteDescription(offer);

    let answer = await myConnection.createAnswer();
    await myConnection.setLocalDescription(answer); 
}

let addAnswer = async () => {
    console.log('Add answer triggerd')
    let answer = JSON.parse(document.getElementById('answer-sdp').value)
    console.log('answer:', answer)
    if (!myConnection.currentRemoteDescription){
        myConnection.setRemoteDescription(answer);
    }
}

init()

document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('add-answer').addEventListener('click', addAnswer)      