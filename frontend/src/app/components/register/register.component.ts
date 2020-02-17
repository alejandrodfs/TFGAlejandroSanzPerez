import { Component, OnInit } from '@angular/core';
import { User } from  '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public user: User;
  public identity;
  public token;
  public Message;


  constructor(
    private _userService:UserService
  ) { 
    this.user = new User('','','');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
  }


  onSubmitRegister(){
   
    if(this.user.email!='' && this.user.password!=''){
    this._userService.register(this.user).subscribe(
      response =>{
        let user_register =response.json().user;
        this.user = user_register;
        

        if(!this.user._id){
          this.Message= 'Error en el registrarse';
        }else{
          this.Message= 'El registro se ha realizado correctamente';
          this.user = new User('','','');
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.Message = body.message;
          
        }
      }

    );
    }
    this.Message= 'Debe introducir tanto el correo como la contraseña';
  }

}
