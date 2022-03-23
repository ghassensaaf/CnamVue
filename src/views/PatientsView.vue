<template>
  <v-container>
    <v-card>
      <v-card-title>
        Liste Des Patients
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="mx-4"
        ></v-text-field>
        <v-dialog v-model="qrModal" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Ajouter PEC QR <v-icon right>mdi-qrcode-scan</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add with Qr Code </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Filename*"
                      required
                      v-model="filename"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="qrModal = false">
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                v-on:click="addWithQr(filename)"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="patients"
        :item-key="id"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-container>
                      <v-row justify="center">
                        <v-col cols="6">
                          <v-text-field
                            label="Numero Assure*"
                            required
                            v-model="edited.nassure"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            label="Nom Assure*"
                            required
                            v-model="edited.nomA"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            label="Prenom Assure*"
                            required
                            v-model="edited.prenomA"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            label="Nom Patient*"
                            required
                            v-model="edited.nomP"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            label="Prenom Patient*"
                            required
                            v-model="edited.prenomP"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="center">
                        <v-col cols="6">
                          <v-select
                            :items="qualites"
                            label="Select"
                            v-model="edited.qualite"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5"> Supprimer Patient </v-card-title>
                <v-card-text class="text-center">
                  Voulez-vous vraiment supprimer le patient {{ edited.nom }}
                  {{ edited.prenom }} ?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="goToPatient(item)"> mdi-eye </v-icon>
          <v-icon small class="mr-2" @click="editPatient(item)"> mdi-pencil </v-icon>
          <v-icon small @click="deletePatient(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import PatientService from "../services/PatientService";
import PecService from "../services/PecService";
export default {
  name: "PatientsComponent",
  data() {
    return {
      patients: [],
      qualites: ["AssureLuiMeme", "Conjoint", "Mere", "Pere", "Enfant"],
      qualite: "AssureLuiMeme",
      search: "",
      filename: "",
      dialog: false,
      qrModal: false,
      editedIndex: -1,
      edited: {},
      default: {},
      id : null
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Ajouter Patient" : "Modifier Patient";
    },
    headers() {
      return [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "nom Patient", value: "nom" },
        { text: "prenom Patient", value: "prenom" },
        { text: "Qualite", value: "qualite" },
        { text: "nom Assure", value: "assure.nom" },
        { text: "prenom Assure", value: "assure.prenom" },
        { text: "Numero Assuré", value: "assure.nassure" },
        { text: "Actions", value: "actions", sortable: false },
      ];
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.qrModal = false;
      this.dialogDelete = false;
      this.dialog = false;
      this.patients = this.getPatients()
      this.editedIndex = -1;
      this.edited = {};
      this.filename = "";
      
    },
    getPatients() {
      PatientService.getPatients().then((response) => {
        this.patients = response.data;
      });
    },
    addWithQr(str) {
      PecService.addPecWithQr(str)
        .then(() => {
          this.initialize();
        })
        .catch((err) => {
          console.warn("there was an error : " + err);
          this.initialize();
        });
    },
    addPatient() {
      if (this.nomP != "" && this.prenomP != "") {
          let patient = {
          assure: {
            nassure: this.edited.nassure,
            nom: this.edited.nomA,
            prenom: this.edited.prenomA,
          },
          nom: this.edited.nomP,
          prenom: this.edited.prenomP,
          qualite: this.edited.qualite,
        };
          PatientService.addPatient(patient).then(() => {
          this.initialize()
        });
      }
    },
    deletePatient(item) {
      this.editedIndex = item.id;
      this.edited = item;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      PatientService.deletePatient(this.editedIndex).then(() => {
        this.initialize()
      })
      this.closeDelete()
    },

    editPatient(item){
      this.editedIndex= item.id;
      this.edited = {
        nassure : item.assure.nassure,
        nomA : item.assure.nom,
        prenomA : item.assure.prenom,
        nomP : item.nom,
        prenomP : item.prenom,
        qualite : item.qualite  
      }
      this.dialog = true
    },
    save() {
      if (this.editedIndex > -1) {
        let patient = {
          assure: {
            nassure: this.edited.nassure,
            nom: this.edited.nomA,
            prenom: this.edited.prenomA,
          },
          nom: this.edited.nomP,
          prenom: this.edited.prenomP,
          qualite: this.edited.qualite,
        };
        PatientService.editPatient(patient,this.editedIndex).then(() => {
          this.initialize()
        });
      } else {
        this.addPatient()
        this.initialize()
      }
    },
    goToPatient(item){
      window.location.href = '/#/patients/'+item.id
    },
    close(){
      this.initialize()
    }
  }
};
</script>