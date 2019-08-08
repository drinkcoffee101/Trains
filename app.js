
const cafeList = $('#cafe-list');
const form = $('#add-cafe-form');

//create element and render cafe 
//doc will be each individual 'document element'. firebase stores data by using unique documents
function renderCafe(doc) {
    let li = $('<li>');
    let name = $('<span>').text(doc.data().name);
    let city = $('<span>').text(doc.data().city);
    let frequency = $('<span>').text("Frequency: " + doc.data().frequency + " min");
    let firstOrder = $('<span>').text("First Order: " + doc.data().firstOrder);
    let nextTime = $('<span>').text('Next Time: ' + doc.data().nextTime + "min");
    let cross = $('<div>').text('x');

    li.attr('data-id', doc.id);

    li.append(name);
    li.append(city);
    li.append(frequency);
    li.append(firstOrder);
    li.append(nextTime);
    li.append(cross);

    cafeList.append(li);


    /*=====  Delete Data  ======*/
    $(cross).click(function () {
        let id = $('li').attr('data-id');
        db.collection('cafes').doc(id).delete();

    });
}

//ref to the cafes collection 
//will grab all of the documents
//async request 
//returns a promise 
//will recieve back a snapshot of the databasse

/*=====  Get Data  ======*/
// db.collection('cafes').where('city', '>', 'a').orderBy('city').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });
/*=====  real-time listener  ======*/
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc);
            let frequency = change.doc.data().frequency;

            let firstOrder = moment(change.doc.data().firstOrder, "HH:mm");
            let diffOrder = moment().diff(firstOrder, 'minutes');
            let tRemainder = diffOrder % frequency;
            let minutesTillOrder = frequency - tRemainder;
            let nextOrderTime = moment().add(minutesTillOrder, 'minutes').format('hh:mm');
            console.log(nextOrderTime);
            



        } else if (change.type == 'removed') {
            $('[data-id=' + change.doc.id + ']').remove();
        }
    });
});





/*=====  Set Data  ======*/
$('form').submit(function (e) {
    e.preventDefault();
    db.collection('cafes').add({
        name: $('input[name="name"]').val(),
        city: $('input[name="city"]').val(),
        frequency: $('input[name="frequency"]').val(),
        firstOrder: $('input[name="first"]').val()
    });
    $('input[name="name"]').text('');
    $('input[name="city"]').text('');
    $('input[name="frequency"]').text('');
    $('input[name="first"]').text('');
});



/*=====  Update Data  ======*/
// db.collection('cafes).doc('id of the doc so the data-id').update({
//    name: 'Wario World'
//})


/*=====  Set Data  ======*/
// db.collection('cafes).doc('id of the doc so the data-id').set({
//    name: 'Wario World'
//})
//completely overrides the document 
//won't see the city


