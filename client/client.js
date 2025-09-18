// client.js

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader"); // proto loader gets us the JS files (modules) that help us serialize and deserialize data, like something what protoC does
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// const client = new todoPackage.Todo("localhost:8080", grpc.credentials.createInsecure());
const client = new todoPackage.Todo(process.env.SERVER_PORT, grpc.credentials.createInsecure());
const text = process.argv[2];

const input = process.argv;

if (input.length == 3 && input[2] == "read") {
	client.readTodos({}, (err, response) => {
		// console.log("response read ", JSON.stringify(response));
		if (response.items)
			response.items.forEach(i => { console.log(i.text) });
	});

} else if (input.length >= 4 && input[2] == "create") {

	for (let i = 3; i < input.length; i++) {
		const todo = input[i];
		client.createTodo({
			"id": -1,
			"text": todo
		}, (err, response) => {
			console.log("response create " + JSON.stringify(response));
		});
	}

} else {
	console.log("wrong parameters!");
}

// remote call to createTodo. Single request response call
// client.createTodo({
// 	"id": -1,
// 	"text": text
// }, (err, response) => {
// 	console.log("response create " + JSON.stringify(response));
// });

// remote call to readTodos. Single request response call



// remote call to readTodosStream. Receive stream of data from server
// const call = client.readTodosStream();

// call.on("data", item => { // receiving data stream from server -- on call.write(item) from server
// 	console.log("data item received from server: " + JSON.stringify(item));
// })

// call.on("end", e => console.log("server done!")); // on call.end() from server

/*
 * Client connects to server
 * Client has abstract access to server's services
 * Client makes remote procedure calls by client.procedure_name(call.request, response_handling_callback) -- single request response call
 */