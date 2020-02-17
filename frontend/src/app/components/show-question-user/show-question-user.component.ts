import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Question} from '../../models/question';
import {Answer} from '../../models/answer';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-show-question-user',
  templateUrl: './show-question-user.component.html',
  styleUrls: ['./show-question-user.component.css'],
  providers: [UserService, FormService, QuestionService, AnswerService]
})
export class ShowQuestionUserComponent implements OnInit {
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public answers : Answer[];
  public answerSelected : Answer;
  public idQuestion : string;
  public idAnswer: string;
  

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _answerService: AnswerService,
    private _userService : UserService,
    private _questionService : QuestionService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.question = new Question('','','','','','');
  }

  ngOnInit() {
    this.getQuestionAndAnswers();
    

  }
  getQuestionAndAnswers(){
    
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      var parameters = id.split(' ');
      this.idQuestion = parameters[0];
      if(parameters[1]){
        this.idAnswer = parameters[1];
        console.log(parameters);
        this._questionService.getNextQuestion(this.idQuestion, this.idAnswer).subscribe(
          response=>{
            if(!response.json().question){
              alert('Error en el servidor');
            }else{
              this.question = response.json().question;
              //coger todas la respuestas de esa pregunta
              this._answerService.getAnswers(this.question._id).subscribe(
                response=>{
                  this.answers = response.json().answers;
                  console.log(this.answers.length);

                },
                error => {
                  var errorMessage = <any>error;
                  if(errorMessage != null ){
                    var body = JSON.parse(error._body)
                    this.alertMessage = body.message;
                    
                  }
                });
              
            }
          },
          error=>{
            var errorMessage = <any>error;
            console.log('error');
            var ids = this.idQuestion +" "+ this.idAnswer;
            this._router.navigate(['end-form',ids]);
            if(errorMessage != null ){
              var body = JSON.parse(error._body)
              this.alertMessage = body.message;
              
            }
          }
       )
      }else{
          this._questionService.getQuestion(this.idQuestion).subscribe(
            response =>{
              console.log(response);
              if(!response.json().question){
               
              }else{
                this.question = response.json().question;
                  this._answerService.getAnswers(this.question._id).subscribe(
                  response=>{
                    this.answers = response.json().answers;
                    console.log(this.answers.length);
      
                  },
                  error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null ){
                      var body = JSON.parse(error._body)
                      this.alertMessage = body.message;
                      
                    }
                  });
              }
            },
            error => {
              var errorMessage = <any>error;
      
              if(errorMessage != null ){
                var body = JSON.parse(error._body)
                this.alertMessage = body.message;
                
              }
            });
          
      
        
      }
    });
  
  }
  capture(answer){
    console.log(this.answerSelected);
    this.answerSelected = answer;
    
  }
  onSubmit(){
    var ids = this.question._id +" "+ this.answerSelected._id;
    //Aumentar en uno el numero de veces seleccionado
    this.answerSelected.numselect=this.answerSelected.numselect + 1;
    this.editAnswer(this.answerSelected);
    console.log(this.answerSelected);
    if(this.answerSelected.finalQuestion==true){
      console.log("si que es final question");
      ids='';
       this._router.navigate(['end-form', ids]);
    }else{
      this._router.navigate(['show-question-user/', ids]);
    } 
  }
  
  editAnswer(answer: Answer){
    
    this._answerService.editAnswer(answer._id,answer).subscribe(
      response=>{
        console.log(response.json().answer);
        if(!response.json().answer){
          this.alertMessage='Error en el servidor';
          //this._router.navigate(['/']);
        }else{
          this.alertMessage='El formulario se ha actualizado correctamente';
         
        }
      },error => {
        var errorMessage = <any>error;
  
        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      }
    );
    }
}
