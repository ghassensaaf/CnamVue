import axios from "axios";
const PATIENT_API_BASE_URL = "http://localhost:8084/cnamplus/patient"

class PatientService {
    async getPatients(){
        return axios.get(PATIENT_API_BASE_URL+"/findAllByUser")
    }
    async addPatient(patient){
        return axios.post(PATIENT_API_BASE_URL+"/add",patient,{
            params : {
                'Num Assure' : "0"
            }
        })
    }
    async deletePatient(id){
        return axios.delete(PATIENT_API_BASE_URL+"/delete?Id Patient="+id)
    }
    async editPatient(patient, id){
        return axios.put(PATIENT_API_BASE_URL+"/edit",patient,{
            params:{
                'Id Patient' : id
            }
        })
    }
}
export default new PatientService()