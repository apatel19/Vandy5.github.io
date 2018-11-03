var lat, long;
var currentUserId;
var isManager = -1; // 0 means is employee; 1 means is manager, -1 means is not defined.

$(document).ready(function(){
    $("#btnSaveEmployeeDetails").click('input', function(){
        
       addEmployee();
       LoadEmployeePortal();
    });

    $("#btnManager").click('input', function(){
        $("#cardInitial").hide();
        $("#cardManagerSignUp").show();
    });

    $("#btnEmployee").click('input', function(){
        $("#cardInitial").hide();
        $("#cardEmployeeSignUp").show();
        
     });

     $("#btnSaveManagerDetails").click('input', function(){
        console.log("Button was clicked!");

        authManager();
        addRepo();
        //setTimeout(addRepo,4000);

        setTimeout(addManagerToDatabase,2500);
        LoadManagerPortal();
       
    });

    $("#btnShowBusinessForm").click('input', function(){
        $("#cardManagerSignUp").hide();
        $("#cardAddBusiness").show();
        
     });

     $("#btnLogin").click('input', function(){
        $("#btnSignOut").hide();
        $("#cardLogin").show();
        $("#cardManagerSignUp").hide();
        $("#cardEmployeeSignUp").hide();
        $("#cardInitial").hide();
     });

     $("#btnSubmitLogin").click('input', function(){

     var auth = firebase.auth();
     auth.signInWithEmailAndPassword($('#login_email_address').val(), $('#login_password').val());
     setTimeout(nothing,2500);
     currentUserId = auth.currentUserId;
     var email = $('#login_email_address').val();
     email = email.replace(".","");
 
     return firebase.database().ref('/position/' + email).once('value').then(function(snapshot) {
         if (snapshot["node_"]["value_"] == "Employee")
         {
             isManager = 0;
             LoadEmployeePortal();
         }
         else
         {
             isManager = 1;
             LoadManagerPortal();
         }

     });

     });
});





var auth = firebase.auth();

function nothing()
{
    console.log("nothing wait");
}
function addManagerToDatabase (){

    var uid = auth.currentUser.uid;
     currentUserId = uid;
     isManager = 1;
    console.log(uid);
    var firebaseRef = firebase.database().ref().child('Manager').child(uid);
    var firebaseRef_WhoThis = firebase.database().ref().child("Who's_This?");

    var manager_name = $("#manager_name").val();
    var manager_email = $('#manager_email_address').val(); 
    var phone_number = $("#manager_contact_number").val();
    var bussiness_name = $("#business_name").val()
    var store_number = $('#store_number').val();
    var bussiness_street = $('#street_address').val();
    var bussiness_county = $('#county').val();
    var bussiness_state = $('#state').val();
    var bussiness_zip = $('#zip_code').val();

    firebaseRef.child("Name").set(manager_name);
    firebaseRef.child("Email").set(manager_email);
    firebaseRef.child("Phone").set(phone_number);
    firebaseRef.child("Business").child("Bussiness Name").set(bussiness_name);
    firebaseRef.child("Business").child("Store Number").set(store_number);
    firebaseRef.child("Business").child("Street").set(bussiness_street);
    firebaseRef.child("Business").child("County").set(bussiness_county);
    firebaseRef.child("Business").child("State").set(bussiness_state);
    firebaseRef.child("Business").child("Zip").set(bussiness_zip);
    console.log(lat);
    firebaseRef.child("Business").child("Lat").set(lat);
    firebaseRef.child("Business").child("Long").set(long); 
    firebaseRef.child("Business").child("ID").set(uid);
    manager_email = manager_email.replace('.',"");
    console.log(manager_email);
    firebaseRef_WhoThis.child(manager_email).set("Manager");
}

function authManager () {
    var manager_pass = $("#manager_password").val();
    var manager_email = $('#manager_email_address').val();
   
    auth.createUserWithEmailAndPassword(manager_email, manager_pass);
    
}


function LoadManagerPortal()
{
    $("#btnSignOut").hide();
    $("#cardLogin").hide();
    $("#cardManagerSignUp").hide();
    $("#cardEmployeeSignUp").hide();
    $("#cardInitial").hide();
    $("#cardEmployeePortal").hide();

    $("#cardManagerPortal").show();
}

function LoadEmployeePortal()
{
    $("#btnSignOut").hide();
    $("#cardLogin").hide();
    $("#cardManagerSignUp").hide();
    $("#cardEmployeeSignUp").hide();
    $("#cardInitial").hide();
    $("#cardManagerPortal").hide();
  
    $("#cardEmployeePortal").show();
}

function addRepo() {
    var street = $("#street_address").val();
    street = street.split(' ').join('');
    $.ajax({
        url: "http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=" + $("#state").val() + "&locality=Somewhere&postalCode=" + $("#zip_code").val() + "&addressLine=" + street + "&key=At1MPmDJGjOFF6WZ8rwDyhTn-ZHwl7MAQaeMuIunNCcdk6bYznOGuILjZ2ts5YVp",
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function(res) {

            lat = res["resourceSets"][0]["resources"][0]["geocodePoints"][0]["coordinates"][0];
            long = res["resourceSets"][0]["resources"][0]["geocodePoints"][0]["coordinates"][1];

            console.log(lat);
            console.log(long);

        },

        error : function(res) {
            console.log(res);
        }
    });
}

//http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=AL&locality=Somewhere&postalCode=35401&addressLine=900%Hargrove%Road&key=At1MPmDJGjOFF6WZ8rwDyhTn-ZHwl7MAQaeMuIunNCcdk6bYznOGuILjZ2ts5YVp


function addEmployee()
{

    var employee_name = $('#employee_name').val();
        var phone_number = $('#phone_number').val();
        var email_address = $('#email_address').val();
        var social_security_number = $('#social_security_number').val();
    var random = "employee";
    firebaseRef.child(random).child("employee_name").set(employee_name);
    firebaseRef.child(random).child("phone_number").set(phone_number);
    firebaseRef.child(random).child("email_address").set(email_address);
    firebaseRef.child(random).child("social_security_number").set(social_security_number);
}