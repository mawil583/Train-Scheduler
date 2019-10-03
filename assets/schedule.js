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
  

  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val().train_name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().first_train_time);
    let firstTrainTimeSplitArr = childSnapshot.val().first_train_time.split(":");
    console.log(firstTrainTimeSplitArr);
    let firstTrainTimeFormatted = moment().hours(firstTrainTimeSplitArr[0]).minutes(firstTrainTimeSplitArr[1]).subtract(1, "years");
    // console.log(nextArrival)
    // moment.max takes two arguments- moment() and firstTrainTimeFormatted. 
    // It takes firstTrainTimeFormatted time and subtracts from it the current time
    let nextArrivalMax = moment.max(moment(), firstTrainTimeFormatted);
    let trainArrival;
    let trainMin;
    if (nextArrivalMax == firstTrainTimeFormatted) {
      trainArrival = firstTrainTimeFormatted.format("hh:mm A");
      trainMin = firstTrainTimeFormatted.diff(moment(), "minutes");
    } else {
      var diffTime = moment().diff(firstTrainTimeFormatted, "minutes");
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