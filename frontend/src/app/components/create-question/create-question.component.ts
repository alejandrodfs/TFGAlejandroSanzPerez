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

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
  providers: [UserService, FormService, QuestionService]
})
export class CreateQuestionComponent implements OnInit {
  public form : Form;
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public questions: Question[];
  public opcionSeleccionado: Question;
  public opcionSeleccionadoAnswer: Question;
  public answers : Answer[];
  public morequestions;
  
  

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _formService: FormService,
    private _userService : UserService,
    private _questionService : QuestionService,
    private _answerService : AnswerService,
    
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.question = new Question('','','','','','');
    this.form = new Form('','','');
  }

  ngOnInit() {
    this.getForm();
    
    
  }
  getForm(){
    this._route.params.forEach((params: Params)=>{
      let id = params['Idform'];
      
      this._formService.getForm(id).subscribe(
          response =>{

            if(!response.json().form){
             
              //this._router.navigate(['/']);
            }else{
              this.form = response.json().form;
              this._questionService.getQuestions(this.form._id).subscribe(
                response=>{
                  
                  if(!response.json().questions){
                    this.alertMessage = 'Este formulario no tiene cuestiones';
                  }else{
                    this.questions = response.json().questions;
                    
                if(this.questions.length==0){
                  this.morequestions='vacio';
                }
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
  onSubmit(){
    this.question.Idform= this.form._id;
    if(this.opcionSeleccionado!= undefined){
      this.question.questionBefore = this.opcionSeleccionado._id;
    }
    if(this.opcionSeleccionadoAnswer!= undefined){
    this.question.answerBefore = this.opcionSeleccionadoAnswer._id;
    }
    this._questionService.addQuestion(this.token, this.question).subscribe(
      response=>{
        console.log(response);
        if(!response.json().question){
          this.alertMessage='Error en el servidor';
        }else{
          this.question =response.json().question;
          this.alertMessage='La pregunta se ha guardado correctamente';
          console.log(this.question);
          this._router.navigate(['/show-questions',this.form._id]);
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
  capturarQuestion() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    console.log(this.opcionSeleccionado);
    this._answerService.getAnswers(this.opcionSeleccionado._id).subscribe(
      response=>{
        this.answers = response.json().answers;
       console.log(this.answers);
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
  console.log(this.opcionSeleccionadoAnswer);
}
}
