import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Answer} from '../../models/answer';
import {Question} from '../../models/question';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-edit-question-answers',
  templateUrl: './edit-question-answers.component.html',
  styleUrls: ['./edit-question-answers.component.css'],
  providers: [UserService, QuestionService, AnswerService]
})
export class EditQuestionAnswersComponent implements OnInit {
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public answer1 : Answer;
  public answer2 : Answer;
  public answer3 : Answer;
  public answer4 : Answer;
  public answers : Answer[];
  public add_res: String;
  public opcionSeleccionado;
  public opcionSeleccionadoAnswer;
  public questions: Question[];
  public idform : string;
  public questionSelectedBefore: Question;
  public answerSelectedBefore: Answer;

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
    this.questionSelectedBefore = new Question('','','','','','');
    this.answerSelectedBefore = new Answer('','',0,false,'');
    this.answer1 = new Answer('','',0,false,'');
    this.answer2 = new Answer('','',0,false,'');
    this.answer3 = new Answer('','',0,false,'');
    this.answer4 = new Answer('','',0,false,'');
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
           
          }else{
            this.question = response.json().question;
            var cadena = JSON.stringify(this.question.Idform);
            if(this.question.answerBefore!='' && this.question.questionBefore!=''){
              //llamar a getQuestionSelected y llamar getAnswerSelected
              this.getQuestionSelectedBefore();
              this.getAnswerSelectedBefore();
            }
            this.idform=cadena.split(",")[0].split(":")[1].replace('"','').replace('"','');
            this.getQuestions();

            this._answerService.getAnswers(id).subscribe(
              response=>{
                this.answers = response.json().answers;
                console.log(this.answers);
                if(this.answers[0]!=undefined){
                  this.answer1 = this.answers[0];
                }
                if(this.answers[1]!=undefined){
                  this.answer2 = this.answers[1];
                }
                if(this.answers[2]!=undefined){ 
                  this.answer3 = this.answers[2];
                }
                if(this.answers[3]!=undefined){
                  this.answer4 = this.answers[3];
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
onSubmit(){
  console.log(this.opcionSeleccionado);
  if(this.opcionSeleccionado==undefined && this.opcionSeleccionadoAnswer==undefined){
    this.question.answerBefore=this.answerSelectedBefore._id;
    this.question.questionBefore=this.questionSelectedBefore._id;
  }else{
  if(this.question.answerBefore!=''&& this.question.questionBefore!=''){
    this.question.answerBefore=this.opcionSeleccionadoAnswer._id;
    this.question.questionBefore=this.opcionSeleccionado._id;
  }
  }
  console.log(this.question);
  console.log(this.answer1);
  console.log(this.answer2);
  console.log(this.answer3);
  console.log(this.answer4);
  if(this.question.text!='' && this.question.title!=''){
  this._questionService.editQuestion(this.token, this.question._id, this.question).subscribe(
    response=>{
      if(!response.json().question){
        this.alertMessage='Error en el servidor';
        //this._router.navigate(['/']);
      }else{
        //this.alertMessage='El formulario se ha actualizado correctamente';
        this.question = response.json().question;
      }

    },error => {
      var errorMessage = <any>error;

      if(errorMessage != null ){
        var body = JSON.parse(error._body)
        this.alertMessage = body.message;
        
      }
    }

  );
  }else{
    this.alertMessage='Debes introducir tanto titulo como la pregunta';
  }
  //llamamos a edit answer
  if(this.answer1.text!='' && this.answer2.text!='' && this.answer3.text!='' && this.answer4.text!=''){
    this.editAnswer(this.answer1);
    this.editAnswer(this.answer2);
    this.editAnswer(this.answer3);
    this.editAnswer(this.answer4);
  }else{
    this.alertMessage='Debes introducir todas las respuestas';
  }
  }

  editAnswer(answer: Answer){
    
    this._answerService.editAnswer(answer._id,answer).subscribe(
      response=>{
        //console.log(response.json().answer);
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

    capturarQuestion() {
      // Pasamos el valor seleccionado a la variable verSeleccion
      //console.log(this.opcionSeleccionado);
      this._answerService.getAnswers(this.opcionSeleccionado._id).subscribe(
        response=>{
          this.answers = response.json().answers;
         //console.log(this.answers);
        },
        error => {
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
          }
        });
    }
  capturarAnswer(){
    //console.log(this.opcionSeleccionadoAnswer);
    }

    getQuestions(){
      console.log(this.question);
      this._questionService.getQuestions(this.idform).subscribe(
        response=>{
          
          if(!response.json().questions){
            this.alertMessage = 'Este formulario no tiene cuestiones';
          }else{
            this.questions = response.json().questions;
          
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
    }
    getQuestionSelectedBefore(){
      this._questionService.getQuestion(this.question.questionBefore).subscribe(
        response=>{
          if(!response.json().question){
            this.alertMessage = 'Este formulario no tiene cuestiones';
          }else{
            this.questionSelectedBefore = response.json().question;
            console.log(this.questionSelectedBefore);
          
          }
        },
        error=>{
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
        }
      
    });
  }
  getAnswerSelectedBefore(){
    this._answerService.getAnswer(this.question.answerBefore).subscribe(
      response=>{
        if(!response.json().answer){
          this.alertMessage = 'Este formulario no tiene cuestiones';
        }else{
          this.answerSelectedBefore = response.json().answer;
          console.log(this.answerSelectedBefore);
        
        }
      },
      error=>{
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
      }
    
  });
}
  }


