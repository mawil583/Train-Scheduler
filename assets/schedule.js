$(document).ready(function () {

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBYu1dfKKMAR24cQrrfTfPYwelm3Fcmk1k",
    authDomain: "train-scheduler-724e3.firebaseapp.com",
    databaseURL: "https://train-scheduler-724e3.firebaseio.com",
    projectId: "train-scheduler-724e3",
    storageBucket: "",
    messagingSenderId: "332122503923",
    appId: "1:332122503923:web:df6cf29633e530509b1586"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  let database = firebase.database();

  let trainName = "";
  let destination = "";
  let frequency = 0;
  let firstTrainTime = 0;

  $(document).on("click", ".btn", function (event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstTrainTime = $("#firstTrainTime").val().trim();
    console.log(frequency);

    let trainInfo =
    {
      train_name: trainName,
      destination: destination,
      first_train_time: firstTrainTime,
      frequency: frequency
    }
    database.ref().push(
      trainInfo
    )
  });
  // let nextArrival = 

  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val().train_name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().first_train_time);
    let nextArrivalArr = childSnapshot.val().first_train_time.split(":");
    console.log(nextArrivalArr);
    let nextArrival = moment().hours(nextArrivalArr[0]).minutes(nextArrivalArr[1]);
    console.log(nextArrival)
    // moment.max takes two arguments- moment() and nextArrival. 
    // It takes nextArrival time and subtracts from it the current time
    let nextArrivalMax = moment.max(moment(), nextArrival);
    let trainArrival;
    let trainMin;
    if (nextArrivalMax == nextArrival) {
      trainArrival = nextArrival.format("hh:mm A");
      trainMin = nextArrival.diff(moment(), "minutes");
    } else {
      var diffTime = moment().diff(nextArrival, "minutes");
      var timeRemainder = diffTime % childSnapshot.val().frequency;
      trainMin = childSnapshot.val().frequency - timeRemainder;
      trainArrival = moment().add(trainMin, "m").format("hh:mm A")
    }
    let row = $("<tr>");
    let tableData = $(
      "<td>" + childSnapshot.val().train_name + "</td>" +
      "<td>" + childSnapshot.val().destination + "</td>" +
      "<td>" + childSnapshot.val().frequency + "</td>" +
      "<td>" + trainArrival + "</td>" +
      "<td>" + trainMin + "</td>");
    $(row).append(tableData);
    $("tbody").append(row);

  })

  /* 
  numMinPassedSinceTrainLeft = currentTime % frequency

  minutesAway = frequency - numMinPassedSinceTrainLeft

  nextArrival = currentTime + minutesAway
  */




})