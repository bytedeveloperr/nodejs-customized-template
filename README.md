# nodejs-customized-template

This is a simple template built on top of fastify to help build Node.js Apps very quickly.
This project is:

- Based on Node.js v15 and above only.
- MVC based solution
- Built on fastify
- very configurable

## Installation and usage

To install and use this template, you need to have the following installed

- Node.js (version 15+)
- NPM

If the above requirements are met, then you can proceed to the installation which only involve cloning this repository and running `npm install`

```sh
git clone https://github.com/devYusuf/nodejs-customized-template.git
```

and then `cd` into the cloned repository and run:

```sh
npm install
```

## Directory Structure

The directory structure is relatively simple and goes below:

```
.
├── app
└── ├── controllers
    ├── services
    ├── routes
    ├── hooks
    ├── models
├── config
└── ├── app.js
    ├── auth.js
    ├── directories.js
    ├── fastify.js
    ├── plugins.js
├── core
└── ├── model
    ├── utils
    ├── _global.js
    ├── Application.js
    ├── Controller.js
    ├── Router.js
    ├── Validator
├── database
└── ├── migrations
    ├── schema.prisma
├── lib
└── ├── CustomError.js
    ├── response.js
├── index.js
├── package.json
├── README.md
├── .gitignore
```

### The app directory

The app directory contains most of the code you will be writing. It contains subfolders like the `controllers`, `services` and other folders where you will be writing and organizing your code.

#### The app/routes directory

The `app/routes` directory contains your app routes. The routes accepts http requests which are sent to the controllers. All files that are in the app/routes folder are automatically mounted with their corresponding file names. e.g `app/routes/users.js` will automatically be mounted at http://your-app-url.com/users.

#### The app/controllers directory

the `app/controllers` directory contains your app controllers. Controllers handle the url requests recieved from the routes.

#### The app/services directory

The `app/services` directory contains your app services. The service files usually contain your application business logic and are auto-mapped to their controller counterparts.

#### The app/models directory

The `app/models` directory contains your database models. by default it contains custom prisma models which can be deleted and replaced by another database framework's model.

#### The app/hooks directory

The `app/hooks` directory contains files/code that allows you to listen to specific events in the application or request/response lifecycle.

### The config directory

This directory contains most of your project's configuration files, they can easily be changed to fit your use-case or taste.

### The core directory

This directory contains the base code of this template. you really do not need to touch these files unless you are going to make a contribution to the project itself.

### The database directory

This directory should contain your database framework's files (migrations, seeders etc). You can also decide to put your models folder in this directory

### The lib directory

This directory contains small pieces of code that are more than just 'helpers' in your project. although you can decide to use it and the helpers directory interchangeably.

The `index.js` is the application entry point. It contains only few lines of code -:)

## Starting the server

To fire up your project server in development, you only need to run `npm run dev` and a server on port 3000 will be fired up. You can change the default port by creating an environment variable called PORT and set it to your desired port.

## Let's see a demo!

In this Demo we will be building a very simple "Todo list" API. We will be using in-memory array datastructure for holding our todos data.

#### Setting up the project

We will set up and intall the required tools to build our simple app in this section. Firstly, let's clone the Repo by running

```sh
git clone https://github.com/devYusuf/nodejs-customized-template.git todo
```

after cloning the project move into the project directory and install the required npm packages

```sh
cd todo && npm install
```

now after installing the required packages, let's clean the project by removing the `app/controllers/AuthController.js` and `app/controllers/UserController.js` files along with their respective routes, models and services files.

### Our route file

Now, let's create our todos route. create a new file called todos.js at `app/routes/todos.js` and add the following content into it.

```js
export const route = async (server) => {
  server.get("/", async (request, reply) => "Welcome to my TODO App.");
};
```

