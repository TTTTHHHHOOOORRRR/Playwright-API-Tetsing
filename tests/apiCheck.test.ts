import { request } from 'http';
import {test, expect} from 'playwright/test';
import { queryObjects } from 'v8';

const API_URL = "https://api.restful-api.dev";
const OBJECT_ENDPOINT = API_URL + "/objects";

//Creates a test suite names API Test Suite and group the test cases inside of this
test.describe('API Test Suite', () => { 

//create a variable objectId of type string to store the unique id of the object created using POST request
    let objectId: string; 

    //Test case 1 : Get all objects
    test ('Get all objects',async ({ request }) => {

        const response = await request.get(OBJECT_ENDPOINT); //Sends a GET request to the API url

        expect(response.status()).toBe(200); //Check whether the HTTP status is 200 OK if not test case fails

        const data = await response.json(); 
        expect(Array.isArray(data)).toBeTruthy();

    });

    //Test case 2 : Send a POST request to create an object
    test ('Send a POST request to create an object',async ({request}) => {

        const newObject = { name: "Apple MacBook Pro 14", data: { year: 2021, price: 1599, "CPU model": "12-core CPU", "Hard disk size": "1 TB" } }; //newObject variable stores the object before sending it to the API
        const response = await request.post(OBJECT_ENDPOINT, { data: newObject });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('id');
        expect(body.name).toBe(newObject.name);
        expect(body.data.year).toBe(newObject.data.year);
        expect(body.data.price).toBe(newObject.data.price);
        expect(body.data["CPU model"]).toBe(newObject.data["CPU model"]);
        expect(body.data["Hard disk size"]).toBe(newObject.data["Hard disk size"]);

        objectId = body.id; 

    });

    //Test case 3 : GET an object by id
    test ('Get an object by id',async ({request}) => {

        const response = await request.get(OBJECT_ENDPOINT + '/' + objectId);
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.id).toBe(objectId);
        expect(data.name).toBe("Apple MacBook Pro 14")

    });

    //Test case 4 : Send PUT request to update the created object
    test ('Send PUT request to update the created object',async ({request}) => {

        const updatedObject = { name : "Apple MacBook Pro 14 - Updated", data: { year: 2022, price: 1650, "CPU model": "12-core CPU", "Hard disk size": "2 TB" } };
        const response = await request.put(OBJECT_ENDPOINT + '/' + objectId, {data: updatedObject});
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.name).toBe(updatedObject.name);
        expect(body.data.year).toBe(updatedObject.data.year);
        expect(body.data.price).toBe(updatedObject.data.price);
        expect(body.data["Hard disk size"]).toBe(updatedObject.data["Hard disk size"]);

    });

    //Test case 5 : Send DELETE request to delete the created object
    test ('Send DELETE request to delete the created object',async ({request}) => {

        const response = await request.delete(OBJECT_ENDPOINT + '/' + objectId);
        expect(response.status()).toBe(200);

        //Sending GET request to check whether the deleted object exists or not
        const data = await request.get(API_URL + '/' + objectId);
        expect(data.status()).toBe(404);
    });
});