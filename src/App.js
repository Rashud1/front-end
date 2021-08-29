import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { AddTaskForm } from "./components/form/AddTaskForm";

import { TaskList } from "./components/task-lists/TaskList";
import { NotToDoList } from "./components/task-lists/NotToDoList";
import axios from 'axios'
import "./App.css";

const hrPwk = 168;
const App = () => {
	const [tasks, setTasks] = useState([]);
	const [badTasks, setBadTasks] = useState([]);
	const [error, setError] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState([]);
	const [badTaskToDelete, setBadTaskToDelete] = useState([]);

	const taskHrs = tasks.reduce((subttl, itm) => subttl + +itm.hr, 0);
	const badHours = badTasks.reduce((subttl, itm) => subttl + +itm.hr, 0);
	const totalHrs = taskHrs + badHours;


	useEffect(() => {
	// fetch all the tickets 
	const { result } = await getTaskLists();
	setTasks(result);
	})

	const addTaskList = frmDt => {
		const result = await createTask(frmDt);	
		console.log(result);
		setTasks(result);
	

		if(result._id){
			//new task has been added successfully. now 
			// we can call api to fetch all the data
			const tickets = await getTaskLists();
			console.log(tickets);
		}else{
			alert("unaable to add the task");

		}

		// sending from data to the server 
		axios.post("http://localhost:8000/api/v1", frmDt)
		.then(response => {
			console.log(response);
		})
		.catch(error => {
			console.log(error);
		});
			
	
	
	
	
	// 	if (hrPwk < totalHrs + +frmDt.hr) {
	// 		setError(true);
	// 	} else {
	// 		error && setError(false);
	// 		setTasks([...tasks, frmDt]);
	// 	}
	};

	//1. create a function and pass to task list component
	//2. on button click, grab the index and pass the index to a function in the parent component
	const markAsBadList = i => {
		//3. take the task out of the task[] based on the index value we received
		const tempTask = [...tasks];
		const badTask = tempTask.splice(i, 1)[0];
		//4. put the taken out task item to the badtask[]
		setBadTasks([...badTasks, badTask]);
		setTasks(tempTask);
	};
	const markAsBadList = async (_id) => {
		console.log(_id);
		const dt = {
			id: _id,
			todo: false,
		};
		const res = await switchTask(dt);
		console.log(res);
		if (res.result._id) {
			const { result } = await getTaskLists();
			console.log(result);
			setTasks(result);
		}
	};

	const markAsGoodList = i => {
		const tempBadList = [...badTasks];
		const goodTask = tempBadList.splice(i, 1)[0];
		setTasks([...tasks, goodTask]);
		setBadTasks(tempBadList);
	};

	// collect indices of the task list that to be deleted
	const handleOnTaskClicked = e => {
		const { checked, value } = e.target;
		if (checked) {
			setTaskToDelete([...taskToDelete, +value]);
		} else {
			const filteredArg = taskToDelete.filter(itme => itme !== +value);
			setTaskToDelete(filteredArg);
		}
	};

	//delete item from task list array only
	const deleteFromTaskList = () => {
		const newArg = tasks.filter((itm, i) => !taskToDelete.includes(i));
		setTaskToDelete([]);
		setTasks(newArg);
	};

	//delete item from bad task list array only
	const deleteFromBadTaskList = () => {
		const newArg = badTasks.filter((itm, i) => !badTaskToDelete.includes(i));
		setBadTaskToDelete([]);
		setBadTasks(newArg);
	};

	//delete list form task list and bad list
	const handleOnDeleteItems = () => {
		deleteFromTaskList();
		deleteFromBadTaskList();
	};

	//list the bad itme index on checkbox click
	const handleOnBadTaskClicked = e => {
		const { checked, value } = e.target;
		if (checked) {
			setBadTaskToDelete([...badTaskToDelete, +value]);
		} else {
			const filterArg = badTaskToDelete.filter(itm => itm !== +value);

			setBadTaskToDelete(filterArg);
		}
	};
// task list only
const taskListOnly = task.filter((item)=> itme.todo)
//bad list only
const badTaskListOnly = tasks.filter((item)=> item.nottodo)




console.log("right befor loading the image")
	return (
		<div className="main">
			<Container>
				<Row>
					<Col>
						<h1 className="text-center mt-5">Not To Do Task List</h1>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						{error && (
							<Alert variant="danger">
								You don't have enough hours to allocate this task
							</Alert>
						)}
					</Col>
				</Row>
				<AddTaskForm addTaskList={addTaskList} />
				<hr />
				<Row>
					<Col>
						<TaskList
							tasks={tasks}
							markAsBadList={markAsBadList}
							handleOnTaskClicked={handleOnTaskClicked}
							taskToDelete={taskToDelete}
						/>
					</Col>
					<Col>
						<NotToDoList
							badTasks={badTasks}
							markAsGoodList={markAsGoodList}
							badHours={badHours}
							handleOnBadTaskClicked={handleOnBadTaskClicked}
							badTaskToDelete={badTaskToDelete}
						/>
					</Col>
				</Row>
				<Row className="py-3">
					<Col>
						<Button variant="danger" onClick={handleOnDeleteItems}>
							Delete
						</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Alert variant="info">
							Your total allocated hours = {totalHrs} / 168 hours per week
						</Alert>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default App;
