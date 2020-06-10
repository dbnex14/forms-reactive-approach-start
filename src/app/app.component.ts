import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];

  // Reactive approach means you create your form representation programatically in
  // ts code.  We start by creating  a property to hold our form.  Note that programmatically
  // does not mean from scratch, Angular offers lots of help here, too.
  // It is important that the property is of type FormGroup.
  // In template driven approach we imported NgForm from same package as for FormGroup.
  // NgForm was a kind of wrapper but it was wrapping FormGroup because in Angular, a form
  // is just a group of controls.  And that is what FormGroup holds.
  // Note that for the reactive approach to work especially later when we create our 
  // programmatically created form to our html code, you need to import ReactiveFormsModule
  // in your app.module imports[] array.  And you dont need FormsModule, that was needed
  // for template driven approach.  ReactiveFormsModule contains all tools we need to build
  // our form programatically and connect it to html code.
  signupForm: FormGroup;
  // We create custom validators to prevent adding these two names as user names
  forbiddenUserNames = ['Chris', 'Anna'];

  ngOnInit(): void {
    // since there is quite lots of code to create programmatically form and since we need
    // to initialize it before template is rendered, we do it in ngOnInit method.  The controls 
    // just key/value pairs we add to this object.
    // We set the fields we have in html file and initiate new FormControl and pass it 3 params
    // first being initial value of form (like null, or 'Default User Name'), second being
    // array of potential validators, and 3rd being array of potential async validators.
    this.signupForm = new FormGroup({
      // Note use of Validators.required.  required is static method but we are not executing
      // it here so we dont use Validators.required(), we just use required as we are just
      // passing a reference to it.  So, we dont want to execute it.  Also, you can add more
      // than one validator.  Angular will execute it whenever it detects that the input of
      // this contol has changed.  So, it just need to have reference of what it needs to execute
      // at that time.  Note we can also have FormGroup inside another FormGroup to group
      // controls.
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNamesValidator.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmailsAsyncValidator.bind(this))
      }),
      'gender': new FormControl('male'), 
      // here we add FormArray to add group of controls
      'hobbies': new FormArray([])
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  onAddHobby() {
    // Here we add control without any value since user is supposed to provide that
    // but we add validator since hobby should be requred to provide if user clicks
    // on the button.  IMPORTANT: note how I bind 'this' to by forbiddenNamesValidator.
    // This is using good old javascript sintax to do binding and it is needed because
    // the refernce to 'this' inside forbiddenNamesValidator() is not reference to this
    // class but rather Angular runtime environment becaseuse Angular calls this method
    // when it does validation.
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  // Here we create a getter method to return controls from 'hobbies' form array which
  // we access in template.  Note how we first have to cast it to FormArray in order to
  // get access to its controls.
  get controls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  // A custom validator is very easy to create, it is just a function
  // which gets executed by the Angular automatically whenever it checks
  // validity of that control which is whenever you change its value.
  // For a validator to work correctly, it needs to receive control which 
  // it should check and it needs to return something for Angular to be able
  // to handle the return value correctly.
  // This something should be a JS object having any key of type string (note
  // this is just ts syntax for saying we want to have key / value pair where
  // key is of type string) and return type boolean.
  forbiddenNamesValidator(control: FormControl): {[s: string]: boolean} {
    // this should return something like {nameIsForbidden: true}
    // check if value of control is part of our forbiddenUserName
    // IMPORTANT: Who is calling this method?  Angular at times it check validity.
    // THEREFORE: 'this' will not be this class so we cannot use 'this' here.  To
    // fix this, we bind 'this' when we add this validator to Formcontrol above.
    // NOTE however that this checking if control value is part of this array
    // will return -1 if that is not the case, but -1 in boolean is True, so we 
    // need to ensure this is not equal to -1.  If not equal to -1, that means
    // we found it and that means it is invalid.
    if (this.forbiddenUserNames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    // IMPORTANT: if validation is successfull, you should pass null or nothing.
    // You should not pass something like {nameIsForbidden: false}.
    return null;
  }

  // Let's create async validator now in case validation takes some time, say it
  // needs to reach server.  but in this case, we dont return key/value pair of
  // boolean but a Promise of anything or Observable of anything.  These are
  // constructs that handle async data.  NOTE that if you were using 'this' here,
  // we would have to bind it to 'this' instance of this class (which I did above
  // when adding this async validator to FormControl), but it is not needed to
  // do that in this case since I am not using 'this' below.
  forbiddenEmailsAsyncValidator(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          // so if email is invalid we return this object like in sync validator but
          // in async we dont return, we resolve instaead.
          resolve({'emailIsForbidden': true});
        } else {
          // valid email address
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
