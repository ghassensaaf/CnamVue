import axios from "axios";
const PEC_API_BASE_URL = "http://localhost:8084/cnamplus/prisencharge"

class PecService {

    async addPecWithQr(qrfile){
        return axios.post(PEC_API_BASE_URL+"/addWithQrCode", null , {
            params : {
                filename : qrfile
            }
        })
    }
}
export default new PecService()