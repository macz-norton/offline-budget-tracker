let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {

    const db = event.target.result;

    db.createObjectStore("pendingList", { autoIncrement: true });

};

request.onsuccess = function(event) {

    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }

};

request.onerror = function(event) {

    response.json(err);
    console.log("You have an error");

};

function saveRecord(record) {

    const transaction = db.transaction(["pendingList"], "readwrite");
    const pendingListStore = transaction.objectStore("pendingList");

    pendingListStore.add(record);

}