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

};

function checkDatabase() {

    const transaction = db.transaction(["pendingList"], "readwrite");
    const pendingListStore = transaction.objectStore("pendingList");

    const getAll = pendingListStore.getAll();

    getAll.onsuccess = function() {
        
        if (getAll.result.length > 0) {

            fetch("/api/transaction/bulk", {

                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"

                }

            })

            .then((response) => response.json())

            .then(() => {

                const transaction = db.transaction(["pendingList"], "readwrite");
                const pendingListStore = transaction.objectStore("pendingList");
                pendingListStore.clear();

            });
        };
    };

};

window.addEventListener("online", checkDatabase);