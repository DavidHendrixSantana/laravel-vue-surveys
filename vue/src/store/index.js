import axios from "axios";
import {createStore} from "vuex"
import axiosClient from "../axios";


const tmpSurveys = [
    {
        id: 100,
        title: 'EXAMPLE SURVEY',
        slug: 'EXAMPLE-SURVEY',
        status: 'draft',
        image: 'https://cdn.pixabay.com/photo/2016/02/21/11/22/bird-1213447_960_720.jpg',
        description: 'examle description <br> lorem',
        created_at: '2021-12-20 18:00:00',
        updated_at: '2021-12-20 18:00:00',
        expire_date: '2021-12-32 18:00:00',
        questions: [ 
            {
                id:1,
                type:'select',
                question:'From which country are you ?',
                description:null,
                data:{
                    options:[
                        {uuid: "123", text:'USA'},
                        {uuid: "456", text:'Mexco'},
                        {uuid: "789", text:'Germany'},
                    ]
                    
                },
            },
            {
                id:2,
                type:'checkbox',
                question:'From which country are you ?',
                description:'Lorem ipsim',
                data:{
                    options:[
                        {uuid: "123", text:'USA'},
                        {uuid: "456", text:'Mexco'},
                        {uuid: "789", text:'Germany'},
                    ]
                    
                },
            },
            {
                id:3,
                type:'radio',
                question:'From which country are you ?',
                description:'Lorem ipsim',
                data:{
                    options:[
                        {uuid: "123", text:'USA'},
                        {uuid: "456", text:'Mexco'},
                        {uuid: "789", text:'Germany'},
                    ]
                    
                },
            },
            {
                id:4,
                type:'text',
                question:'From which country are you ?',
                description:'Lorem ipsim',
                data:{ },
            },
            {
                id:5,
                type:'textarea',
                question:'What do you think about the web ?',
                description:'Lorem ipsim',
                data:{ },
            }
        ],
    },
    {
            id: 200,
            title: 'Laravel 8',
            slug: 'laravel-8',
            status: 'active',
            image: null,
            description: 'examle description <br> lorem',
            created_at: '2021-12-20 18:00:00',
            updated_at: '2021-12-20 18:00:00',
            expire_date: '2021-12-32 18:00:00',
            questions: [],
    },
];

const store = createStore({
    state: {
        user:{
            data:{},
            token:sessionStorage.getItem('TOKEN')
        },
        currentSurvey: {
            loading: false,
            data:{}
        },
        surveys: [...tmpSurveys],
        questionType: ["text", "select", "radio", "checkbox", "textarea"]
    },
    getters: {},
    actions: {
        getSurvey({commit}, id){
            commit("setCurrentSurveyLoading", true)
            return axiosClient
            .get(`/survey/${id}`)
            .then((res) =>{
                commit("setCurrentSurvey", res.data)
                commit("setCurrentSurveyLoading", false)
                return res;
            })
            .catch((err)=>{
                commit("setCurrentSurveyLoading", false)
                throw err
            })
        },
        saveSurvey({commit}, survey){
            delete survey.image_url
        let response;
        if(survey.id){
            response=axiosClient
            .put(`/survey/${survey.id}`,survey)
            .then((res) =>{
                commit("setCurrentSurvey", res.data)
                return res
            })
        }else{
            response = axiosClient.post("/survey",survey).then((res)=>{
                commit("setCurrentSurvey", res.data)
                return res

            })
        }
        return response
        },
        register({commit}, user){
            return axiosClient.post('/register', user)
            .then (({data})=>{
                commit('setUser', data)
                return data
            })

        },
        login({commit}, user){
            return axiosClient.post('/login', user)
            .then (({data})=>{
                commit('setUser', data)
                return data
            })
        },
        logout({commit}){
            return axiosClient.post('/logout')
            .then(response=>{
                commit('logout')
                return response
            })
        }
    },
    mutations : {
        

        setCurrentSurveyLoading:(state, loading) => {
            state.currentSurvey.loading = loading

        },

        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data


        },

            

        logout: (state) => {
            state.user.token  = null
            state.user.data= {}
            sessionStorage.removeItem('TOKEN')
        },
        setUser: (state, userData) =>{
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem('TOKEN', userData.token)


        }
    },
    modules : {}
}) 

export default store ;

