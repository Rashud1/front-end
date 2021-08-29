import axios from "axios";


const rooturl ="http://localhost:8000/"
const taskApi = rooturl + "api/v1/"
const
//post data

constcreateTask = () => {
return new Promise((resolve, reject)=> {
    axios.post("http://localhost:8000/api/v1", frmDt)
		.then(response => {
			console.log(response);
		})
		.catch(error => {
			console.log(error);
            resolve(false);
		});
});
}

//fetch all the ticvkets

const getTaskLists = () => {
    return new Promise((resolve) => {

        try{
            const result = await axios.get(taskApi);
            resolve(result.data);
        } catch (error) {
            console.log(error);
        resolve(false);
        }
    })

};
        // switch task between to do and not to do list 
        // const switchTask = (taskInfo) =>{
        //     return new Promise(async resolve => {
        //         try {
        //             const
        //         }
        //     // })
        // }    