then start the server using `npm run dev` and let's see what we've got by opening our browser on [http://localhost:3000/todos](http://localhost:3000/todos).

![image](https://user-images.githubusercontent.com/48928718/117370472-58b1d200-aebe-11eb-937c-efb5a17acf1b.png)

Note:

- the route is available on `/todos` because our route file is `todos.js`
- the async keyword are very important for the server to startup
- the route file must either export a default varioble or a `route` variable as seen above
- if you create an `index.js` route file, the route will be mounted at `/` endpoint and not `/index`

Now that we've seen our route in action let's see our controller too. Navigate to `app/controllers` and create a new file called `TodoController.js`.

### Our controller file

```js
const { Controller } = await use("core/Controller.js");

export class TodoController extends Controller {
  constructor(request, reply) {
    super(request, reply);
  }

  async fetchTodos() {
    return "TODOs fetched -:[";
  }
}
```

The above code imports our base controller from `core/Controllers.js` and extends it. by extending the `Controller` we will have access to the request and reply objects.
but what about the use function that's called above the class?. Well, you can see that as an equivalent of the `require()` but it's async in nature. there are lot more to this but just take that for now.

so, let's connect our route to our controller. Go back to the todos.js in the `app/routes` directory and replace it's content with:

```js
const { Controller } = await use("core/Controller.js");

export const route = async (server) => {
  server.get("/", await Controller.use("TodoController", "fetchTodos"));
};
```

The above code also imports the base controller class and we are calling it's static method asynchronous `use` passing two parameters with the first parameter being the controller class and the second parameter being the method.

so, now restart the server. if you check the console (your terminal), you should get a warning like:

![image](https://user-images.githubusercontent.com/48928718/117371927-a16a8a80-aec0-11eb-98ab-6ac8f9801014.png)

That's so because a corresponding service file is automatically bound to your controller from the `app/services` folder but in this case it cannot find it.
Now let's referesh the browser at [http://localhost:3000/todos](http://localhost:3000/todos). and we get the content of our controller back.

![image](https://user-images.githubusercontent.com/48928718/117372302-38cfdd80-aec1-11eb-99e0-c83c22b0928a.png)

### Our Todo service

If we look at the console, we'll see that we still have a warning that an `TodoService.js` file was not found. so let's create that now.
create a new file at `app/services/TodoService.js` and add the following content:

```js
export class TodoService {
  async fetchTodos() {
    return "Fetching Todos from the service file";
  }
}
```

The above code is just a regular class, with nothing special. That's basically how a service file look's like and if we check the console, we'll see that the Warning has disappeared.
so, let's make use of our service in our controller by going back to the `TodoController.js` and modify it's content to this:

```js
const { Controller } = await use("core/Controller.js");

export class TodoController extends Controller {
  constructor(request, reply) {
    super(request, reply);
  }

  async fetchTodos() {
    const todos = await this.service.fetchTodos();
    return todos;
  }
}
```

Note: The `this.service` folder is availbale because the `TodoService` class is automatically bound to the `TodoController`.
now, save and refresh your browser on [http://localhost:3000/todos](http://localhost:3000/todos) and you will see this.

![image](https://user-images.githubusercontent.com/48928718/117400737-27a3c280-aefb-11eb-9653-ae465fd66b67.png).

### Creating todos

let's start by making a POST route to accept the TODO by adding this line to our route file

```js
server.post("/", await Controller.use("TodoController", "createTodo"));
```

and we will update our controller class in (`TodoController.js`) with the `createTodo` method:

```js
async createTodo() {
    const todo = await this.service.createTodo(this.request.body)
    return todo
}
```

and also we will update our `TodoService` class by creating a todos contant above the class and push the new todo into it by replacing the file content with:

```js
const { random } = await use("core/utils/random.js");

const todos = [
  {
    id: "0f44411620366216904",
    title: "Going home",
    completed: true,
  },
];

export class TodoService {
  async fetchTodos() {
    return "Fetching Todos from the service file";
  }

  async createTodo(todo) {
    if (typeof todo !== "object") {
      return { error: "Todo must be of object type" };
    }

    todo.id = await random.id(6);
    todo.completed = false;
    todos.push(todo);
    return todo;
  }
}
```

now, if we try sending a post request to the `http://localhost:3000/todos` endpoint, with a body of e.g

```json
{
  "title": "Write some code..."
}
```

we should get a response like this:

```json
{
  "title": "Write some code...",
  "completed": false,
  "id": "0f44411620366216904"
}
```

![image](https://user-images.githubusercontent.com/48928718/117403606-583a2b00-af00-11eb-9c21-36604bd2a928.png)

#### Fetching our todos

So, we've been able to create Todos now let's fetch all our Todos. We'll also be filtering based on whether they're completed or not.

now let's modify our fetchTodos method in the `AuthService` class like this:

```js
	async fetchTodos(query) {
		if (!query.completed) {
			return todos
		}

		return todos.filter(todo => String(todo.completed) === query.completed )
	}
```

and also the fetchTodos in the `AuthController` like so:

```js
	async fetchTodos() {
		const todos = await this.service.fetchTodos(this.request.query)
		return todos
	}
```

now you can send get requests to `http://localhost:3000/todos` endpoint and you'll receive response of the created Todos. You can also filter todo's by adding query parameter `completed` set to true or false.

![image](https://user-images.githubusercontent.com/48928718/117407194-1d3af600-af06-11eb-8324-4f36964e378f.png)
