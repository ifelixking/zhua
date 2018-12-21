const API_SERVER = 'http://localhost'

export function getProjects(){
	fetch(API_SERVER + '/api/project').then((result)=>{
		console.log(result)
	})
}