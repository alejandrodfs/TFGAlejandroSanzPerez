import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {QuestionService} from '../../services/question.service';
import { Question } from 'src/app/models/question';


@Component({
  selector: 'app-end-form',
  templateUrl: './end-form.component.html',
  styleUrls: ['./end-form.component.css'],
  providers: [QuestionService]
})
export class EndFormComponent implements OnInit {

  public identity;
  public token;
  public alertMessage;
  public idQuestion: string;
  public idAnswer: string;
  public question :Question;


  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _questionService : QuestionService,

  ) { 
    this.question = new Question('','','','','','');
  }

  ngOnInit() {
    this.getParams();
 
  }
  getParams(){
    this._route.params.forEach((params: Params)=>{
      if(params['id']){
        let id = params['id'];
        var parameters = id.split(' ');
        this.idQuestion = parameters[0];
        this.idAnswer = parameters[1];
        console.log(parameters);
        this.getQuestion();
        
      }

    });
  }
  onSubmit(){
    
    this._router.navigate(['show-question-user/', this.question._id]);
   
  }
  getQuestion(){
    this._questionService.getQuestion(this.idQuestion).subscribe(
      response =>{
        console.log(response);
        if(!response.json().question){
         
        }else{
          this.question = response.json().question;
        
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
}
