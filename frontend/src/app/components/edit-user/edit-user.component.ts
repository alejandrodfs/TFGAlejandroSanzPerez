import { Component, OnInit } from '@angular/core';
import { User } from  '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService]
})
export class EditUserComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(
    private _userService:UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.user = this.identity; 
   }

  ngOnInit() {
    console.log('compoennt de edit user');
    
    console.log(this.identity);
  
  }
  onSubmit(){
    
    console.log(this.user);
    
  }

}
