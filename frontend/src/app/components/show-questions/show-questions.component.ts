import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Form} from '../../models/form';
import {Question} from '../../models/question';
import {Answer} from '../../models/answer';
import { element } from 'protractor';



@Component({
  selector: 'app-show-questions',
  templateUrl: './show-questions.component.html',
  styleUrls: ['./show-questions.component.css'],
  providers: [UserService, FormService, QuestionService, AnswerService]
})
export class ShowQuestionsComponent implements OnInit {

  public forms : Form[];
  public form : Form;
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public questions: Question[];
  public confirmado;
  public numQuestions;
  public firstQuestion : Question;
  public answers : Answer[];
  public answerSelected : Answer;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _formService: FormService,
    private _userService : UserService,
    private _questionService : QuestionService,
    private _answerService : AnswerService
    
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.form = new Form('','','');
  }

  ngOnInit() {
    this.getForm();
    
    
  }
  capture(answer){
    this.answerSelected = answer;
  }
  getForm(){
    this._route.params.forEach((params: Params)=>{
      let id = params['Idform'];
      
      this._formService.getForm(id).subscribe(
          response =>{

            if(!response.json().form){
             
              
            }else{
              this.form = response.json().form;
              this._questionService.getQuestions(this.form._id).subscribe(
                response=>{
                  
                  if(!response.json().questions){
                    this.alertMessage = 'Este formulario no tiene cuestiones';
                  }else{
                    this.questions = response.json().questions;
                  }
                  this.numQuestions=this.questions.length;
                  console.log(this.questions.find(element => element.answerBefore == '' && element.questionBefore== ''));
                  this.firstQuestion = this.questions.find(element => element.answerBefore == '' && element.questionBefore== '');
                  this.getAnswers(this.firstQuestion._id);
                }, 
                error => {
                  var errorMessage = <any>error;
          
                  if(errorMessage != null ){
                    var body = JSON.parse(error._body)
                    this.alertMessage = body.message;
                    
                  }
                }
              );
            }

          },
          error => {
            var errorMessage = <any>error;
    
            if(errorMessage != null ){
              var body = JSON.parse(error._body)
              this.alertMessage = body.message;
              
            }
          }
      );
    });
  }
  
  OnDeleteConfirm(id){
    this.confirmado = id;
  }
  onCancelForm(){
    this.confirmado = null;
  }
  onDeleteForm(id){
    this._formService.deleteForm(this.token, id).subscribe(
      response=>{
        if(!response.json().form){
          alert('Error en el servidor');
        }else{
          //Hay que coger todos los formularios que hay 
        }
      },
      error=>{
        var errorMessage = <any>error;
    
            if(errorMessage != null ){
              var body = JSON.parse(error._body)
              this.alertMessage = body.message;
              
            }
      }
    );
    //tenemos todas las preguntas 
    //Ahora para cada una de las preguntas debemos coger todas sus respuestas con un bucle for y borrarlas. Asi con todas las preguntas

    for(var i = 0; i < this.questions.length; i++){
      this.getAnswers(this.questions[i]._id); //get all answers for each question
      this.onDeleteQuestion(this.questions[i]._id);
    }
    this._router.navigate(['/show-forms/1']);

  }
  
  getAnswers(id){
    this._answerService.getAnswers(id).subscribe(
      response=>{
        this.answers = response.json().answers;
      
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      });
  }
  onSubmit(){
    var ids = this.firstQuestion._id +" "+ this.answerSelected._id;
    this.answerSelected.numselect=this.answerSelected.numselect + 1;
    this.editAnswer(this.answerSelected);
    if(this.answerSelected.finalQuestion==true){
       ids='';
       console.log("Es final la respueta");
       this._router.navigate(['end-form',ids]);
    }else{
      console.log("NO es final la respuesta");
      this._router.navigate(['show-question-user/', ids]);
    }
    
  }
  editAnswer(answer: Answer){
    
    this._answerService.editAnswer(answer._id,answer).subscribe(
      response=>{
        if(!response.json().answer){
          this.alertMessage='Error en el servidor';
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

 onDeleteQuestion(id){
  this._questionService.deleteQuestion(this.token, id).subscribe(
    response=>{
      if(!response.json().question){
        alert('Error en el servidor');
      }else{
        //Hay que coger todos los formularios que hay 
      }
    },
    error=>{
      var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
          }
    }
  );
  this.onDeleteAnswers();
  
}

onDeleteAnswers(){

  for (var i= 0; i < this.answers.length; i++){
    console.log(this.answers[i]._id);
    this._answerService.deleteAnswer(this.token, this.answers[i]._id).subscribe(
      response=>{
        if(!response.json().answer){
          alert('Error en el servidor');
        }else{
          //Hay que coger todos los formularios que hay 
          console.log(response.json().answer);
        }
      },
      error=>{
        var errorMessage = <any>error;
    
            if(errorMessage != null ){
              var body = JSON.parse(error._body)
              this.alertMessage = body.message;
              
            }
      }

    );
  }
  
  
}
}
