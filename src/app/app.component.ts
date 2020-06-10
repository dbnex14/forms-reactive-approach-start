import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

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
        'username': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email])
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
    // on the button.
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  get controls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }
}
