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
  selector: 'app-show-question',
  templateUrl: './show-question.component.html',
  styleUrls: ['./show-question.component.css'],
  providers: [UserService, FormService, QuestionService, AnswerService]

})
export class ShowQuestionComponent implements OnInit {
  
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public answers : Answer[];
  public add_res;
  public confirmado;
  
  
  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _questionService : QuestionService,
    private _answerService : AnswerService,
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
      this._questionService.getQuestion(id).subscribe(
        response =>{
          
          if(!response.json().question){
           
            //this._router.navigate(['/']);
          }else{
            this.question = response.json().question;

            //coger las respuesta de esa pregunta
            this._answerService.getAnswers(id).subscribe(
              response=>{
                this.answers = response.json().answers;
                console.log(this.answers.length);
                if(this.answers.length==4){
                  this.add_res='lleno';
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
        },
        error => {
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
          }
        });
      
      
  });
}

OnDeleteConfirm(id){
  this.confirmado = id;
}
onCancelquestion(){
  this.confirmado = null;
  
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
  
  this._router.navigate(['/show-forms/1']);
}
}
