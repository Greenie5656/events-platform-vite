import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

function FirebaseTest() {
    const [testResult, setTestResult] = useState("");

    const testFirebase = async () => {
        try {
            // test writing to firestore
            const docRef = await addDoc(collection(db, "test"), {
                message: "Firebase is working!",
                timestamp: new Date()
            });

            // test reading from firebase
            const querySnapshot =  await getDocs(collection(db, "test"));
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setTestResult(`Firebase connection successful! Added document with ID: ${docRef.id}`);
            console.log("Test documents:", documents);

        } catch (error) {
            setTestResult(`Error testing Firebase: ${error.message}`)
            console.error("Firebase test error:", error);
        }
    };

    return (
        <div className="my-4 p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">Firebase Conection Test</h2>
            <button
                onClick={testFirebase}
                className="bg-blue-500 text-white px-4 py-2 rounded">
                    TEST FIREBASE CONNECTION
                </button>
                {testResult && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        {testResult}
                    </div>
                )}

        </div>
    );
}

export default FirebaseTest;