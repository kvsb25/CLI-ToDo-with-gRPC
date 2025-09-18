const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader"); // proto loader gets us the JS files (modules) that help us serialize and deserialize data, like something what protoC does
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bindAsync("0.0.0.0:8080", grpc.ServerCredentials.createInsecure(), () => {}); //grpc.ServerCredentials.createSsl() for secure server
//server.bindAsync("localhost:8080", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service,
	{
		"createTodo": createTodo,
		"readTodos": readTodos,
		"readTodosStream": readTodosStream,
	}
);

const todos = [];

// methods in gRPC take two parameters -> call: The call object associated with the request (call that client made), callback: The callback to call to respond to the request (the servers response)
function createTodo(call, callback) {

	const todoItem = {
		"id": todos.length + 1,
		"text": call.request.text
	}
	console.log("in createTodo");

	todos.push(todoItem);
	callback(null, todoItem); // send back todoItem as response to client
	// return value for createTodo in protobuf schema expects an object with int "id", string "text"
}

function readTodos(call, callback) {

	callback(null, { "items": todos }); // return value for readTodo in protobuf schema expects an object with array named "items"
}

// streaming data from server to client on client's remote call
function readTodosStream(call, callback) {

	todos.forEach(item => call.write(item)); // writing on call object for server to client data streaming
	call.end()
}